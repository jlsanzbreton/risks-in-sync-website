import assert from "node:assert/strict";
import test from "node:test";
import type { ReviewIssue } from "../src/content/review-types";
import { normalizeSearchText, reviewNeighbors, searchReviews } from "../src/review-discovery";

function makeReview(slug: string, title: string, body: string): ReviewIssue {
  return {
    schema_version: 1,
    id: slug,
    slug,
    status: "ready_for_pr",
    title,
    dek: `${title} detail`,
    summary: `${title} summary`,
    author: "Jose Luis Sanz",
    issue: { year: 1, number: slug.endsWith("2") ? 2 : 1, label: slug },
    review_period: { start: "2026-09-08", end: "2026-09-14" },
    publication_date: "2026-09-16",
    publicationDateLabel: "16 September 2026",
    reviewPeriodLabel: "8–14 September 2026",
    language: "en",
    method_version: "risks-in-sync-v1",
    editorial: null,
    cascade: {
      title: "Propagation path",
      subtitle: "Observed cascade",
      steps: ["Initial disturbance", "Recovery"],
      outcome_status: "contained",
      observed_outcome: "The system recovered.",
      counterfactual_outcome: null,
      evidence_status: "OBSERVED",
      note: "A simplified model.",
    },
    sources: [],
    images: [],
    path: `/review/${slug}/`,
    html: { beforeCascade: `<p>${body}</p>`, afterCascade: "", afterFeedback: "" },
  };
}

const reviews = [
  makeReview("year-1-nr-2", "Hurricane Lowell", "Kauaʻi island restoration"),
  makeReview("year-1-nr-1", "German power shock", "The grid absorbed the loss"),
];

test("normalizes case, accents and whitespace for archive search", () => {
  assert.equal(normalizeSearchText("  RÉVIEW\nTerm  "), "review term");
});

test("searches across generated review content", () => {
  assert.equal(searchReviews(reviews, "Hurricane Lowell")[0]?.slug, "year-1-nr-2");
  assert.equal(searchReviews(reviews, "German power")[0]?.slug, "year-1-nr-1");
  assert.deepEqual(searchReviews(reviews, "term-that-is-not-present"), []);
});

test("returns unambiguous older and newer review neighbors", () => {
  assert.ok(reviews.length >= 2);

  const latestNeighbors = reviewNeighbors(reviews, reviews[0].slug);
  assert.equal(latestNeighbors.newerReview, undefined);
  assert.equal(latestNeighbors.olderReview?.slug, reviews[1].slug);

  const olderNeighbors = reviewNeighbors(reviews, reviews[1].slug);
  assert.equal(olderNeighbors.newerReview?.slug, reviews[0].slug);
});
