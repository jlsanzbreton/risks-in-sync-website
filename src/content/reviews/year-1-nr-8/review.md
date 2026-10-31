---
schema_version: 1
id: crr-y1-n8
slug: year-1-nr-8
status: ready_for_pr
issue:
  year: 1
  number: 8
  label: Year 1 · Nr. 8
review_period:
  start: 2026-10-20
  end: 2026-10-26
publication_date: 2026-10-27
title: The hospital network’s safety switch
dek: UNM Health’s response to a cybersecurity threat temporarily redirected ambulances and paused care. The key system question is not whether containment hurt continuity, but how the regional care network absorbed it.
summary: A cybersecurity containment decision at UNM Health briefly shifted ambulance and clinic demand across New Mexico’s healthcare network.
author: Jose Luis Sanz
language: en
method_version: risks-in-sync-v1
editorial: Sometimes, addressing uncertainty as a real threat provides the necessary buffer for a quick pivot adaptation, even if that involves accepting minor disruption and unwanted delays.
cascade:
  title: Containment, rerouting and phased recovery
  subtitle: A cybersecurity response changed patient routing and clinical operations before care resumed.
  steps:
    - UNM Health identified a cybersecurity threat affecting some Health Sciences Center systems on 26 October.
    - Security containment restricted affected systems and UNM limited new-patient acceptance for a two-hour period.
    - Ambulances were diverted and clinic appointments and outpatient procedures were paused or cancelled.
    - Other health systems coordinated to receive redirected patients while UNM restored operations and systems in phases.
    - UNM reported clinical operations fully functional on 28 October, while investigation and some access constraints continued.
  outcome_status: contained
  observed_outcome: The disruption crossed from digital systems into patient-routing, clinic and academic operations, but regional care capacity and phased restoration limited the duration of the reported clinical interruption.
  counterfactual_outcome: null
  evidence_status: REPORTED
  note: This is a simplified service-continuity backbone, not a technical reconstruction of the cyber incident. Public reporting does not establish the intrusion path, affected systems, data exposure, patient outcomes, or the receiving providers’ capacity margins.
sources:
  - id: unm-initial-notice-oct26
    title: Ambulance Traffic Diverted, Clinical Appointments Cancelled and Classes Cancelled Due to Cybersecurity Issue at UNM HSC
    publisher: UNM Health Sciences Center Newsroom
    url: https://hscnews.unm.edu/news/ambulance-traffic-diverted-clinical-appointments-cancelled-and-classes-cancelled-due-to-cybersecurity-issue-at-unm-hsc
    published_date: 2026-10-26
    accessed_date: 2026-10-28
    kind: primary
    verification: verified
    note: UNM’s initial public notice records the ambulance diversion, cancelled appointments and Health Sciences Center disruption.
  - id: unm-it-alert-oct26
    title: "UPDATED: Cybersecurity Issue Affecting UNM Health Sciences Center Services"
    publisher: University of New Mexico Information Technologies
    url: https://italerts.unm.edu/
    published_date: 2026-10-26
    accessed_date: 2026-10-28
    kind: primary
    verification: verified
    note: The IT alert distinguishes affected HSC services from unaffected main and branch campus systems and records continued access limitations.
  - id: ap-unm-cyber-oct26
    title: A cybersecurity issue forces a major New Mexico hospital to divert patients and close clinics
    publisher: Associated Press
    url: https://apnews.com/article/new-mexico-health-cybersecurity-hack-7a3593f8a3cee4ca895774ab1574919f
    published_date: 2026-10-26
    accessed_date: 2026-10-28
    kind: secondary
    verification: verified
    note: Reports coordination by other healthcare providers, the hospital network’s scale and the continuing law-enforcement investigation.
  - id: source-nm-unm-oct26
    title: University of New Mexico Hospital diverting ambulance traffic due to ‘cybersecurity’ issue
    publisher: Source New Mexico
    url: https://sourcenm.com/2026/10/26/university-of-new-mexico-hospital-diverting-ambulance-traffic-due-to-cybersecurity-issue/
    published_date: 2026-10-26
    accessed_date: 2026-10-28
    kind: secondary
    verification: verified
    note: Documents the announced diversion, cancelled appointments and the hospital’s regional trauma role while noting the missing technical detail.
images:
  - id: homepage-fomo-crocodiles
    path: assets/fomo-crocodiles.jpg
    role: homepage
    alt: Two crocodiles watch a crowded wildebeest crossing while a sign points toward a free duck buffet; their speech bubbles joke about following the crowd.
    decorative: false
    label: FOMO feeds the crowd
    caption: Following the crowd's average interest is the surest way to NOT follow your own.
    credit: Risks In Sync editorial illustration, generated with OpenAI image generation
    source_url: https://openai.com/policies/terms-of-use/
    rights_basis: Original editorial asset commissioned by Jose Luis Sanz; cleared for publication in Risks In Sync.
    verification: cleared
---

On 26 October, UNM Health did something that can look contradictory only if a hospital is treated as a building rather than a network: to protect care, it temporarily made some care unavailable. A cybersecurity threat led it to restrict new-patient acceptance, divert ambulances, pause outpatient work and cancel classes at its Health Sciences Center. Those were containment actions, not evidence that digital risk had somehow become a clinical diagnosis.

The case is useful because the public record is clear about the operational shift but deliberately incomplete about the technical incident. It allows a narrower question: when an organisation isolates a suspected digital threat, where does the interrupted work go, who has capacity to take it, and what evidence would show that the protective switch contained harm rather than merely moved it?

## The event

[UNM’s initial notice](https://hscnews.unm.edu/news/ambulance-traffic-diverted-clinical-appointments-cancelled-and-classes-cancelled-due-to-cybersecurity-issue-at-unm-hsc) said that a cybersecurity issue affected the Health Sciences Center on 26 October. The health system diverted all ambulance traffic, cancelled appointments at its clinics, told patients not to come to UNM Health facilities that day, and sent non-essential staff and health-sciences students home. Its IT alert separately stated that some HSC services could be unavailable while main and branch campus systems were not affected. That boundary matters: this was not a demonstrated collapse of the whole university.

The reported service effects reached more than a single emergency department. [Source New Mexico](https://sourcenm.com/2026/10/26/university-of-new-mexico-hospital-diverting-ambulance-traffic-due-to-cybersecurity-issue/) described a health system with clinics across the state and noted UNM Hospital’s regional Level I trauma role. [Associated Press](https://apnews.com/article/new-mexico-health-cybersecurity-hack-7a3593f8a3cee4ca895774ab1574919f) reported that Presbyterian Healthcare Services and Lovelace Health System were coordinating with UNM, including taking additional patients. The available reporting therefore supports a real transfer of demand between providers; it does not quantify that demand or establish strain at those receiving facilities.

By 28 October, UNM said clinical operations across its facilities were fully functional. It also said its teams had acted to protect core networks, systems and servers, and warned people not to engage with groups claiming responsibility. That update is an operational recovery statement, not a final technical or forensic report.

## The cascade

<!-- CASCADE_DIAGRAM -->

The initial disturbance was an identified cybersecurity threat affecting part of a health-and-academic environment. The first documented state change was not a patient injury or a confirmed compromise of every system. It was a containment decision: some systems and services were restricted while teams investigated.

That decision crossed an organisational boundary when it changed patient routing. Ambulances were sent to other hospitals, while clinics and outpatient procedures were interrupted. The quantity moving through the network was not “cyber risk” in the abstract; it was patient demand, appointment load and clinical decision-making capacity. A diversion has direction and a receiver. It therefore provides a firmer systems connection than merely noting that computers and healthcare were both affected.

The regional response was an absorber. Other providers accepted or prepared to accept redirected patients while UNM brought operations back in phases. That did not erase the disruption: cancelled care and rerouted transport are real effects. But it helped arrest propagation before the public record showed a longer clinical shutdown. The later resumption of operations demonstrates restored service availability, not proof that every backlog, deferred procedure or information-security exposure was resolved.

## What worked

The most defensible success is the separation of containment from denial. UNM did not wait for a complete public explanation before reducing exposure, and it communicated a clear route for emergencies: use 911. The choice to limit new admissions and pause appointments imposed costs, but it made the operational boundary visible rather than allowing uncertain digital conditions to remain invisible inside clinical workflows.

Regional redundancy also mattered. AP’s reporting that other providers coordinated with UNM is evidence of practical, if limited, absorptive capacity. This is different from saying the system was independent. It is evidence that care could be redistributed for a time. The recovery was phased rather than presented as a single restart, and UNM’s subsequent update says clinical operations were fully functional by 28 October.

## What didn't — or we don't know

The public record does not identify the intrusion method, attacker, affected applications, patient-data exposure, duration of unauthorised access, or the full rationale for each operational restriction. It also does not establish whether any patient experienced a worse clinical outcome, how many ambulances were rerouted, what delays occurred, or whether receiving hospitals operated close to capacity.

The strongest competing explanation is that this was a prudent, short-lived continuity protocol rather than a meaningful cascade. That explanation has force: a two-hour reported limit on new-patient acceptance and rapid restoration do not by themselves prove extensive propagation. The case should therefore not imply a healthcare catastrophe. The interpretation changes if a later incident report shows that restrictions were broader or longer than announced, or that diverted demand caused measurable delays elsewhere.

## Gray Zones

**Uncertainty is material.** The organisation has confirmed a threat and service actions, but not a technical cause or a complete impact assessment. Treating claims made by purported attackers as evidence would be especially unsafe; UNM explicitly warned against engaging with them. In this case, uncertainty was not a risk blindly taken, it was addressed and confined.

**Ownership is material.** Security teams could contain systems, but ambulance dispatch, receiving hospitals, clinic managers, university leaders and law enforcement each controlled a different part of the response. No single team owned the whole continuity outcome.

**Constraints are material.** A diversion works only while destination capacity, travel time, staff and information flows are adequate. The record establishes coordination, not those margins. **Over-reliance is plausible but not proven:** operational disruption after a digital restriction shows dependence on digital services, but does not reveal whether there were adequate manual alternatives for each workflow.

## Risks In Sync

The conventional account is enough to explain the event: a cyber threat prompted a hospital system to follow protective procedures. Risks In Sync adds value only by making the trade-off explicit. A security control can be locally correct and still export workload to ambulance routing, peer providers and patients with postponed care. That is not an accusation that the control was wrong. It is the question a continuity plan should answer before an incident: which services stop, who receives the displaced demand, and what signals show that the buffer is nearing exhaustion?

The method is useful with qualification. It cannot identify the attack path or prove clinical harm from the available evidence. It does distinguish a bounded transfer from an undifferentiated “hospital outage,” and it keeps recovery from being mistaken for proof that every consequence has disappeared.

## What this case changes

For healthcare cyber-resilience, a diversion plan should be tested as a regional capacity arrangement, not merely as a communications template. The practical test is not whether a hospital can issue a diversion notice. It is whether named receiving partners, ambulance services and outpatient channels can absorb the shifted load for a stated duration while information is incomplete.

That is a modest change in emphasis. It does not require a claim that decentralised care is always safer, nor does it turn a short interruption into a universal warning. It asks continuity planners to measure the receiving side of their protective actions as carefully as the system they isolate.

## Evidence status

### REPORTED

UNM reported the cybersecurity threat, ambulance diversion, clinic cancellations and subsequent restoration of clinical operations. AP and Source New Mexico reported coordination with other providers and described the regional role of UNM Hospital.

### OBSERVED

The published operational notices and subsequent status update demonstrate that UNM publicly changed service availability and later declared clinical operations functional. They do not independently measure clinical outcomes or the technical extent of the incident.

### INFERRED

The article infers that diversion shifted some demand into the regional healthcare network and that the network absorbed it sufficiently for the documented interruption to remain bounded. This is an interpretation of the reported coordination and restoration, not a quantified capacity finding.

### UNKNOWN

The threat’s source, scope, affected data, patient-level consequences, unserved demand, receiving-provider load, and final corrective actions remain unknown in the public material reviewed.

<!-- PRIVATE_FEEDBACK -->

## SOURCES
