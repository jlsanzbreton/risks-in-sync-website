import { renderToString } from "react-dom/server";
import { App } from "./main";
import { reviews } from "./generated/reviews";
import type { ReviewImage, ReviewIssue } from "./content/review-types";

const SITE_URL = "https://risksinsync.com";
const FALLBACK_IMAGE = `${SITE_URL}/risksinsync-og.png`;

function socialImage(review: ReviewIssue): { url: string; alt: string; width?: number; height?: number } {
  const image: ReviewImage | undefined = review.images.find((candidate) => candidate.role === "social")
    ?? review.images.find((candidate) => candidate.role === "hero")
    ?? review.images.find((candidate) => candidate.role === "homepage");
  return image
    ? { url: `${SITE_URL}/review/${review.slug}/${image.path}`, alt: image.alt, width: image.intrinsic_width, height: image.intrinsic_height }
    : { url: FALLBACK_IMAGE, alt: "Risks In Sync", width: 1200, height: 630 };
}

export function render(pathname: string): string {
  return renderToString(<App pathname={pathname} />);
}

export function structuredData(pathname: string): object | object[] {
  const path = pathname.replace(/\/+$/, "") || "/";
  const author = {
    "@type": "Person",
    "@id": `${SITE_URL}/about/#author`,
    name: "Jose Luis Sanz",
    url: `${SITE_URL}/about/`,
    sameAs: ["https://www.linkedin.com/in/jlsanz/"],
  };

  if (path === "/") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Risks In Sync",
        url: `${SITE_URL}/`,
        inLanguage: "en",
        publisher: author,
      },
      { "@context": "https://schema.org", ...author },
    ];
  }

  if (path === "/about") return { "@context": "https://schema.org", ...author };

  const review = reviews.find((candidate) => candidate.path.replace(/\/+$/, "") === path);
  if (!review) return [];
  const image = socialImage(review);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${SITE_URL}${review.path}#article`,
      mainEntityOfPage: `${SITE_URL}${review.path}`,
      headline: review.title,
      description: review.summary,
      datePublished: review.publication_date,
      author,
      publisher: author,
      image: { "@type": "ImageObject", url: image.url, caption: image.alt, width: image.width, height: image.height },
      inLanguage: review.language,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Cascade Risk Review", item: `${SITE_URL}/review/` },
        { "@type": "ListItem", position: 3, name: review.issue.label, item: `${SITE_URL}${review.path}` },
      ],
    },
  ];
}

export function publicationData(): ReviewIssue[] {
  return reviews;
}
