interface Metric {
  id: string;
  name: string;
  value: number;
}

// Type definition for navigator.connection
interface NetworkInformation {
  effectiveType: string;
  [key: string]: any;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed(): string {
  const nav = navigator as NavigatorWithConnection;
  
  return 'connection' in nav && 
    nav.connection && 
    'effectiveType' in nav.connection
    ? nav.connection.effectiveType
    : '';
}

export function sendToVercelAnalytics(metric: Metric): void {
  const analyticsId = process.env.REACT_APP_VERCEL_ANALYTICS_ID;
  if (!analyticsId) {
    return;
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  const blob = new Blob([new URLSearchParams(body).toString()], {
    // This content type is necessary for `sendBeacon`
    type: 'application/x-www-form-urlencoded',
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    });
} 