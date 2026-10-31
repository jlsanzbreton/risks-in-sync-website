import assert from "node:assert/strict";
import test from "node:test";
import { resolveHomepageIllustration } from "../src/homepage-illustration";
import type { ReviewImage, ReviewIssue } from "../src/content/review-types";

const homepageImage: ReviewImage = {
  id: "homepage",
  path: "assets/homepage.webp",
  role: "homepage",
  alt: "A verified editorial illustration.",
  label: "System signal",
  caption: "A cleared image remains the site illustration.",
  decorative: false,
  credit: "Editorial desk",
  source_url: "https://example.com/image",
  rights_basis: "Licensed for editorial publication.",
  verification: "cleared",
};

function review(slug: string, images: ReviewImage[]): ReviewIssue {
  return {
    schema_version: 1,
    id: slug,
    slug,
    status: "ready_for_pr",
    issue: { year: 1, number: Number(slug.at(-1)), label: slug },
    review_period: { start: "2026-09-01", end: "2026-09-07" },
    publication_date: "2026-09-08",
    title: slug,
    dek: "A review fixture.",
    summary: "A review fixture.",
    author: "Jose Luis Sanz",
    language: "en",
    method_version: "risks-in-sync-v1",
    editorial: null,
    cascade: {
      title: "Path",
      subtitle: "Path",
      steps: ["Event"],
      outcome_status: "contained",
      observed_outcome: "Contained.",
      counterfactual_outcome: null,
      evidence_status: "REPORTED",
      note: "Fixture.",
    },
    sources: [],
    images,
    path: `/review/${slug}/`,
    reviewPeriodLabel: "1–7 September 2026",
    publicationDateLabel: "8 September 2026",
    html: { beforeCascade: "", afterCascade: "", afterFeedback: "" },
  };
}

test("uses the most recent declared homepage image when the latest review has none", () => {
  const latest = review("year-1-nr-5", []);
  const illustrated = review("year-1-nr-4", [homepageImage]);

  assert.deepEqual(resolveHomepageIllustration([latest, illustrated]), { review: illustrated, image: homepageImage });
});

test("falls back only when no published review declares a homepage image", () => {
  assert.equal(resolveHomepageIllustration([review("year-1-nr-5", []), review("year-1-nr-4", [])]), null);
});
