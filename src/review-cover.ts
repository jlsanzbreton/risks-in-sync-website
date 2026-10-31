import type { ReviewImage, ReviewIssue } from "./content/review-types";

const legacyCovers: Record<string, string> = {
  "year-1-nr-8": "/cascade-risk-review-cover-y1-n8.png",
  "year-1-nr-2": "/cascade-risk-review-cover-y1-n2.png",
};

export interface ReviewCover {
  src: string;
  alt: string;
  image?: ReviewImage;
}

/**
 * Packs produced before Publication Pack v2 cannot declare a cover. The
 * fallback preserves their published history while new packs own their cover.
 */
export function resolveReviewCover(review: ReviewIssue): ReviewCover | null {
  const image = review.images.find((candidate) => candidate.role === "cover");
  if (image) {
    return {
      src: `/${review.slug}/${image.path}`,
      alt: image.alt,
      image,
    };
  }

  const src = legacyCovers[review.slug];
  return src ? { src, alt: `Cascade Risk Review cover, ${review.issue.label}` } : null;
}
