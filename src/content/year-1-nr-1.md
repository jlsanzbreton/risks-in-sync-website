On the evening of 1 September, a disturbance near an Amprion high-voltage substation in Germany's Rhineland disconnected five large generating units from the grid.

Together, the units represented **4.2 GW of installed capacity** and were producing about **3 GW at the time**. That sounds like the start of a blackout story.

It was not.

[Amprion reported](https://www.amprion.net/Presse/Presse-Detailseite_98753.html) that the general electricity supply was unaffected and system stability remained secure. The disturbance travelled through several connected systems, then stopped before it reached electricity users.

This review asks both questions: **what propagated, and what prevented it from becoming worse?**

## The event

At around 20:00 on 1 September, an incident occurred near Amprion's Rommerskirchen substation, west of Cologne. Power-station feeder connections were affected and five lignite units at RWE's Neurath and Niederaußem sites left the grid: Neurath G and F, and Niederaußem H, G and K.

[RWE confirmed](https://www.rwe.com/en/press/rwe-power/2026-09-02-rwe-power-plants-in-the-rhenish-region-affected-by-an-incident-near-a-substation/) the five units, their combined capacity and their live output at the time.

Police said the cause did not appear to be a normal technical malfunction and investigated deliberate interference. [Associated Press reported](https://apnews.com/article/ef9c21908f232651d056d7462330e2b7) that investigators found launch devices in a nearby cornfield and believed conductive material had been used to create short circuits on power lines.

Another suspected sabotage incident had occurred hours earlier at a major substation in Brandenburg. Authorities were investigating both events, but no connection or attribution had been established during this review period. This review concerns the **Rommerskirchen/Bergheim cascade**, not who carried out the attack.

## The cascade

<!-- CASCADE_DIAGRAM -->

The initiating disturbance appears to have moved from physical interference, through a short circuit and transmission connection, into two generating sites. Five units then disconnected and roughly 3 GW of live production disappeared.

That is already a cascade: **one local disturbance affected one transmission connection, two power stations and five generating units.**

The public record does not identify the detailed protection sequence, reserve activation, dispatch decisions or control actions that followed. We should not invent them.

The observable outcome is narrower but important: a large and sudden generation loss did not become a general customer outage.

Human operations were also part of recovery. Grid operators managed the changed generation pattern while RWE teams restarted large thermal units and the authorities investigated the site. [A restoration update reported](https://www.zeit.de/news/2026-09/02/zwei-von-fuenf-kraftwerksbloecken-nach-sabotage-wieder-am-netz) that three of the five units were back online the following day.

## What worked

The wider electricity system contained the event. Five units with 4.2 GW of installed capacity went offline while Amprion reported no general interruption and stable system operation.

The most defensible conclusion is therefore about outcome, not mechanism: **the system absorbed the loss without passing it on to consumers as a large-scale outage.**

Available generation and network capacity elsewhere in the interconnected system appear to have provided operational room. The grid was not dependent on these five units remaining online at that moment.

Protective separation may also have acted as a breaker. Disconnecting affected units can prevent abnormal electrical conditions from spreading or damaging equipment. But the public sources do not establish exactly which protections acted, or in what order. Calling the trips a successful breaker is an **inference**, not a reported fact.

The result still illustrates a useful resilience principle: a component can fail or be removed from service without the failure becoming everybody else's problem.

## What didn't — or we don't know

The grid contained the electrical consequence, but the initiating physical interference still reached critical infrastructure. That suggests a gap somewhere along the access and prevention path. It does not tell us which control failed, or whether a relevant control existed.

Electrical protection detected and responded to the disturbance downstream. Whether preparations could have been detected before electrical contact was made is unresolved. That question crosses physical access, surveillance, patrols, land use, infrastructure monitoring and police intelligence.

Public evidence did not establish:

- who carried out the attack or why;
- whether it was connected to the Brandenburg incident;
- how long the devices had been in place;
- which security controls covered the access path;
- whether any system detected preparations beforehand;
- the detailed sequence of protection trips;
- which balancing resources compensated for the lost generation; or
- whether relevant security improvements had already been identified.

Unknown should remain unknown. Containment was visible; the exact machinery of containment was not.

## Gray Zones

### Uncertainty

The grid handled the consequence of a major connection disturbance. We do not know which scenario its planners had modelled.

Sabotage raises a harder question than a random component failure: what happens when an adversary selects several assets because they share a dependency? The case does not show that German contingency planning ignored this possibility. It shows why accidental and deliberately correlated failures should not be treated as the same problem.

### Ownership

Amprion operates transmission infrastructure. RWE operates the generating units. Police and public authorities have security roles. Land around overhead infrastructure may involve other owners.

Each organisation can perform its own task while a gap persists between them. The useful ownership question is not only “who owns the substation?” but **who owns the complete path that allowed outside interference to remove several gigawatts of generation?** Public reporting does not answer it.

### Over-reliance

Interconnection worked in two directions. It carried the disturbance to assets beyond its apparent point of origin, but it also allowed the wider system to compensate.

The same connection was therefore both a **propagation path** and part of a **buffer**. That tension is more informative than labelling interconnection simply good or bad.

### Constraints

Every kilometre of high-voltage infrastructure cannot be guarded or made invulnerable. Money, people and monitoring capacity are limited.

The practical question is where extra protection changes the outcome most. That requires identifying not only expensive assets, but nodes whose disruption can synchronise consequences across several systems.

## Risks In Sync

A conventional summary might call this “sabotage of electricity infrastructure.” Risks In Sync follows the path instead:

```text
outside actor → physical access → conductive material → high-voltage line
→ transmission connection → five generating units → 3 GW output lost
→ grid control + available capacity → consumer supply maintained
```

That path exposes four different intervention windows:

```text
before: access → detection → intervention
during: electrical disturbance → protection → isolation
after: generation loss → balancing → alternative supply
recovery: affected units → staged restart
```

Some layers appear to have worked well. Others remain undocumented.

The case also clarifies the difference between a breaker and a buffer. A **breaker** interrupts propagation; the unit trips may have served that role. A **buffer** absorbs a consequence after propagation has occurred; the wider grid appears to have absorbed the sudden loss. Resilient systems often need both, but the evidence here is stronger for the outcome than for the individual mechanisms.

## What this case changes

Risks In Sync was useful here because it kept attention on the propagation path and on successful containment, not only the initiating act. Gray Zones also surfaced a meaningful ownership question across physical security, network operation and public authority.

The method added less when it tried to name specific protection or balancing mechanisms: public technical evidence was too limited. Those points must remain hypotheses.

This case suggests one modest refinement: future reviews should separate **upstream prevention**, **downstream containment** and **recovery**, then state the evidence level for each. It does not yet justify a stronger claim about which security measure should change.

## Evidence status

### REPORTED

An incident occurred near Amprion's Rommerskirchen substation at about 20:00 on 1 September. Five RWE lignite units with 4.2 GW of total capacity went offline while producing about 3 GW. Police treated the event as deliberate interference. Amprion reported no general supply interruption and said system stability remained secure.

### OBSERVED

A local physical disturbance propagated through transmission infrastructure into five generating units at two power stations, but did not propagate into a general customer blackout.

### INFERRED

The wider transmission system, available alternative supply, operating controls and protective isolation together behaved as buffers and breakers. Their individual contributions have not been publicly documented.

### UNKNOWN

Perpetrator, motive, detailed protection sequence, precise balancing response, upstream security gaps and any confirmed connection to other German grid incidents remained unresolved in the evidence reviewed through 7 September 2026.

## Sources

1. **[Amprion — “Ausfall von Kraftwerkszuleitungen im Rheinland: Untersuchungen zu Vorfall laufen,” 2 September 2026.](https://www.amprion.net/Presse/Presse-Detailseite_98753.html)** Primary transmission-operator statement on the affected feeders, public supply and system stability.
2. **[RWE — “Power stations affected by incident near substation,” 2 September 2026.](https://www.rwe.com/en/press/rwe-power/2026-09-02-rwe-power-plants-in-the-rhenish-region-affected-by-an-incident-near-a-substation/)** Primary generator statement on the five units, installed capacity, live output and restoration.
3. **[Reuters — “Germany probes second power grid sabotage case,” 2 September 2026.](https://www.internazionale.it/ultime-notizie-reuters/2026/09/02/german-power-grid-under-fresh-sabotage-attack-police-say)** Independent reporting on the investigation, generation loss and grid stability.
4. **[Associated Press — “Germany probes suspected sabotage after disruption at 2 power substations,” 2 September 2026.](https://apnews.com/article/ef9c21908f232651d056d7462330e2b7)** Independent reporting on the suspected short-circuit mechanism and wider investigation.
5. **[Die Zeit / dpa — “Drei von fünf Kraftwerksblöcken nach Sabotage wieder am Netz,” 2 September 2026.](https://www.zeit.de/news/2026-09/02/zwei-von-fuenf-kraftwerksbloecken-nach-sabotage-wieder-am-netz)** Restoration update on the staged return of generating units.
6. **[Brandenburg Police — “Medieninformation bzgl. des Anschlags in Turnow-Preilack,” 2 September 2026.](https://polizei.brandenburg.de/pressemeldung/medieninformation-bzgl-des-anschlags-in-/5711687)** Primary statement on the separate Brandenburg incident, included as context rather than evidence of a connection.
