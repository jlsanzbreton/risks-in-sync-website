import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { marked } from "marked";
import { issueOne } from "./content/year-1-nr-1";
import reviewMarkdown from "./content/year-1-nr-1.md?raw";
import "./styles.css";

const REVIEW_PATH = "/review/year-1-nr-1/";

function Arrow({ children }: { children: ReactNode }) {
  return <span aria-hidden="true">{children}</span>;
}

function SiteHeader() {
  const path = window.location.pathname;
  const isReview = path.startsWith("/review");
  const isAbout = path.startsWith("/about");

  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="Risks In Sync home">
        <span>RISKS</span>
        <i aria-hidden="true" />
        <span>IN SYNC</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/review/" aria-current={isReview ? "page" : undefined}>Cascade Review</a>
        <a href="/about/" aria-current={isAbout ? "page" : undefined}>About</a>
      </nav>
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
          <a href="/about/#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}

function LatestIssue({ compact = false }: { compact?: boolean }) {
  return (
    <article className={compact ? "latest-card compact" : "latest-card"}>
      <div className="issue-line">
        <span>{issueOne.issue}</span>
        <span>{issueOne.published}</span>
      </div>
      <h3>{issueOne.title}</h3>
      <p>Five large generating units suddenly disconnected from the German grid after suspected sabotage. Around 3 GW of live production disappeared—yet the wider electricity supply remained stable.</p>
      <a className="text-link" href={REVIEW_PATH}>Read the review <Arrow>→</Arrow></a>
    </article>
  );
}

function HomePage() {
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
            <a className="hero-review-link" href={REVIEW_PATH}>
              <span className="hero-review-meta"><b>Cascade Risk Review</b><small>{issueOne.issue}</small></span>
              <strong>{issueOne.title}</strong>
              <span className="hero-review-action">Read the review <Arrow>→</Arrow></span>
            </a>
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="wrap two-column">
          <div className="section-intro">
            <p className="kicker">The publication</p>
            <h2>Cascade Risk Review</h2>
            <p>One recent real-world event. Multiple connected systems. A closer look at propagation, buffers, breakers, Gray Zones and what stopped the event becoming worse.</p>
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
  return (
    <PageShell>
      <header className="page-heading wrap">
        <p className="kicker">RISKS IN SYNC</p>
        <h1>Cascade Risk Review</h1>
        <p className="page-dek">Source-backed analysis of how disturbances move across connected systems—and what stops them.</p>
      </header>
      <section className="archive wrap">
        <LatestIssue compact />
      </section>
    </PageShell>
  );
}

function EvidenceTag({ children }: { children: ReactNode }) {
  return <span className="evidence-tag">{children}</span>;
}

function CascadeDiagram() {
  const steps = [
    "Physical interference",
    "Short circuit",
    "Transmission connection",
    "Five generating units",
    "≈3 GW output lost",
    "Grid control + reserves",
    "Stability maintained",
  ];

  return (
    <figure className="cascade-figure" aria-labelledby="cascade-caption">
      <figcaption id="cascade-caption">
        <span>Propagation path</span>
        <strong>Where the cascade stopped</strong>
      </figcaption>
      <div className="cascade-flow">
        {steps.map((step, index) => (
          <div className="flow-step" key={step}>
            <div className={index === steps.length - 1 ? "flow-node success" : "flow-node"}>{step}</div>
            {index < steps.length - 1 ? <div className="flow-arrow" aria-hidden="true">↓</div> : null}
          </div>
        ))}
        <div className="stop-line" aria-hidden="true"><span>×</span></div>
        <div className="flow-node stopped">Wider blackout</div>
      </div>
      <p className="figure-note"><EvidenceTag>INFERRED</EvidenceTag> A simplified model based on public reporting, not a technical incident reconstruction.</p>
    </figure>
  );
}

function ReviewArticlePage() {
  const [beforeDiagram, afterDiagram] = reviewMarkdown.split("<!-- CASCADE_DIAGRAM -->");
  const renderMarkdown = (content: string) => {
    const html = marked.parse(content, { async: false }) as string;

    return {
      __html: html
        .replace(/(<h2>Sources<\/h2>\s*)<ol>/, '$1<ol class="sources-list">')
        .replace(/<h3>(REPORTED|OBSERVED|INFERRED|UNKNOWN)<\/h3>/g, '<h3 class="evidence-heading">$1</h3>'),
    };
  };

  return (
    <PageShell>
      <article className="article">
        <header className="article-header article-wrap">
          <div className="article-series">
            <span>Cascade Risk Review</span>
            <span>{issueOne.issue}</span>
          </div>
          <h1>{issueOne.title}</h1>
          <p className="article-dek">{issueOne.dek}</p>
          <div className="article-meta">
            <span>By Jose Luis Sanz</span>
            <span>Review period: {issueOne.reviewPeriod}</span>
            <span>Published {issueOne.published}</span>
          </div>
        </header>

        {issueOne.heroImage ? (
          <figure className="article-image article-wrap">
            <img src={issueOne.heroImage.src} alt={issueOne.heroImage.alt} />
            {issueOne.heroImage.caption ? <figcaption>{issueOne.heroImage.caption}</figcaption> : null}
          </figure>
        ) : null}

        <div className="article-body article-wrap article-markdown">
          <aside className="principle-callout">
            <span>Editorial principle</span>
            <strong>Evidence ≠ interpretation</strong>
            <p>Reported facts, public outcomes, analytical inferences and unknowns are separated throughout this review.</p>
          </aside>

          <div dangerouslySetInnerHTML={renderMarkdown(beforeDiagram)} />
          <CascadeDiagram />
          <div dangerouslySetInnerHTML={renderMarkdown(afterDiagram)} />

          <aside className="about-review">
            <p className="kicker">About this review</p>
            <h2>AI-assisted · Human-edited · Source-backed</h2>
            <p>Cascade Risk Review uses AI to help search, compare sources, structure evidence and repeatedly apply the Risks In Sync and Gray Zones frameworks.</p>
            <p>The purpose is partly experimental: repeated application helps identify where the method works, where it produces weak interpretations and how it may need to change.</p>
            <p>Final case selection, interpretation, editing and publication remain human decisions.</p>
          </aside>
        </div>
      </article>
    </PageShell>
  );
}

function AboutPage() {
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
          <a className="primary-link inline" href={REVIEW_PATH}>Read the first review <Arrow>→</Arrow></a>
        </section>

        <section id="contact" className="author-section">
          <p className="kicker">Author</p>
          <h2>Jose Luis Sanz</h2>
          <p>Jose Luis Sanz has spent more than two decades working with complex claims, incidents and risk.</p>
          <p>Risks In Sync grew from practical experience analysing failures, dependencies and recovery. The current project is an independent experiment in testing and refining the method against real-world events.</p>
          <a className="text-link" href="https://www.linkedin.com/in/jlsanz/" rel="me">Contact on LinkedIn <Arrow>→</Arrow></a>
        </section>
      </div>
    </PageShell>
  );
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/about") return <AboutPage />;
  if (path === "/review/year-1-nr-1") return <ReviewArticlePage />;
  if (path === "/review") return <ReviewArchivePage />;
  return <HomePage />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
