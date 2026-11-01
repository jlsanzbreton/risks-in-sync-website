export type EvidenceStatus = "REPORTED" | "OBSERVED" | "INFERRED" | "UNKNOWN";
export type CascadeOutcomeStatus = "contained" | "partially_propagated" | "fully_propagated" | "ongoing" | "uncertain";

export interface ReviewIssueMeta {
  year: number;
  number: number;
  label: string;
}

export interface ReviewPeriod {
  start: string;
  end: string;
}

export interface ReviewSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  published_date: string;
  accessed_date: string;
  kind: "primary" | "secondary" | "context";
  verification: "verified" | "unverified";
  note: string;
}

export interface ReviewImage {
  id: string;
  path: string;
  role: "cover" | "homepage" | "hero" | "inline" | "social";
  alt: string;
  decorative: boolean;
  label?: string | null;
  caption?: string | null;
  credit: string | null;
  source_url: string | null;
  rights_basis: string | null;
  verification: "cleared" | "pending";
  /** Added by the website generator from the published asset; not part of the publication pack. */
  intrinsic_width?: number;
  /** Added by the website generator from the published asset; not part of the publication pack. */
  intrinsic_height?: number;
}

export interface ReviewFrontmatterBase {
  id: string;
  slug: string;
  status: "draft" | "ready_for_pr";
  issue: ReviewIssueMeta;
  review_period: ReviewPeriod;
  publication_date: string;
  title: string;
  dek: string;
  summary: string;
  author: string;
  language: "en";
  method_version: string;
  editorial: string | null;
  cascade: {
    title: string;
    subtitle: string;
    steps: string[];
    outcome_status: CascadeOutcomeStatus;
    observed_outcome: string;
    counterfactual_outcome: string | null;
    evidence_status: EvidenceStatus;
    note: string;
  };
  sources: ReviewSource[];
  images: ReviewImage[];
}

export interface PublicationPackV1 extends ReviewFrontmatterBase {
  schema_version: 1;
}

export type EditorialModule =
  | { type: "editorial_note"; body: string }
  | { type: "operator_checklist"; items: Array<{ signal: string; response: string }> }
  | { type: "decision_log"; entries: Array<{ decision: string; rationale: string; evidence_status: EvidenceStatus }> };

export interface PublicationPackV2 extends ReviewFrontmatterBase {
  schema_version: 2;
  /** V2 keeps article cover and homepage vignette outside the general image list. */
  assets: {
    cover: Omit<ReviewImage, "role">;
    homepage_vignette: Omit<ReviewImage, "role"> & { label: string; caption: string };
  };
  editorial_modules: EditorialModule[];
}

export type ReviewFrontmatter = PublicationPackV1 | PublicationPackV2;

export type ReviewIssue = ReviewFrontmatter & {
  path: string;
  reviewPeriodLabel: string;
  publicationDateLabel: string;
  html: {
    beforeCascade: string;
    afterCascade: string;
    afterFeedback: string;
  };
};
