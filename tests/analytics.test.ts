import assert from "node:assert/strict";
import test from "node:test";
import { analyticsAvailable, analyticsInternals, readAnalyticsConsent, setAnalyticsConsent } from "../src/analytics";

test("accepts only plausible GA4 measurement IDs", () => {
  assert.equal(analyticsInternals.validMeasurementId("G-ABC12345"), true);
  assert.equal(analyticsInternals.validMeasurementId("UA-123-1"), false);
  assert.equal(analyticsInternals.validMeasurementId("G-short"), false);
  assert.equal(analyticsInternals.validMeasurementId(""), false);
});

test("persists an explicit analytics choice without requiring a browser", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };

  assert.equal(readAnalyticsConsent(storage), "unknown");
  setAnalyticsConsent("accepted", storage);
  assert.equal(readAnalyticsConsent(storage), "accepted");
  setAnalyticsConsent("rejected", storage);
  assert.equal(readAnalyticsConsent(storage), "rejected");
});

test("analytics is unavailable during tests and server rendering", () => {
  assert.equal(analyticsAvailable(), false);
});
