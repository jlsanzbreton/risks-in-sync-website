import type { ReviewImage, ReviewIssue } from "./content/review-types";

export interface HomepageIllustration {
  review: ReviewIssue;
  image: ReviewImage;
}

/**
 * Reviews are ordered newest first. A later text-only review must not discard
 * an editorial illustration that was explicitly approved in an earlier pack.
 */
export function resolveHomepageIllustration(reviews: readonly ReviewIssue[]): HomepageIllustration | null {
  for (const review of reviews) {
    const image = review.images.find((candidate) => candidate.role === "homepage");
    if (image) return { review, image };
  }
  return null;
}
