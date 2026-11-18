---
schema_version: 2
id: crr-y1-n11
slug: year-1-nr-11
status: ready_for_pr
issue:
  year: 1
  number: 11
  label: Year 1 · Nr. 11
review_period:
  start: 2026-11-10
  end: 2026-11-16
publication_date: 2026-11-17
title: The cascade that did not reach the ward
dek: As storm Charles crossed the Canary Islands, officials stopped non-urgent patient transport while protecting vital journeys. The avoided cascade is the subject—not proof that no harm was deferred.
summary: A storm-time transport triage in the Canary Islands protected essential care by suspending non-urgent journeys. The case tests how a deliberately reduced service can prevent one cascade while creating a monitored backlog risk.
author: Jose Luis Sanz Bretón
language: en
method_version: risks-in-sync-v1
editorial: "This case shows simple yet powerful countermeasures to prevent cascades: having a reliable weather forecast system linked to a robust procedure that also accounts for unclear climate related situations. A clear purpose matters: mitigate synchronization risks down the line."
cascade:
  title: Weather risk, selective transport, protected vital care
  subtitle: A service was deliberately narrowed before unsafe journeys could interrupt higher-priority treatment.
  steps:
    - Storm Charles brought forecasts of bad weather
    - Emergency authorities declared weather and flood alerts
    - Suspended scheduled non-urgent patient transport
    - Transport for severe clinical conditions was retained
    - Postponed appointments created an unquantified recovery burden.
  outcome_status: contained
  observed_outcome: Officials reported a selective suspension of non-urgent journeys while retaining vital transport subject to safety conditions; the accessible record does not quantify deferred-care outcomes or recovery.
  counterfactual_outcome: null
  evidence_status: REPORTED
  note: This is a bounded account of a pre-emptive transport decision
sources:
  - id: canarias-health-transport-2026-11-11
    title: La borrasca Charles obliga a reorganizar el Transporte Sanitario No Urgente en rehabilitación y consultas externas
    publisher: Gobierno de Canarias
    url: https://www3.gobiernodecanarias.org/noticias/hemeroteca/la-borrasca-charles-obliga-a-reorganizar-el-transporte-sanitario-no-urgente-en-rehabilitacion-y-consultas-externas/
    published_date: 2026-11-11
    accessed_date: 2026-11-17
    kind: primary
    verification: verified
    note: Documents the suspension of scheduled non-vital transport and the conditional continuity of vital treatments and clinical transfers.
  - id: canarias-flood-prealert-2026-11-10
    title: El Gobierno de Canarias declara la prealerta por riesgo de inundaciones en el archipiélago
    publisher: Gobierno de Canarias
    url: https://www3.gobiernodecanarias.org/noticias/hemeroteca/el-gobierno-de-canarias-declara-la-prealerta-por-riesgo-de-inundaciones-en-el-archipielago-3/
    published_date: 2026-11-10
    accessed_date: 2026-11-17
    kind: primary
    verification: verified
    note: Sets out the archipelago-wide flood risk anticipated from Charles, including road water accumulation, runoff and coastal flooding.
  - id: aemet-special-warning-39-2026
    title: Aviso especial de fenómenos adversos número 39/2026
    publisher: Agencia Estatal de Meteorología
    url: https://www.aemet.es/es/eltiempo/prediccion/destacados/p5_t/pdf/20261110150835_p52tesp1.pdf
    published_date: 2026-11-10
    accessed_date: 2026-11-17
    kind: primary
    verification: verified
    note: Forecast heavy and persistent rain, strong gusts and severe coastal conditions, with uncertainty in the storm track.
  - id: canarias-wind-alert-2026-11-09
    title: El Gobierno de Canarias actualiza la situación pasando a alerta por viento en todas las islas
    publisher: Gobierno de Canarias
    url: https://www3.gobiernodecanarias.org/noticias/el-gobierno-de-canarias-actualiza-la-situacion-pasando-a-alerta-por-viento-en-todas-las-islas/
    published_date: 2026-11-09
    accessed_date: 2026-11-17
    kind: primary
    verification: verified
    note: Records the weather alert escalation and forecast gusts across the islands.
  - id: rtve-charles-2026-11-11
    title: "Clases suspendidas, vuelos y barcos cancelados y fuertes rachas de viento: España sufre los efectos de las borrascas Bruna y Charles"
    publisher: RTVE Noticias
    url: https://www.rtve.es/noticias/20261111/borrascas-charles-bruna-lluvias-torrenciales-vientos-huracanados-espana/17308367.shtml
    published_date: 2026-11-11
    accessed_date: 2026-11-17
    kind: secondary
    verification: verified
    note: Provides independent reporting of the wider weather disruption in the Canary Islands and Spain.
images: []
assets:
  cover:
    id: cover-y1-n11
    path: assets/cover-y1-n11.jpg
    alt: Cascade Risk Review Year 1, Number 11 cover with branching gold lines converging into a red endpoint.
    decorative: false
    credit: Jose Luis Sanz
    source_url: https://risksinsync.com
    rights_basis: Provided by Jose Luis Sanz for Cascade Risk Review.
    verification: cleared
  homepage_vignette:
    id: homepage-vignette-y1-n11
    path: assets/homepage-vignette-y1-n11.jpg
    alt: Two hyenas watch wildebeest enter a crocodile-filled river; one says that a few earlier crossings made the herd think it knew the river.
    decorative: false
    label: Overconfidence bias
    caption: Familiarity is not evidence that conditions have stayed the same.
    credit: Jose Luis Sanz
    source_url: https://risksinsync.com
    rights_basis: Provided by Jose Luis Sanz for Cascade Risk Review.
    verification: cleared
editorial_modules:
  - type: operator_checklist
    items:
      - signal: Weather alerts change from forecast concern to route-specific risk.
        response: Reassess journeys by treatment criticality, route exposure and safe alternatives rather than using a single system-wide rule.
      - signal: Non-urgent transport is paused.
        response: Track every deferred journey, assign rebooking ownership and monitor whether backlog or missed follow-up creates a later clinical risk.
      - signal: Vital transport remains nominally available.
        response: Confirm vehicle, crew, route and receiving-facility availability for each journey; availability in policy is not availability in practice.
  - type: decision_log
    entries:
      - decision: Treat the event as a contained near-cascade, not proof of no harm.
        rationale: The decision protected vital flows, but public evidence does not show the volume or outcome of deferred care.
        evidence_status: REPORTED
---

Storm Charles did not have to close a hospital to create a healthcare risk. It only had to make the journeys that connect people to care unsafe or unreliable. On 10 and 11 November, the Canary Islands moved into weather and flood alerts as forecasts described strong wind, heavy rain and rough seas. The response was not to pretend that every service could continue unchanged. The Canary Islands Emergency Service suspended scheduled, non-urgent patient transport across affected islands, while retaining transport for vital treatment and clinical transfers where conditions allowed it.

That decision is most useful as a study of a cascade that was not allowed to complete. A transport disruption can become missed treatment, then clinical deterioration, emergency demand and a harder recovery backlog. The public record does not show that sequence occurring here. It does show a deliberate intervention at the transport boundary. The question is why it held this time—and what would make the same policy insufficient next time.

## The event

On 10 November, the Canary Islands Government declared a flood pre-alert for the entire archipelago. Its notice described the risk from Charles: locally strong and persistent rain, intense wind, worsening sea conditions, urban water accumulation, runoff, sudden rises in ravines and possible coastal flooding. The government had already escalated to a wind alert, while AEMET warned that the combined Bruna–Charles episode could bring very strong gusts, heavy rain and marine hazards. AEMET also noted uncertainty about Charles's eventual track, which matters because route risk is uneven across an island chain.

On 11 November, the Servicio de Urgencias Canario suspended non-urgent patient transport for rehabilitation sessions and outpatient consultations in La Palma, La Gomera, El Hierro, Tenerife and Gran Canaria. The same approach had begun in La Palma the previous afternoon. The service said that vital journeys—dialysis, chemotherapy, radiotherapy and oncology day care—would be maintained, provided that the trip did not endanger patients or crews and no safer alternative was available. It also retained transport between health facilities and for people discharged from emergency or inpatient care.

The choice was not “healthcare open” versus “healthcare closed.” It was a prioritisation under a changing access constraint. That distinction makes the case more interesting than a weather cancellation: it defines which flows may be interrupted so that others retain the capacity and safety margin to continue.

## The cascade

<!-- CASCADE_DIAGRAM -->

The service interrupted that chain early. It removed a category of planned trips whose immediate clinical urgency was lower than the weather and operational risk. This did not eliminate all risk. It shifted the system into a narrower operating mode: vital transport continued only when the route and staffing were safe. The protective mechanism was therefore not a physical barrier but a decision rule joined to weather information, clinical priority, vehicle availability and local route conditions.

The fact that the cascade did not reach the ward is not proof that it could not. It means the first escalation—unsafe transport—was prevented from generating a second one during the documented period. The public evidence does not tell us how many appointments were postponed, whether some treatments were rescheduled promptly, or whether any patient sought urgent care later. Those are outcome questions, not details that can be filled in by a reassuring policy statement.

## What worked

The decision arrived before the most adverse day of the episode. Government alerts made the hazard legible at archipelago scale, while the transport decision translated that forecast into a concrete service boundary. That conversion is a strength: weather information is useful only when someone has authority to change a schedule before a route becomes dangerous.

The response also distinguished vital from non-vital journeys. Keeping dialysis and cancer-related transport in scope, while conditioning it on actual safety, protected the most time-sensitive flows without claiming that every journey must proceed. This is a more disciplined form of continuity than a blanket promise of normal service.

There was also a named condition for exception handling: an alternative destination could matter, and safety for crews mattered alongside safety for patients. These details suggest that the decision was not simply a calendar-wide cancellation. It recognised that capacity, routes and destinations are part of whether care can be delivered.

## What didn't — or we don't know

The cost of the protection is not yet visible. Rehabilitation and outpatient consultations are described as non-urgent, but “non-urgent” does not mean consequence-free. Repeated postponement can reduce function, delay assessment, disrupt medication changes or accumulate travel and scheduling burdens. No public source reviewed quantifies the deferred journeys, the time to rebook them, or whether any people could not safely use an alternative.

Vital transport is also a conditional promise, not a guarantee. It can fail if a vehicle cannot reach a patient, a crew is unavailable, a route closes after departure, communications fail, or the receiving unit loses capacity. An island system adds possible dependencies on ports, airports, bridges, local roads and weather windows. None of those failures is demonstrated in this case; each is a plausible rival mechanism that future evidence should test.

The danger next time is a threshold effect in coordination rather than weather severity alone. A larger or slower-moving storm could extend the suspension long enough for the deferred queue to become clinically significant. A simultaneous road closure, vehicle breakdown or receiving-facility constraint could turn the selected vital service into a queue too. A decision rule that worked for one day can become an amplifier if it has no visible backlog threshold, no alternative transport capacity and no ownership for restoring the deferred flow.

## Gray Zones

**Uncertainty is material.** Forecast uncertainty was explicit in AEMET's notice. The service had to act before conditions were fully known, which makes the quality and timing of re-evaluation as important as the initial suspension.

**Ownership is material.** Emergency authorities issue alerts; the ambulance service schedules transport; clinical teams judge time sensitivity; receiving facilities and patients absorb the consequences. A safe decision can still fail if no one owns the deferred-care list after the weather passes.

**Constraints are material.** Vehicles, crews, accessible routes, weather windows and destination capacity limit the practical meaning of “vital journeys continue.” The relevant buffer is not an abstract reserve: it is usable transport capacity under the specific conditions on each island.

**Over-reliance is weakly evidenced.** The evidence does not show dependence on one supplier or control room. It does show dependence on coordinated information and decisions. Whether those channels have independent fallbacks is unknown.

## Risks In Sync

The conventional explanation is sufficient to describe the event: officials responded to severe weather by cancelling lower-priority journeys and retaining higher-priority care. Risks In Sync adds a question that the conventional account can leave implicit: what is the next state transition after the protective cancellation?

Here, a cancellation is a breaker for one cascade and a source of stored demand for another. The method is useful with qualification because it keeps the two outcomes separate. It does not label postponed care as harm without evidence, and it does not label continuity as success without testing the queues, exceptions and recovery.

The best rival explanation is simpler: this was routine, sensible contingency management, and no further systems framing is needed. That view would be strengthened if records showed rapid rebooking, no material backlog and no difficulty maintaining vital journeys. It would be weakened if deferred appointments accumulated, vital transport needed repeated exceptions, or recovery consumed capacity needed for later weather events.

## What this case changes

The practical lesson is to define an explicit “not reached” cascade for any selective shutdown. For patient transport, that means measuring not only whether dangerous journeys were avoided, but also whether the deferred list is growing, who owns it, and what trigger turns a temporary pause into a care-continuity incident.

The intervention should not be “keep everything running.” It should be a reversible triage rule with a protected core, route-level safety checks, a recovery plan and a visible backlog threshold. Its own risk is displacement: protecting urgent journeys today can shift burden to less urgent patients tomorrow. That risk is manageable only when it is named and observed.

## Evidence status

### REPORTED

Government and emergency-service sources report the weather alerts, the suspension of non-urgent transport on five islands, and the conditional continuation of vital treatment and clinical transfers. RTVE independently reported broad weather disruption in the Canary Islands.

### OBSERVED

The reviewed public material provides forecasts, official alerts and service announcements. It does not provide journey logs, clinical records, route telemetry or measured backlog outcomes.

### INFERRED

The account of an avoided transport-to-care cascade is an inference from the timing and structure of the intervention. The possible later backlog cascade is a conditional risk pathway, not a reported outcome.

### UNKNOWN

The number of postponed journeys, rebooking time, individual patient outcomes, route-level exceptions, actual capacity margins and any later deferred-care effects remain unknown in the accessible record.

<!-- PRIVATE_FEEDBACK -->

## SOURCES
