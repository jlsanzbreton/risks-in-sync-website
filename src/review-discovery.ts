import type { ReviewIssue } from "./content/review-types";

function plainText(html: string): string {
  return html.replace(/<[^>]*>/g, " ");
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .replace(/\s+/g, " ")
    .trim();
}

function reviewSearchText(review: ReviewIssue): string {
  return normalizeSearchText([
    review.issue.label,
    review.title,
    review.dek,
    review.summary,
    review.author,
    review.publicationDateLabel,
    review.reviewPeriodLabel,
    review.cascade.title,
    review.cascade.subtitle,
    review.cascade.observed_outcome,
    review.cascade.counterfactual_outcome ?? "",
    ...review.cascade.steps,
    ...review.sources.flatMap((source) => [source.title, source.publisher, source.note]),
    plainText(review.html.beforeCascade),
    plainText(review.html.afterCascade),
    plainText(review.html.afterFeedback),
  ].join(" "));
}

export function searchReviews(reviewList: ReviewIssue[], query: string): ReviewIssue[] {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  if (terms.length === 0) return reviewList;

  return reviewList.filter((review) => {
    const haystack = reviewSearchText(review);
    return terms.every((term) => haystack.includes(term));
  });
}

export function reviewNeighbors(reviewList: ReviewIssue[], slug: string): {
  olderReview?: ReviewIssue;
  newerReview?: ReviewIssue;
} {
  const index = reviewList.findIndex((review) => review.slug === slug);
  if (index === -1) return {};

  return {
    olderReview: reviewList[index + 1],
    newerReview: reviewList[index - 1],
  };
}
