---
schema_version: 1
id: crr-y1-n4
slug: year-1-nr-4
status: ready_for_pr
issue:
  year: 1
  number: 4
  label: Year 1 · Nr. 4
review_period:
  start: 2026-09-22
  end: 2026-09-28
publication_date: 2026-09-29
title: When power returns before water does
dek: A short Eskom-related interruption at two Rand Water pumping sites shows why restoring electricity is not the same as restoring a water system.
summary: A power dip halted pumping at Rand Water sites (South Africa). Electricity returned in under two hours; the water system required more time to recover.
author: Jose Luis Sanz
language: en
method_version: risks-in-sync-v1
editorial: "As Donella H. Meadows clearly put in her book Thinking in Systems: A Primer: “When there are long delays in feedback loops, some sort of foresight is essential.” Delays in a system’s response can lead to oscillations and poorly timed reactions. To reduce the risk of cascading effects, it is therefore essential to reduce uncertainty where possible and have contingency plans in place."
cascade:
  title: From power interruption to water-service risk
  subtitle: A short electrical disruption interrupted pumping; pressure and supply recovery followed later.
  steps:
    - Power outage
    - Pumping interrupted
    - Water service unavailable
    - Municipal services & industrial operations reduced
  outcome_status: partially_propagated
  observed_outcome: Power was reported restored at about 11:20 on 28 September and pumping resumed; Rand Water said the affected systems needed about four additional hours to recover.
  counterfactual_outcome: null
  evidence_status: REPORTED
  note: This is a simplified operational spine. Public reporting does not establish the electrical fault's root cause, final customer-level impacts, or the performance of each local buffer.
sources:
  - id: parys-gazette-2026-09-28
    title: Power outage disrupts water pumping operations to these areas
    publisher: Parys Gazette
    url: https://www.citizen.co.za/parys-gazette/news/news-news/2026/09/28/power-outage-disrupts-water-pumping-operations-to-these-areas/
    published_date: 2026-09-28
    accessed_date: 2026-09-29
    kind: secondary
    verification: verified
    note: Reports Rand Water's timing, affected pumping sites and systems, and the stated recovery interval.
  - id: engineering-news-2026-09-28
    title: Power outage disrupts Rand Water pumping operations
    publisher: Engineering News
    url: https://www.engineeringnews.co.za/article/power-outage-disrupts-rand-water-pumping-operations-2026-09-28
    published_date: 2026-09-28
    accessed_date: 2026-09-29
    kind: secondary
    verification: verified
    note: Independently published account identifying an Eskom-related outage/power dip and the customer systems potentially affected.
  - id: govza-2026-09-10
    title: Government on measures to mitigate water supply disruptions resulting from power trips
    publisher: South African Government
    url: https://www.gov.za/news/media-statements/government-measures-mitigate-water-supply-disruptions-resulting-power-trips
    published_date: 2026-09-10
    accessed_date: 2026-09-29
    kind: primary
    verification: verified
    note: "Provides pre-incident context: government agencies and utilities had already identified recurring electricity-supply interruptions as a risk to Rand Water systems."
images: []
---

An electrical interruption can be brief at the point where it occurs and still be operationally longer elsewhere. On 28 September, an Eskom-related power outage and power dip affected Rand Water's Zuikerbosch and Lethabo pumping stations in South Africa. Contemporary reports said power returned at about 11:20 after an interruption that began around 09:45, and pumping resumed. They also said the water systems needed a further four hours to recover. [That difference in clocks matters.](https://www.citizen.co.za/parys-gazette/news/news-news/2026/09/28/power-outage-disrupts-water-pumping-operations-to-these-areas/)

This is not evidence of a large or fully developed cascade. It is a more useful, narrower case: a coupled power-and-water system in which the first restoration did not equal the final restoration. The available reporting is sufficient to describe that operational sequence, but not to establish the root cause of the power event, actual customer outages, or the detailed behaviour of reservoirs and local distribution networks.

## The event

Reports published on 28 September said an Eskom-related power outage and power dip disrupted operations at Rand Water's Zuikerbosch and Lethabo pumping stations. The power supply was reported restored at about 11:20 and pumping resumed. The same reports warned that the affected water systems needed about four further hours for full recovery.

The immediate service risk was wider than the two pumping sites. The affected systems were named as Palmiet, Eikenhof, Zwartkopjes and Vereeniging–Vanderbijlpark–Sasolburg (VVS). Customers supplied through them could experience reduced pressure or interruption while normal operation was restored. The notices named metropolitan, municipal and direct customers, including industrial and mining customers. [Engineering News reported the same operational scope.](https://www.engineeringnews.co.za/article/power-outage-disrupts-rand-water-pumping-operations-2026-09-28)

This is a reported account, not an independently reconstructed incident investigation. It should therefore not be read as proof that every named customer lost supply, that the outage was caused by a failure inside Eskom's system, or that every reservoir or municipal network responded in the same way.

## The cascade

<!-- CASCADE_DIAGRAM -->

The defensible spine is short. Electrical supply to pumping infrastructure was interrupted. Pumping stopped or was disrupted. That affected the bulk-water systems supplied by the sites. The utility restored power and resumed pumping, but the hydraulic system still needed time to recover; customers were warned that pressure or supply could remain impaired.

The important transformation is from electrical availability to stored and moving water. A pumping station is not a switch whose output instantly reappears with its input. When pumping falls, storage and pressure become the intermediary variables. Demand continues while replenishment is constrained. Restoring the electrical feed reopens the possibility of pumping, but does not by itself refill storage, rebalance flows or restore pressure at every endpoint.

That is an inference from the reported recovery interval, not a measured model of the network. The public accounts do not give reservoir levels, flow rates, demand profiles, switching actions, or a chronological record of which customer areas experienced reduced service. Those omissions prevent a stronger claim about the shape or speed of propagation.

## What worked

The available account supports two limited positives. First, power was restored the same morning and pumping resumed. Second, Rand Water communicated that recovery would take longer than the power restoration itself, which is operationally more useful than treating the return of electricity as the end of the event.

The system also appears to have had enough operational separation to frame the outcome as a potential service disruption, rather than evidence that every customer immediately lost water. That may reflect stored water, routing, staggered demand, or local operating decisions. The evidence does not identify which of these buffers were active, how much capacity they carried, or whether they performed as designed. They should therefore be described as possible absorption, not as proven protection.

## What didn't — or we don't know

The power interruption reached two pumping sites and crossed into bulk-water service risk. The most conspicuous unknown is the cause: reports call it Eskom-related, but they do not establish whether the triggering problem was generation, transmission, switching, local equipment, or another mechanism. A power dip and an outage are not interchangeable technical findings.

We also do not know the realised downstream impact. The notices identify customers who may have had low pressure or interruptions; they do not provide an audited count of affected households, hospitals, businesses, mines or municipalities, nor a final time at which every system returned to normal. The four-hour estimate is a recovery statement, not confirmation of uniform recovery.

There is a broader context worth separating from this event. A South African government statement earlier in September recorded concern about recurring power interruptions affecting Rand Water systems and called for a joint response plan. [That context demonstrates an acknowledged dependency,](https://www.gov.za/news/media-statements/government-measures-mitigate-water-supply-disruptions-resulting-power-trips) but it does not prove that the 28 September event had the same cause or that a previously identified protection failed.

## Gray Zones

**Uncertainty is material.** The interruption and recovery estimate are reported, while the root cause and customer-level outcome are unknown. An editor should resist filling that gap with a narrative of grid failure or water-system collapse.

**Ownership is material.** Electricity supply, bulk-water pumping, municipal distribution and end-user service sit with different organisations. A customer can experience the final effect while no single actor owns the full power-to-tap path. The earlier government response makes this coordination boundary visible without resolving it.

**Over-reliance is plausible but not established.** Two pumping sites were affected by the same electrical disturbance. That may indicate a shared dependency, yet the evidence does not show whether alternative feeds, storage, rerouting or standby generation were available, used or inadequate.

**Constraints are material.** Hydraulic recovery takes time even after electrical power returns. In this case, the constraint may have been replenishing pressure and storage under continuing demand. The record does not let us quantify it, which also places this unknown as part of the uncertainty gray zone.

## Risks In Sync

The conventional explanation is already strong: loss of electricity interrupted pumps; restored electricity allowed pumping to restart; the water network then recovered over time. Risks In Sync adds value only if it keeps the boundary crossings explicit: power supply, pumping capability, bulk-water movement, municipal distribution and customers are related but not identical states.

That framing is useful with qualification. It encourages a question that a simple outage timeline can obscure: which buffers sit between a power trip and a loss of water service, and which are independently supplied? It does not demonstrate synchronisation, nonlinear amplification, a phase change, or a hidden feedback loop. Nor does it justify calling the four-hour recovery interval a signature of criticality, but perhaps a call to also focus on delayed system responses.

The best rival account is that this was a routine, contained utility interruption whose limited duration made the system work as intended. Evidence that would strengthen that account includes reservoir data showing stable downstream service. Evidence that would qualify it would include verified reports of prolonged loss of pressure, unserved critical users, or repeated coupled trips despite nominally independent protections.

## What this case changes

The modest practical lesson is to record restoration as a sequence of states rather than a single timestamp. For coupled utilities, an incident log should distinguish: electrical supply restored; pumping restarted; bulk flow stabilised; storage recovered; and customer service verified. That is not a demand for more theory. It is a way to make uncertainty and ownership actionable before the next interruption.

## Evidence status

### REPORTED

Contemporary secondary reporting says that an Eskom-related outage/power dip affected the two Rand Water pumping sites, power was restored at about 11:20, pumping resumed, and the named systems needed additional recovery time.

### OBSERVED

No underlying operational measurements, such as pump telemetry, reservoir levels or independently audited customer service data, were publicly available in the sources reviewed for this draft.

### INFERRED

The distinction between power restoration and water-service restoration implies intervening hydraulic and operational states. It does not establish their exact mechanisms, capacities or performance.

### UNKNOWN

The root cause of the electrical event, final extent and duration of customer impacts, the operation of backups or alternative supplies, and the performance of local municipal buffers remain unknown from the reviewed evidence.

<!-- PRIVATE_FEEDBACK -->

## SOURCES
