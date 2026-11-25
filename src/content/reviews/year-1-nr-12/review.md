---
schema_version: 2
id: crr-y1-n12
slug: year-1-nr-12
status: ready_for_pr
issue:
  year: 1
  number: 12
  label: Year 1 · Nr. 12
review_period:
  start: 2026-11-17
  end: 2026-11-23
publication_date: 2026-11-24
title: A failover that widened the failure
dek: Microsoft's final account of the November Microsoft 365 outage shows how routine traffic redistribution converted a local condition into a global capacity problem.
summary: A latent gateway defect, reduced headroom and a routine Teams failover combined to disrupt Microsoft 365 worldwide—and show why recovery paths deserve the same scrutiny as primary paths.
author: Jose Luis Sanz
language: en
method_version: risks-in-sync-v1
editorial: We usually design systems to work properly. That's what's all about, right? However, we should perhaps start also designing them to fail properly.
cascade:
  title: From local reroute to global gateway exhaustion
  subtitle: A latent defect remained dormant until maintenance, workload migration and peak demand converged
  steps:
    - Dormant defect in Exchange Online gateway servers
    - Routine maintenance reduced available gateway capacity
    - A US East routing issue moved Teams traffic to the gateway servers
    - Peak North American demand exposed lock contention
    - Servers exhausted CPU and memory and became unresponsive
    - Automatic redistribution sent traffic to remaining gateways worldwide
    - Reproducing the same latent failure condition elsewhere
    - Some workloads moved away from the affected gateway
    - But Exchange Online could not do so at the required scale.
    - Engineers patched, restarted and gradually restored capacity
    - Queued enterprise mail was ultimately delivered.
  outcome_status: fully_propagated
  observed_outcome: A global Microsoft 365 gateway incident disrupted Exchange Online and Exchange-dependent features from 12 to 13 November; Microsoft later restored service, reported no loss of enterprise mail and published repair plans on 20 November.
  counterfactual_outcome: null
  evidence_status: REPORTED
  note: The vertical spine simplifies a multi-region, multi-workload event. It represents the documented gateway path, not every customer-level consequence or a claim that all affected services failed in the same way.
sources:
  - id: microsoft-pir
    title: "Incident Information: EX1550543 / MO1550821"
    publisher: Microsoft Corporation (public mirror)
    url: https://www.365fanatic.com/wp-content/uploads/2026/11/postincidentreport-mo1550821.pdf
    published_date: 2026-11-20
    accessed_date: 2026-11-24
    kind: primary
    verification: verified
    note: "Final post-incident report: affected services, trigger conditions, traffic redistribution, recovery, and stated repairs."
  - id: ars-analysis
    title: Three small failures combined to take down Microsoft 365
    publisher: Ars Technica
    url: https://arstechnica.com/gadgets/2026/11/microsoft-details-how-three-problems-combined-for-a-global-outage/
    published_date: 2026-11-16
    accessed_date: 2026-11-24
    kind: secondary
    verification: verified
    note: Independent account of the preliminary report, capacity loss, traffic shift and recovery constraints.
  - id: ap-global-impact
    title: Microsoft says services fully restored after hourslong global outage
    publisher: Associated Press
    url: https://apnews.com/article/microsoft-outage-outlook-email-365-recover-ca395c0f1e51af784b6d70afb6554f6a
    published_date: 2026-11-14
    accessed_date: 2026-11-24
    kind: secondary
    verification: verified
    note: Reports the global operational effects and examples of public-service and business disruption.
  - id: final-report-guide
    title: "Microsoft 365 outage of 12 and 13 November 2026: the final report"
    publisher: 365Fanatic
    url: https://www.365fanatic.com/m365-outage-12-november-2026-final-report/
    published_date: 2026-11-21
    accessed_date: 2026-11-24
    kind: secondary
    verification: verified
    note: Readable independent synthesis of the final report and its future repair commitments.
images: []
assets:
  cover:
    id: cover
    path: assets/cover.jpg
    alt: Cascade Risk Review Year 1, Number 12 cover showing many branching paths narrowing into one constrained route.
    decorative: false
    credit: Jose Luis Sanz Bretón
    source_url: https://riksinsync.com
    rights_basis: Provided by Jose Luis Sanz for Cascade Risk Review.
    verification: cleared
  homepage_vignette:
    id: homepage-vignette
    path: assets/homepage-vignette.jpg
    alt: A wildebeest tells another it found the closest river crossing while a crocodile grabs its tail; other wildebeest walk away behind them.
    decorative: false
    label: Actor–observer bias
    caption: Failure when other is responsible, is normally due to personal choices. When it's us, is the situation to blame.
    credit: Jose Luis Sanz Bretón
    source_url: https://riksinsync.com
    rights_basis: Provided by Jose Luis Sanz for Cascade Risk Review.
    verification: cleared
editorial_modules:
  - type: editorial_note
    body: The final report arrived during this review period. It changes the analysis from a broad cloud outage to a documented case of recovery logic widening a failure domain.
  - type: operator_checklist
    items:
      - signal: A failover transfers a whole workload into a capacity pool shared with a critical service.
        response: Test the receiving pool at peak demand with its existing maintenance and degraded-capacity conditions.
      - signal: Recovery traffic or retries increase while healthy capacity is shrinking.
        response: Use admission control, staged ramp-up and workload- or region-specific back-off before returning nodes to service.
      - signal: A service cannot leave a common gateway at the scale required.
        response: Treat that constraint as a design dependency, not as redundancy, and make it visible in continuity planning.
---

The most useful fact in Microsoft’s final account of its November outage is not simply that a defect existed. It is that a familiar protective move—sending traffic to healthy capacity—helped make the affected capacity global. The report gives enough detail to study a real propagation path without pretending that every disruption experienced by customers had one cause or one severity.

## The event

On 12 November, Microsoft 365 suffered a global incident centered on the network gateways used by Exchange Online. The final post-incident report says a configuration-specific Windows defect made some gateway servers unresponsive under load. Most affected users could not access mailboxes or experienced severe mail delays; functions in Teams, Copilot, SharePoint, OneDrive, Defender and other services that relied on Exchange data were also affected in differing ways. The impact window ran from 16:20 UTC on 12 November to 16:10 UTC on 13 November, followed by monitoring and backlog recovery. [Microsoft’s final report](https://www.365fanatic.com/wp-content/uploads/2026/11/postincidentreport-mo1550821.pdf) says queued enterprise mail was delivered and customer data at rest was unaffected.

The incident’s public consequences were wider than a mail-client malfunction. The Associated Press documented interruption to government, court, health, police and business activities in several countries. Those reports establish operational exposure, not a single causal pathway for each delay or decision. They matter because they show what is at stake when communication, calendar and identity-adjacent capabilities are supplied through the same platform. [AP’s reporting](https://apnews.com/article/microsoft-outage-outlook-email-365-recover-ca395c0f1e51af784b6d70afb6554f6a) does not make the outage a story of inevitable societal collapse; it makes it a story about the practical dependence created by ordinary digital workflow.

## The cascade

<!-- CASCADE_DIAGRAM -->

The initial condition was not an active failure. Microsoft says the defect originated in a July update and was specific to an Exchange Online gateway configuration. It was not present in the standard Windows deployment. Under a particular load pattern, lock contention in an internal process could consume CPU and memory until a server stopped responding.

Three conditions then narrowed the system’s room to choose. Planned maintenance had reduced production capacity. A routing problem in US East caused Teams traffic to fail over to the gateway estate also used by Exchange Online. The transfer was routine; Microsoft reports that the services remained healthy for about sixteen hours. When North American business demand approached its daily peak, the combination exposed the dormant defect.

Once servers failed, the automated response redistributed traffic to remaining gateways across the global fleet. That is the decisive transformation in this case. The system did not merely lose capacity and expose a fixed group of users. Its resilience mechanism transported the relevant workload and failure condition into more capacity units. More capacity became unavailable, which increased the pressure on what remained. This is a positive feedback in the operational sense: loss of gateways increased redistribution, and redistribution increased the likelihood of further loss. It does not establish a general law about cloud systems.

The line is not uniform. Teams, SharePoint and OneDrive could move traffic away and recovered earlier; Exchange Online could not move at comparable scale. Microsoft also reports that restarting servers without the corrective update did not solve the problem because waiting demand could re-create the condition when traffic returned. The recovery path therefore had to include diagnosis, patching, restarting, staged return and delivery-backlog management. [Ars Technica’s independent account](https://arstechnica.com/gadgets/2026/11/microsoft-details-how-three-problems-combined-for-a-global-outage/) usefully distinguishes these constraints from the original defect.

## What worked

Several safeguards limited loss even while availability was seriously impaired. Microsoft retained mail for longer before issuing non-delivery reports, so queued enterprise messages were eventually delivered. It added capacity, applied a targeted fix, restored servers gradually and reported no lost enterprise mail. Some services had enough routing flexibility to leave the affected gateway earlier than Exchange Online.

The final report also identifies completed temporary guardrails intended to prevent automatic traffic distribution from causing the same cascade during recovery. These are not proof that the architecture is now independent or that future failures are contained. They are evidence that operators recognized the redistribution mechanism as part of the incident, not merely as a neutral response.

## What didn't — or we don't know

The central failure was a combination, not a lone defective line of code. Pre-release testing did not represent the newer, higher-core hardware and production traffic mix that exposed the defect. Existing headroom was lower during maintenance. A routine failover transferred a workload globally rather than only in the affected region. And the final report says capacity rejoining service could again be overwhelmed.

What remains unknown matters. Public material does not disclose enough to independently reconstruct each region’s capacity, exact retry behavior, customer-level workarounds, or why the failure zones were not sufficiently small. It also does not show that every disruption reported by downstream organizations resulted from the gateway path rather than local contingency arrangements. No evidence supports linking this incident to the other November outages or to hostile activity; Microsoft explicitly reports neither cyberattack nor malicious activity.

## Gray Zones

**Uncertainty is material.** The final report gives a credible operator account, but it is still the provider’s account and leaves the exact boundary behavior opaque. The corrective roadmap is prospective; its effectiveness is untested in public.

**Ownership is material.** Microsoft controlled the gateway design, maintenance state and recovery logic. Customers controlled their own fallback processes but could not independently move Exchange Online away from the shared gateway. This division should prevent two bad inferences: that customers alone should have solved the outage, or that the provider alone determines all operational harm.

**Over-reliance is material but uneven.** Multiple customer functions depended on the same provider, and some platform features depended on Exchange data even after their front ends recovered. Yet shared branding is not enough to infer a shared failure mode. The relevant concentration is the documented gateway and data dependency.

**Constraints are material.** Exchange Online’s scaling constraint meant it could not escape the affected gateway in the way that some other workloads did. That constraint reduced optionality precisely when fast diversion would have been valuable.

## Risks In Sync

The conventional explanation is already strong: a latent software defect was exposed by capacity reduction, a traffic shift and peak demand. Risks In Sync adds a narrower question: which protection transferred strain across which boundary, and what prevented the stressed workload from choosing another path? Here, that question makes the automatic redistribution visible as a mechanism that changed the incident’s scale.

The method adds little if it merely renames “failover” a cascade. Its value depends on preserving the rival explanation: the global outage could be understood as a single fleet-wide defect under higher load. The final report supports a stronger, qualified inference because it says redistribution expanded and accelerated impact, and because Microsoft’s subsequent work includes smaller failure zones, workload pools, regional rather than global Teams failover, admission control and back-off. The evidence therefore supports “useful with qualification,” not a claim that the case validates a general model.

## What this case changes

Treat a recovery action as a new operational state, not as a successful conclusion. A change review that asks only whether a workload can fail over misses whether its receiving system can absorb the workload while already degraded, under peak demand, and alongside other traffic. The modest intervention is to rehearse those combined states and to cap how quickly traffic, retries and nodes rejoining service can amplify one another. That can move risk elsewhere—slower recovery or deliberately degraded service—so the decision is a trade-off, not a universal remedy.

## Evidence status

### REPORTED

Microsoft reports the defect, maintenance-related capacity reduction, Teams traffic shift, global redistribution, service-specific effects, repair actions and absence of malicious activity. AP reports observed disruption to institutions and businesses during the event.

### OBSERVED

The public record supports that the incident occurred, that multiple Microsoft 365 services experienced disruption, and that service was later restored. It supports the published final report as an artifact, not independent measurement of every technical mechanism within it.

### INFERRED

The interpretation that automatic redistribution widened the failure domain follows the final report’s account of traffic moving to remaining global capacity. The relevance of reduced optionality is an analytical framing, not a fact asserted by Microsoft.

### UNKNOWN

Public evidence does not establish the precise capacity margins per region, the full downstream consequence set, whether future changes will prevent recurrence, or the effectiveness of every promised long-term repair.

<!-- PRIVATE_FEEDBACK -->

## SOURCES
