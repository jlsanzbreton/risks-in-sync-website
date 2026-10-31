import assert from "node:assert/strict";
import test from "node:test";
import { resolveReviewCover } from "../src/review-cover";
import type { ReviewIssue } from "../src/content/review-types";

function review(slug: string, images: ReviewIssue["images"]): ReviewIssue {
  return {
    schema_version: 1,
    id: slug,
    slug,
    status: "ready_for_pr",
    issue: { year: 1, number: 8, label: "Year 1 · Nr. 8" },
    review_period: { start: "2026-10-20", end: "2026-10-26" },
    publication_date: "2026-10-27",
    title: "A review title",
    dek: "A review dek.",
    summary: "A review summary.",
    author: "Jose Luis Sanz",
    language: "en",
    method_version: "risks-in-sync-v1",
    editorial: null,
    cascade: { title: "Cascade", subtitle: "Subtitle", steps: ["Step"], outcome_status: "contained", observed_outcome: "Observed", counterfactual_outcome: null, evidence_status: "REPORTED", note: "Note" },
    sources: [],
    images,
    path: `/review/${slug}/`,
    reviewPeriodLabel: "20–26 October 2026",
    publicationDateLabel: "27 October 2026",
    html: { beforeCascade: "", afterCascade: "", afterFeedback: "" },
  };
}

test("uses a declared cover before the legacy fallback", () => {
  const cover = resolveReviewCover(review("year-1-nr-8", [{
    id: "cover",
    path: "assets/cover.png",
    role: "cover",
    alt: "A declared issue cover.",
    decorative: false,
    credit: null,
    source_url: null,
    rights_basis: "cleared",
    verification: "cleared",
  }]));

  assert.deepEqual(cover, {
    src: "/year-1-nr-8/assets/cover.png",
    alt: "A declared issue cover.",
    image: {
      id: "cover",
      path: "assets/cover.png",
      role: "cover",
      alt: "A declared issue cover.",
      decorative: false,
      credit: null,
      source_url: null,
      rights_basis: "cleared",
      verification: "cleared",
    },
  });
});

test("keeps the N8 cover visible until its pack owns one", () => {
  assert.equal(resolveReviewCover(review("year-1-nr-8", []))?.src, "/cascade-risk-review-cover-y1-n8.png");
});

test("does not invent a cover for legacy issues without artwork", () => {
  assert.equal(resolveReviewCover(review("year-1-nr-7", [])), null);
});
