---
schema_version: 1
id: CRR-Y1-N2-E2E
slug: year-1-nr-2
status: ready_for_pr
issue:
  year: 1
  number: 2
  label: Year 1 · Nr. 2
review_period:
  start: 2026-09-01
  end: 2026-09-10
publication_date: 2026-09-11
title: The handoff that contained the cascade
dek: A synthetic editorial fixture for the complete Publication Pack workflow.
summary: A bounded review of how shared load, an operating buffer and a verified handoff prevented wider propagation.
author: Jose Luis Sanz Breton
language: en
method_version: risks-in-sync-v1
editorial: End-to-end Publication Pack verification fixture.
cascade:
  title: Load moved across a shared service
  subtitle: Detection and a verified handoff preserved the remaining buffer.
  steps:
    - A primary unit transferred load to the shared service
    - The shared service approached its operating threshold
    - The receiving team isolated the transfer
  outcome_status: contained
  observed_outcome: The transfer was isolated and operating margin recovered.
  counterfactual_outcome: Loss of the shared service and propagation to a second unit
  evidence_status: INFERRED
  note: The sequence separates the simulated record from the editorial interpretation used by this fixture.
sources:
  - id: FIXTURE-LOG
    title: Synthetic operating log
    publisher: Risks In Sync test harness
    url: https://risksinsync.com/fixtures/publication-pack/operating-log
    published_date: 2026-09-10
    accessed_date: 2026-09-11
    kind: primary
    verification: verified
    note: Provides the reported transfer time and the recorded threshold values.
  - id: FIXTURE-REVIEW
    title: Synthetic independent review
    publisher: Risks In Sync test harness
    url: https://risksinsync.com/fixtures/publication-pack/independent-review
    published_date: 2026-09-11
    accessed_date: 2026-09-11
    kind: secondary
    verification: verified
    note: Supports the containment sequence and identifies the remaining unknown.
images:
  - id: HERO-FIXTURE
    path: assets/hero.webp
    role: homepage
    alt: Abstract amber field fading into a dark textured edge
    decorative: false
    label: Gray Zones · Handoff
    caption: Synthetic cover image used to verify the Publication Pack pipeline.
    credit: Risks In Sync
    source_url: https://risksinsync.com/
    rights_basis: Publisher-owned site artwork reused as a local editorial test fixture.
    verification: cleared
---

This synthetic case exists to exercise the publication boundary without relying on a live incident, external service or private source.

## The event

At 09:14, a simulated primary unit transferred demand to a shared service. The operating log recorded a rising load and a narrowing reserve during the next six minutes.

## The cascade

<!-- CASCADE_DIAGRAM -->

The transfer increased pressure on a dependency used by two units. The receiving team isolated the transfer before the shared service crossed its operating threshold.

## What worked

The operating team named the shared dependency, checked the reserve rather than only the initiating alarm and completed a confirmed handoff before changing the system state.

## What didn't — or we don't know

The synthetic record does not establish whether the first team understood that the same service also protected the second unit.

## Gray Zones

Local ownership ended at the unit boundary, while the consequence moved through infrastructure owned by another team. The successful response depended on work between those formal responsibilities.

## Risks In Sync

The event remained contained because the teams followed the disturbance into the shared service and acted while a recoverable buffer still existed.

## What this case changes

Future reviews should record the owner, current load and intervention threshold for every dependency shared by more than one operating unit.

## Evidence status

### REPORTED

The synthetic operating log reports the transfer at 09:14 and the isolation command at 09:20.

### OBSERVED

Recorded fixture values show the shared-service reserve narrowing from thirty percent to twelve percent before recovery began.

### INFERRED

The sequence suggests that the confirmed handoff reduced the time spent near the operating threshold.

### UNKNOWN

The fixture does not establish whether the second unit would have lost protection if isolation had occurred one minute later.

<!-- PRIVATE_FEEDBACK -->

## SOURCES
