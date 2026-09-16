import { StrictMode, useEffect, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { reviews } from "./generated/reviews";
import type { CascadeOutcomeStatus, ReviewImage, ReviewIssue, ReviewSource } from "./content/review-types";
import { reviewNeighbors, searchReviews } from "./review-discovery";
import "./styles.css";

const CONTACT_POINTER_NAVIGATION_KEY = "risks-in-sync-contact-pointer-navigation";
const latestReview = reviews[0];
const firstReview = reviews.at(-1) ?? latestReview;

function Arrow({ children }: { children: ReactNode }) {
  return <span aria-hidden="true">{children}</span>;
}

function SiteHeader() {
  const path = window.location.pathname;
  const isReview = path.startsWith("/review");
  const isAbout = path.startsWith("/about");

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="wordmark" href="/" aria-label="Risks In Sync home">
          <span>RISKS</span>
          <i aria-hidden="true" />
          <span>IN SYNC</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/review/" aria-current={isReview ? "page" : undefined}>Review</a>
          <a href="/about/" aria-current={isAbout ? "page" : undefined}>About</a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <a className="footer-mark" href="/">RISKS IN SYNC</a>
          <p className="footer-author">Published by Jose Luis Sanz</p>
        </div>
        <div className="footer-meta">
          <p>AI-assisted <span>·</span> Human-edited <span>·</span> Source-backed</p>
          <div className="footer-links">
            <a href="/privacy/">Privacy</a>
            <ContactLink />
          </div>
        </div>
      </div>
    </footer>
  );
}

function focusContactSection(showFocusRing = true) {
  const section = document.getElementById("contact");
  const heading = document.getElementById("contact-title");

  if (!section || !heading) return;

  heading.dataset.focusRing = showFocusRing ? "visible" : "suppressed";
  heading.focus({ preventScroll: true });
  section.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

function ContactLink() {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";

    if (path !== "/about") {
      if (event.detail > 0) {
        window.sessionStorage.setItem(CONTACT_POINTER_NAVIGATION_KEY, "true");
      } else {
        window.sessionStorage.removeItem(CONTACT_POINTER_NAVIGATION_KEY);
      }
      return;
    }

    event.preventDefault();
    if (window.location.hash !== "#contact") {
      window.history.pushState(null, "", "/about/#contact");
    }
    window.requestAnimationFrame(() => focusContactSection(event.detail === 0));
  };

  return <a href="/about/#contact" onClick={handleClick}>Contact</a>;
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const updateVisibility = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > Math.max(480, window.innerHeight * 0.75));
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  const scrollToTop = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <button
      className={`back-to-top${isVisible ? " visible" : ""}`}
      type="button"
      aria-label="Back to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={scrollToTop}
    >
      <Arrow>↑</Arrow>
    </button>
  );
}

function LatestIssue({ compact = false, review = latestReview }: { compact?: boolean; review?: ReviewIssue }) {
  return (
    <article className={compact ? "latest-card compact" : "latest-card"}>
      <div className="issue-line">
        <span>{review.issue.label}</span>
        <span>{review.publicationDateLabel}</span>
      </div>
      <h3>{review.title}</h3>
      <p>{review.summary}</p>
      <a className="text-link" href={review.path}>Read the review <Arrow>→</Arrow></a>
    </article>
  );
}

function HomePage() {
  const homepageImage = latestReview.images.find((image) => image.role === "homepage");

  return (
    <PageShell>
      <section className="home-hero wrap">
        <div className="eyebrow">RISKS IN SYNC</div>
        <div className="hero-grid">
          <div>
            <h1>Accidents are inevitable.<br />Catastrophes are not.</h1>
          </div>
          <div className="hero-copy">
            <p>Risks In Sync explores how disturbances move through connected physical, digital and human systems—and why some failures stop while others become cascades.</p>
            <a className="hero-review-link" href={latestReview.path}>
              <span className="hero-review-meta"><b>Cascade Risk Review</b><small>{latestReview.issue.label}</small></span>
              <strong>{latestReview.title}</strong>
              <span className="hero-review-action">Read the review <Arrow>→</Arrow></span>
            </a>
          </div>
        </div>
      </section>

      <figure className="home-illustration wrap">
        {homepageImage ? (
          <img
            src={imageUrl(latestReview, homepageImage)}
            loading="lazy"
            decoding="async"
            alt={homepageImage.alt}
          />
        ) : (
          <picture>
            <source media="(max-width: 760px)" srcSet="/risks-in-sync-background-noise-960.webp" />
            <img
              src="/risks-in-sync-background-noise-1672.webp"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
              alt={'Two wildebeest stand among crocodiles beside a sign reading "Danger crocodiles ahead." One asks, "What\'s that sign?" The other replies, "Just background noise."'}
            />
          </picture>
        )}
        <figcaption>
          <strong>{homepageImage?.label ?? "Gray Zones · Signal"}</strong>
          <span>{homepageImage?.caption ?? "When a visible warning becomes familiar enough to be treated as background noise."}</span>
        </figcaption>
      </figure>

      <section className="section dark-section">
        <div className="wrap two-column">
          <div className="section-intro">
            <p className="kicker">The publication</p>
            <h2>Cascade Risk Review</h2>
            <p>One recent real-world event. Multiple connected systems. A closer look at how a disturbance propagates, where it amplifies or stops, and whether the cascade is contained or becomes a catastrophe.</p>
          </div>
          <LatestIssue />
        </div>
      </section>

      <section className="section wrap two-column experiment-home">
        <div>
          <p className="kicker">The experiment</p>
          <h2>Testing the method in public.</h2>
        </div>
        <div className="prose-block">
          <p>Risks In Sync is not presented as a finished framework. It is being tested repeatedly against real incidents.</p>
          <p>AI changes the economics of repetition: it helps collect and compare evidence, structure cases and apply the same questions often enough to expose useful patterns, weak assumptions and generic conclusions.</p>
          <p>Human judgment remains responsible for case selection, interpretation, evidence checks, editing and publication.</p>
          <a className="text-link" href="/about/#why-ai">How the experiment works <Arrow>→</Arrow></a>
        </div>
      </section>

      <section className="section rule-top wrap method-preview">
        <p className="kicker">What is Risks In Sync?</p>
        <div className="method-grid">
          <div>
            <h2>Follow the disturbance.</h2>
            <p>Risks In Sync studies how disruptions propagate through connected systems.</p>
          </div>
          <div>
            <p>Rather than asking only how likely an event is or how severe it might be, it asks:</p>
            <ul>
              <li>Which paths can carry the disturbance?</li>
              <li>Where can it accumulate or amplify?</li>
              <li>Which buffers can absorb it?</li>
              <li>Which breakers can stop propagation?</li>
              <li>Which Gray Zones hide uncertainty or unclear ownership?</li>
            </ul>
            <a className="text-link" href="/about/">About the method <Arrow>→</Arrow></a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ReviewArchivePage() {
  const [query, setQuery] = useState("");
  const matchingReviews = searchReviews(reviews, query);
  const hasQuery = query.trim().length > 0;
  const previousReviews = reviews.slice(1);

  return (
    <PageShell>
      <header className="page-heading wrap">
        <p className="kicker">RISKS IN SYNC</p>
        <h1>Cascade Risk Review</h1>
        <p className="page-dek">One recent real-world event. Multiple connected systems. A closer look at how a disturbance propagates, where it amplifies or stops, and whether the cascade is contained or becomes a catastrophe.</p>
        <div className="review-search">
          <label htmlFor="review-search">Search reviews</label>
          <input
            id="review-search"
            type="search"
            value={query}
            placeholder="Search the archive"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </header>
      <div className="archive wrap">
        {hasQuery ? (
          <section aria-labelledby="search-results-title">
            <div className="archive-heading">
              <p className="kicker">Archive search</p>
              <h2 id="search-results-title" aria-live="polite">{matchingReviews.length === 1 ? "1 review" : `${matchingReviews.length} reviews`}</h2>
            </div>
            {matchingReviews.length > 0 ? (
              <div className="archive-list">
                {matchingReviews.map((review) => <LatestIssue compact review={review} key={review.slug} />)}
              </div>
            ) : (
              <div className="archive-empty" role="status">
                <h3>No reviews found</h3>
                <p>Try a broader term or clear the search to see the complete archive.</p>
                <button type="button" onClick={() => setQuery("")}>Clear search</button>
              </div>
            )}
          </section>
        ) : (
          <>
            <section aria-labelledby="latest-review-title">
              <div className="archive-heading">
                <p className="kicker">Latest review</p>
                <h2 id="latest-review-title">The newest case</h2>
              </div>
              <LatestIssue compact review={latestReview} />
            </section>

            {previousReviews.length > 0 ? (
              <section className="previous-reviews" aria-labelledby="previous-reviews-title">
                <div className="archive-heading">
                  <p className="kicker">Previous reviews</p>
                  <h2 id="previous-reviews-title">Earlier cases</h2>
                </div>
                <div className="archive-list">
                  {previousReviews.map((review) => <LatestIssue compact review={review} key={review.slug} />)}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </PageShell>
  );
}

function EvidenceTag({ children }: { children: ReactNode }) {
  return <span className="evidence-tag">{children}</span>;
}

const outcomeStatusLabels: Record<CascadeOutcomeStatus, string> = {
  contained: "Contained",
  partially_propagated: "Partially propagated",
  fully_propagated: "Fully propagated",
  ongoing: "Ongoing",
  uncertain: "Uncertain",
};

function CascadeDiagram({ review }: { review: ReviewIssue }) {
  const { cascade } = review;
  return (
    <figure className="cascade-figure" aria-labelledby="cascade-caption">
      <figcaption id="cascade-caption">
        <span>{cascade.title}</span>
        <strong>{cascade.subtitle}</strong>
      </figcaption>
      <div className="cascade-flow">
        {cascade.steps.map((step, index) => (
          <div className="flow-step" key={`${index}-${step}`}>
            <div className="flow-node">{step}</div>
            <div className="flow-arrow" aria-hidden="true">↓</div>
          </div>
        ))}
        <div className={`flow-node observed-outcome outcome-${cascade.outcome_status}`}>
          <small>Observed outcome · {outcomeStatusLabels[cascade.outcome_status]}</small>
          <span>{cascade.observed_outcome}</span>
        </div>
        {cascade.counterfactual_outcome ? (
          <div className="counterfactual-outcome">
            <small>Alternative outcome</small>
            <div className="flow-node">{cascade.counterfactual_outcome}</div>
          </div>
        ) : null}
      </div>
      <p className="figure-note"><EvidenceTag>{cascade.evidence_status}</EvidenceTag> {cascade.note}</p>
    </figure>
  );
}

type FeedbackStatus = "ready" | "submitting" | "accepted" | "error";

function PrivateFeedback({ slug }: { slug: string }) {
  const [status, setStatus] = useState<FeedbackStatus>("ready");
  const [comment, setComment] = useState("");
  const formName = `private-feedback-${slug}`;
  const titleId = `private-feedback-title-${slug}`;
  const commentId = `feedback-comment-${slug}`;
  const optionalId = `feedback-comment-optional-${slug}`;
  const countId = `feedback-character-count-${slug}`;
  const privacyId = `feedback-privacy-note-${slug}`;

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
      });

      if (!response.ok) throw new Error("Feedback submission was not accepted");
      form.reset();
      setComment("");
      setStatus("accepted");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="private-feedback" aria-labelledby={titleId}>
      <p className="kicker">Private feedback</p>
      <h2 id={titleId}>Did the Risks In Sync lens show you something that a conventional account of this incident would probably have missed?</h2>

      {status === "accepted" ? (
        <p className="feedback-status success" role="status">Thank you. Your private feedback has been recorded.</p>
      ) : (
        <form
          name={formName}
          method="post"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          aria-busy={status === "submitting"}
          onSubmit={submitFeedback}
        >
          <input type="hidden" name="form-name" value={formName} />
          <input type="hidden" name="issue" value={slug} />
          <p className="honeypot" aria-hidden="true">
            <label>Leave this field empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
          </p>

          <fieldset disabled={status === "submitting"}>
            <legend>Your answer</legend>
            <div className="feedback-options">
              <label><input type="radio" name="answer" value="yes_clearly" required /> <span>Yes, clearly</span></label>
              <label><input type="radio" name="answer" value="not_really" /> <span>Not really</span></label>
              <label><input type="radio" name="answer" value="hard_to_tell" /> <span>Hard to tell</span></label>
            </div>

            <div className="feedback-comment">
              <div className="feedback-comment-heading">
                <label htmlFor={commentId}>Why?</label>
                <span id={optionalId}>Optional</span>
              </div>
              <textarea
                id={commentId}
                name="comment"
                rows={4}
                maxLength={400}
                value={comment}
                aria-describedby={`${optionalId} ${countId} ${privacyId}`}
                onChange={(event) => setComment(event.target.value)}
              />
              <span id={countId} className="character-count">{comment.length} / 400</span>
            </div>

            <button type="submit">{status === "submitting" ? "Sending…" : "Send private feedback"}</button>
          </fieldset>

          <p id={privacyId} className="feedback-privacy-note">
            Private feedback. No name or email required. The author uses your response only to improve Risks In Sync. Please do not include personal, confidential or sensitive information. Raw responses are deleted within 90 days. <a href="/privacy/">Privacy notice</a>.
          </p>

          {status === "error" ? (
            <p className="feedback-status error" role="alert">We couldn't confirm that your feedback was recorded. Your text is still here; please try again later.</p>
          ) : null}
        </form>
      )}
    </section>
  );
}

function SafeHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function imageUrl(review: ReviewIssue, image: ReviewImage): string {
  return `/review/${review.slug}/${image.path}`;
}

function sourceDate(source: ReviewSource): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${source.published_date}T00:00:00Z`));
}

function ReviewSources({ sources }: { sources: ReviewSource[] }) {
  return (
    <section className="review-sources" aria-labelledby="review-sources-title">
      <h2 id="review-sources-title">Sources</h2>
      <ol className="sources-list">
        {sources.map((source) => (
          <li key={source.id}>
            <strong><a href={source.url}>{source.publisher} — “{source.title},” {sourceDate(source)}.</a></strong>{" "}{source.note}
          </li>
        ))}
      </ol>
    </section>
  );
}

function ReviewArticlePage({ review }: { review: ReviewIssue }) {
  const heroImage = review.images.find((image) => image.role === "hero");
  const { olderReview, newerReview } = reviewNeighbors(reviews, review.slug);

  return (
    <PageShell>
      <article className="article">
        <header className="article-header article-wrap">
          <div className="article-series">
            <span>Cascade Risk Review</span>
            <span>{review.issue.label}</span>
          </div>
          <h1>{review.title}</h1>
          <p className="article-dek">{review.dek}</p>
          <div className="article-meta">
            <span>By {review.author}</span>
            <span>Review period: {review.reviewPeriodLabel}</span>
            <span>Published {review.publicationDateLabel}</span>
          </div>
        </header>

        {heroImage ? (
          <figure className="article-image article-wrap">
            <img src={imageUrl(review, heroImage)} alt={heroImage.alt} />
            {heroImage.caption || heroImage.credit || heroImage.rights_basis ? (
              <figcaption>
                {heroImage.caption ? <span>{heroImage.caption} · </span> : null}
                {heroImage.credit ? (
                  heroImage.source_url
                    ? <a href={heroImage.source_url}>Credit: {heroImage.credit}</a>
                    : <span>Credit: {heroImage.credit}</span>
                ) : null}
                {heroImage.rights_basis ? <span> · {heroImage.rights_basis}</span> : null}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="article-body article-wrap article-markdown">
          <aside className="principle-callout">
            <span>Editorial principle</span>
            <strong>Evidence ≠ interpretation</strong>
            <p>Reported facts, public outcomes, analytical inferences and unknowns are separated throughout this review.</p>
          </aside>

          <SafeHtml html={review.html.beforeCascade} />
          <CascadeDiagram review={review} />
          <SafeHtml html={review.html.afterCascade} />
          <PrivateFeedback slug={review.slug} />
          <SafeHtml html={review.html.afterFeedback} />
          <ReviewSources sources={review.sources} />

          <aside className="about-review">
            <p className="kicker">About this review</p>
            {review.editorial ? <h2>{review.editorial}</h2> : null}
            <p>Cascade Risk Review uses AI to help search, compare sources, structure evidence and repeatedly apply the Risks In Sync and Gray Zones frameworks.</p>
            <p>The purpose is partly experimental: repeated application helps identify where the method works, where it produces weak interpretations and how it may need to change.</p>
            <p>Final case selection, interpretation, editing and publication remain human decisions.</p>
          </aside>

          <nav className="review-navigation" aria-label="Review archive navigation">
            <div className="review-navigation-side older">
              {olderReview ? (
                <a href={olderReview.path}>
                  <span><Arrow>←</Arrow> Older review</span>
                  <strong>{olderReview.issue.label}</strong>
                </a>
              ) : null}
            </div>
            <a className="all-reviews-link" href="/review/">All reviews</a>
            <div className="review-navigation-side newer">
              {newerReview ? (
                <a href={newerReview.path}>
                  <span>Newer review <Arrow>→</Arrow></span>
                  <strong>{newerReview.issue.label}</strong>
                </a>
              ) : null}
            </div>
          </nav>
        </div>
      </article>
    </PageShell>
  );
}

function AboutPage() {
  useEffect(() => {
    let frame = 0;
    const scrollToHash = () => {
      if (window.location.hash === "#contact") {
        frame = window.requestAnimationFrame(() => {
          const cameFromPointer = window.sessionStorage.getItem(CONTACT_POINTER_NAVIGATION_KEY) === "true";
          window.sessionStorage.removeItem(CONTACT_POINTER_NAVIGATION_KEY);
          focusContactSection(!cameFromPointer);
        });
      }
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <PageShell>
      <header className="page-heading wrap">
        <p className="kicker">The method</p>
        <h1>Risks In Sync</h1>
        <p className="page-dek">A developing way to understand how disturbances move through connected systems—and why several things becoming critical together can turn an incident into a catastrophe.</p>
      </header>
      <div className="about-content article-wrap">
        <section>
          <h2>Follow the disturbance</h2>
          <p>Complex failures often do not come from one extraordinary event.</p>
          <p>They emerge when disturbances move through connected systems and several things become critical at the same time.</p>
          <p>Risks In Sync looks at:</p>
          <ul className="method-list">
            <li><strong>Propagation paths</strong><span>Where can the disturbance travel?</span></li>
            <li><strong>Accumulation</strong><span>Where can pressure build or effects combine?</span></li>
            <li><strong>Buffers</strong><span>What can absorb the disturbance?</span></li>
            <li><strong>Breakers</strong><span>What can stop its movement?</span></li>
            <li><strong>Dependencies</strong><span>What relies on what?</span></li>
            <li><strong>Synchronisation</strong><span>What becomes critical at the same time?</span></li>
            <li><strong>Recovery</strong><span>How does the system return to a safe state?</span></li>
          </ul>
        </section>

        <section>
          <p className="kicker">Four recurring questions</p>
          <h2>Gray Zones</h2>
          <div className="gray-grid about-gray">
            <div><h3>Uncertainty</h3><p>What do we not really know?</p></div>
            <div><h3>Ownership</h3><p>Who owns the whole problem rather than one component?</p></div>
            <div><h3>Over-reliance</h3><p>Which dependency has quietly become essential?</p></div>
            <div><h3>Constraints</h3><p>Which limits reduce the system’s ability to adapt?</p></div>
          </div>
        </section>

        <section id="why-ai">
          <p className="kicker">The editorial experiment</p>
          <h2>Testing Risks In Sync</h2>
          <p>Risks In Sync is not a finished framework. A method improves by being tested against real incidents.</p>
          <p>Cascade Risk Review follows how a disturbance propagates, where it amplifies or stops, and whether the cascade is contained or becomes a catastrophe.</p>
          <p>AI changes the economics of repetition.</p>
          <p>It can help collect and compare evidence, structure incidents and apply the same analytical questions repeatedly. That makes it practical to look for useful patterns, weak assumptions, generic conclusions, missing concepts and places where the method forces an interpretation.</p>
          <p>Repetition does not make a conclusion correct. Human judgment remains responsible for checking evidence, interpreting each case, refining the method and approving publication.</p>
          <div className="responsibility-grid">
            <div>
              <h3>AI assists with</h3>
              <ul><li>searching and comparing sources;</li><li>structuring evidence;</li><li>repeatedly applying the method;</li><li>surfacing patterns and preparing drafts.</li></ul>
            </div>
            <div>
              <h3>The human remains responsible for</h3>
              <ul><li>selecting what deserves attention;</li><li>separating fact from interpretation;</li><li>refining the method;</li><li>approving publication.</li></ul>
            </div>
          </div>
          <a className="primary-link inline" href={firstReview.path}>Read the first review <Arrow>→</Arrow></a>
        </section>

        <section id="contact" className="author-section">
          <p className="kicker">Author</p>
          <h2 id="contact-title" tabIndex={-1}>Jose Luis Sanz</h2>
          <p>Jose Luis Sanz has spent more than two decades working with complex claims, incidents and risk.</p>
          <p>Risks In Sync grew from practical experience analysing failures, dependencies and recovery. The current project is an independent experiment in testing and refining the method against real-world events.</p>
          <a className="text-link" href="https://www.linkedin.com/in/jlsanz/" rel="me">Contact on LinkedIn <Arrow>→</Arrow></a>
        </section>
      </div>
    </PageShell>
  );
}

function PrivacyPage() {
  return (
    <PageShell>
      <header className="page-heading wrap">
        <p className="kicker">Privacy</p>
        <h1>Privacy notice</h1>
        <p className="page-dek">How private reader feedback is handled on Risks In Sync.</p>
      </header>
      <div className="privacy-content article-wrap">
        <section>
          <h2>Who is responsible</h2>
          <p><strong>Jose Luis Sanz</strong>, author and publisher of Risks In Sync, is the controller for reader feedback.</p>
          <p>You can contact the author, including to exercise a privacy right, through the <a href="https://www.linkedin.com/in/jlsanz/" rel="me">public LinkedIn profile</a>.</p>
        </section>

        <section>
          <h2>What is collected and why</h2>
          <p>The form does not ask for your name or email address. It stores your selected answer, any optional comment, the review it relates to and the time the provider accepts it. Netlify may also process limited technical information needed to deliver and protect the service.</p>
          <p>The sole editorial purpose is to understand whether the Risks In Sync method is useful and how it can be improved. Feedback is not published, used for marketing or profiling, or transferred automatically to AI systems.</p>
        </section>

        <section>
          <h2>Legal basis</h2>
          <p>The legal basis is the author’s legitimate interest in securely operating and improving this independent, non-commercial publication (Article 6(1)(f) GDPR).</p>
          <p>You may object to this processing at any time. If you do not wish to provide feedback, you can read the publication without using the form.</p>
        </section>

        <section>
          <h2>Provider and international transfers</h2>
          <p>Netlify, Inc. hosts the site and receives form submissions as a service provider. Its current data processing agreement covers customer data and provides transfer safeguards, including the EU–US Data Privacy Framework and, where that mechanism does not apply, the European Commission's Standard Contractual Clauses.</p>
          <p>See Netlify's <a href="https://www.netlify.com/pdf/netlify-dpa.pdf">data processing agreement</a> and <a href="https://www.netlify.com/legal/subprocessors/">current subprocessor list</a>.</p>
        </section>

        <section>
          <h2>Retention and access</h2>
          <p>Raw form submissions are kept for no more than 90 days after receipt and are then deleted from the private form inbox. Any temporary export follows the same deadline. Aggregated and truly de-identified themes and editorial decisions may be kept.</p>
          <p>Access through the Netlify account is restricted to the author. Netlify and its subprocessors may access data only as needed to provide and protect the service under the applicable terms. Hosting and security records follow Netlify's service retention and deletion procedures.</p>
        </section>

        <section>
          <h2>Your privacy rights</h2>
          <p>You may ask to access, correct or delete feedback that can reasonably be identified, restrict its use, or object to its processing. Contact the author and provide enough details to locate the response. You may also lodge a complaint with the <a href="https://www.aepd.es/">Spanish Data Protection Agency (AEPD)</a>.</p>
        </section>

        <section>
          <h2>Cookies and changes</h2>
          <p>Risks In Sync does not use audience analytics, advertising trackers or marketing cookies. This notice will be updated before feedback is used for a materially different purpose or a different provider is introduced.</p>
          <p className="privacy-updated">Last updated: 10 September 2026.</p>
        </section>
      </div>
    </PageShell>
  );
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const review = reviews.find((issue) => issue.path.replace(/\/+$/, "") === path);

  if (path === "/about") return <AboutPage />;
  if (path === "/privacy") return <PrivacyPage />;
  if (review) return <ReviewArticlePage review={review} />;
  if (path === "/review") return <ReviewArchivePage />;
  return <HomePage />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
