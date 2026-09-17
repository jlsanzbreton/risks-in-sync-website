export type AnalyticsConsent = "unknown" | "accepted" | "rejected";

type AnalyticsEventName = "feedback_submit" | "review_navigation";
type AnalyticsEventParameters = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const CONSENT_KEY = "risks-in-sync-analytics-consent-v1";
const MEASUREMENT_ID = import.meta.env?.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
const PUBLIC_HOSTNAME = "risksinsync.com";
let initialized = false;

function validMeasurementId(value: string): boolean {
  return /^G-[A-Z0-9]{6,}$/.test(value);
}

export function analyticsAvailable(): boolean {
  return Boolean(import.meta.env?.PROD)
    && typeof window !== "undefined"
    && window.location.hostname === PUBLIC_HOSTNAME
    && validMeasurementId(MEASUREMENT_ID);
}

export function readAnalyticsConsent(storage: Pick<Storage, "getItem"> = window.localStorage): AnalyticsConsent {
  const value = storage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : "unknown";
}

function removeAnalyticsCookies(): void {
  const cookieNames = document.cookie.split(";").map((cookie) => cookie.split("=")[0]?.trim()).filter(Boolean);
  for (const name of cookieNames) {
    if (name === "_ga" || name?.startsWith("_ga_")) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${PUBLIC_HOSTNAME}; SameSite=Lax`;
    }
  }
}

export function setAnalyticsConsent(
  consent: Exclude<AnalyticsConsent, "unknown">,
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  storage.setItem(CONSENT_KEY, consent);
  if (!analyticsAvailable()) return;

  window[`ga-disable-${MEASUREMENT_ID}`] = consent === "rejected";
  if (consent === "rejected") removeAnalyticsCookies();
}

function canonicalPageLocation(): string {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  return canonical ?? `${window.location.origin}${window.location.pathname}`;
}

export function initializeAnalytics(): void {
  if (!analyticsAvailable() || readAnalyticsConsent() !== "accepted") return;
  window[`ga-disable-${MEASUREMENT_ID}`] = false;
  if (initialized) return;
  initialized = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  window.gtag("event", "page_view", {
    page_location: canonicalPageLocation(),
    page_path: window.location.pathname,
    page_title: document.title,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.append(script);
}

export function trackEvent(name: AnalyticsEventName, parameters: AnalyticsEventParameters = {}): void {
  if (!analyticsAvailable() || readAnalyticsConsent() !== "accepted" || !window.gtag) return;
  window.gtag("event", name, parameters);
}

export const analyticsInternals = { CONSENT_KEY, validMeasurementId };
