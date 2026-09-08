export type EvidenceStatus = "REPORTED" | "OBSERVED" | "INFERRED" | "UNKNOWN";

export interface Source {
  title: string;
  publisher: string;
  url: string;
  note: string;
}

export interface ReviewIssue {
  issue: string;
  reviewPeriod: string;
  published: string;
  title: string;
  dek: string;
  heroImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  sources: Source[];
}

export const issueOne: ReviewIssue = {
  issue: "Year 1 · Nr. 1",
  reviewPeriod: "1–7 September 2026",
  published: "8 September 2026",
  title: "A 3 GW shock hit the German power system. Most people noticed nothing.",
  dek: "Five large generating units were disconnected after a suspected sabotage incident. The grid absorbed the shock. That may be the most interesting part of the story.",
  sources: [
    {
      title: "RWE power stations affected by incident near substation",
      publisher: "RWE",
      url: "https://www.rwe.com/en/press/rwe-power/2026-09-02-rwe-power-plants-in-the-rhenish-region-affected-by-an-incident-near-a-substation/",
      note: "Units affected, installed capacity, live output and initial restoration plan.",
    },
    {
      title: "Ausfall von Kraftwerkszuleitungen im Rheinland: Untersuchungen zu Vorfall laufen",
      publisher: "Amprion",
      url: "https://www.amprion.net/Presse/Presse-Detailseite_98753.html",
      note: "Primary transmission-operator statement on power-plant feeder impacts, public supply and system stability.",
    },
    {
      title: "Germany probes second power grid sabotage case, fears of hybrid warfare grow",
      publisher: "Reuters via Internazionale",
      url: "https://www.internazionale.it/ultime-notizie-reuters/2026/09/02/german-power-grid-under-fresh-sabotage-attack-police-say",
      note: "Independent reporting on the police investigation, generation loss and continued stability.",
    },
    {
      title: "Germany probes suspected sabotage after disruption at 2 power substations",
      publisher: "Associated Press",
      url: "https://apnews.com/article/ef9c21908f232651d056d7462330e2b7",
      note: "Independent reporting on the suspected short-circuit mechanism and wider investigation.",
    },
    {
      title: "Drei von fünf Kraftwerksblöcken nach Sabotage wieder am Netz",
      publisher: "Die Zeit / dpa",
      url: "https://www.zeit.de/news/2026-09/02/zwei-von-fuenf-kraftwerksbloecken-nach-sabotage-wieder-am-netz",
      note: "Restoration update confirming the staged return of generating units.",
    },
    {
      title: "Medieninformation bezüglich des Anschlags in Turnow-Preilack",
      publisher: "Brandenburg Police",
      url: "https://polizei.brandenburg.de/pressemeldung/medieninformation-bzgl-des-anschlags-in-/5711687",
      note: "Primary police statement on the separate Brandenburg incident, included only for context.",
    },
  ],
};
