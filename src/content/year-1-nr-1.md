On the evening of 1 September, something happened near an Amprion high-voltage substation in the Rhineland, west of Cologne.

It was not treated as an ordinary equipment fault for long.

Police later said the evidence pointed to a deliberate act. Five lignite-fired generating units at two RWE power stations—Neurath and Niederaußem—were disconnected from the grid. Together they represented about **4,200 MW of installed capacity** and were producing roughly **3,000 MW at the moment of the incident**. [RWE confirmed the units and output involved](https://www.rwe.com/en/press/rwe-power/2026-09-02-rwe-power-plants-in-the-rhenish-region-affected-by-an-incident-near-a-substation/).

That sounds like the beginning of a blackout story.

It wasn't.

[Amprion reported](https://www.amprion.net/Presse/Presse-Detailseite_98753.html) that the **general electricity supply remained unaffected and grid stability was maintained throughout**.

That makes this case particularly interesting for Cascade Risk Review.

The attack propagated. Several large generating units were lost. But the cascade stopped before reaching millions of electricity users.

The question is therefore not only **what failed?** It is also: **what prevented this from becoming much worse?**

## What happened?

At around 20:00 on Tuesday, 1 September, an incident occurred near Amprion's Rommerskirchen substation in Germany's Rhineland.

The disturbance affected power-plant feeder connections and caused five RWE generating units to leave the grid:

- Neurath G
- Neurath F
- Niederaußem H
- Niederaußem G
- Niederaußem K

Their combined capacity was approximately 4.2 GW. At the time, they were supplying about 3 GW into the German grid.

Police subsequently said they did not believe the cause was a normal technical malfunction and were investigating a deliberate criminal act. [Associated Press reported](https://apnews.com/article/ef9c21908f232651d056d7462330e2b7) that investigators found launch devices in a nearby cornfield and concluded that conductive material had been used to create short circuits on power lines.

The event came only hours after another suspected sabotage incident at a major substation in Brandenburg, where explosive and incendiary devices damaged high-voltage lines near the Jänschwalde power station. Authorities were investigating whether the events were related, but no connection or attribution had been established during the review period.

That uncertainty matters.

This edition is about the **Rommerskirchen/Bergheim cascade**, not about who carried out the attack.

## The knock-on effect

<!-- CASCADE_DIAGRAM -->

That **X** is the most important part of the diagram.

The cascade travelled several steps. It did not travel all the way.

## The systems involved

### 1. Physical infrastructure

The initiating disturbance occurred around high-voltage transmission infrastructure.

Conductive material appears to have been deliberately introduced onto electrical lines, creating a short circuit.

This was a physical attack on a physical system. But its significance came from what that infrastructure connected.

### 2. Generation

The electrical disturbance propagated from the transmission connection into two separate RWE generating sites.

Five large lignite units went offline.

This is already a cascade:

> **one disturbance → one transmission node → two power stations → five generating units.**

The individual plants were not the original target. They were downstream systems connected to the disturbed node.

### 3. Grid control and protection

This is where the incident becomes much more interesting.

Around 3 GW of generation disappeared from the system, but Amprion said both electricity supply and system stability remained secure.

That outcome requires the wider electricity system to respond.

Public statements do not tell us exactly which automatic protection schemes, dispatch decisions, reserves or control actions were used.

So we should not invent them.

But the observable result is clear:

> **the transmission system absorbed the loss without passing it on to consumers as a large-scale outage.**

In RiS terms, the wider grid acted as a buffer.

### 4. Human operations

People also became part of the recovery system.

Grid operators had to manage a suddenly changed generation pattern. RWE teams began the process of bringing large thermal units back online. Police and security authorities simultaneously had to isolate the scene, investigate the cause and protect infrastructure from further interference.

By the following day, Neurath G and Niederaußem H had already returned to service, with additional units expected to follow progressively. [A restoration update reported](https://www.zeit.de/news/2026-09/02/zwei-von-fuenf-kraftwerksbloecken-nach-sabotage-wieder-am-netz) that three of the five units were back online later that day.

The recovery therefore depended on both technical systems and coordinated human action.

## What worked well?

### The wider grid

This is the clearest success.

Five generation units representing 4.2 GW of capacity were lost, yet there was no general interruption to electricity customers.

Amprion explicitly stated that **system stability was maintained at all times**.

This is exactly what resilience should look like.

Not: **nothing fails.**

But: **something important fails and the failure does not become everybody else's problem.**

### Alternative generation and network capacity

The missing production could be supplied or balanced elsewhere in the interconnected system.

Reporting described Amprion as able to source missing electricity volumes from other parts of the system.

That is redundancy with real operational value. The network was not dependent on those five units continuing to operate at that particular moment.

### Protective separation

The affected generating units went offline rather than continuing to operate through abnormal electrical conditions.

We do not have enough public technical evidence to identify precisely which protections acted or in what sequence.

But the result is consistent with one of the fundamental purposes of grid protection: **sacrifice a component or section of operation rather than allow instability or damage to spread.**

From a RiS perspective, losing five units can therefore be simultaneously **a serious consequence** and **a successful breaker.** Those ideas are not contradictory.

## What only partially worked?

### Physical security

The grid survived the attack. But someone appears to have been able to create a significant electrical disturbance from outside the normal operational system.

That means the resilience of the **electrical network** was much stronger than the apparent resilience of at least part of its **physical perimeter**.

This distinction matters. A system can be highly resilient after an event while remaining too easy to perturb in the first place. Those are different layers of protection.

### Detection

The protection system detected and responded to the electrical disturbance. But that is downstream detection.

A more difficult question is whether the system could identify preparations for the attack **before electrical contact was made**.

That crosses several domains: physical security, cameras, patrols, vegetation and land access, anomaly detection, infrastructure monitoring and police intelligence.

The electrical system appears to have reacted very well. Whether the security system could have reacted earlier remains a much more open question.

## What failed—or remains unknown?

We should be careful with the word *failed*.

The public evidence supports several facts:

- deliberate external interference was considered highly likely;
- several transmission connections were disrupted;
- five power units went offline;
- around 3 GW of production disappeared;
- public supply and overall grid stability were maintained.

But important details remained unknown at the close of the review period.

Public sources did not yet establish:

- who carried out the attack;
- whether the same people were responsible for the Brandenburg incident;
- exactly how long the devices had been in place;
- which security controls existed around the attack path;
- whether any detection system identified them beforehand;
- the detailed sequence of protective trips;
- exactly which reserve or balancing resources compensated for the generation loss;
- or whether security improvements had already been identified before the incident.

Unknown should remain unknown.

That is preferable to making the story more dramatic than the evidence allows.

## Gray Zones

This case is full of them.

### Uncertainty

Which scenario was actually being protected against?

Perhaps the engineering design assumed: **one transmission component fails.** The grid proved capable of handling that kind of consequence extremely well.

But sabotage introduces a different question: **what if several deliberately selected assets are attacked in a coordinated way?**

That is not simply a larger version of the same failure. It changes the structure of the problem.

A contingency model designed around random independent failures may behave very differently when failures are deliberately chosen because they share a hidden dependency.

### Ownership

Who owns the complete risk?

Amprion owns transmission infrastructure. RWE operates the generating units. Police protect public security. Other authorities oversee critical-infrastructure protection. Land around overhead transmission infrastructure may involve still other owners.

Each organisation can perform its own role correctly while a dangerous gap exists **between their roles**.

The useful question is therefore not: **who owns the substation?**

It is: **who owns the pathway that allows someone outside the electricity system to remove several gigawatts of generation?**

The answer may be nobody. That is a Gray Zone.

### Over-reliance

High-voltage networks are deliberately interconnected. That interconnection is exactly what helped Germany absorb the disruption.

But interconnection works in two directions.

It provides resilience because other parts of the network can compensate. It also provides propagation paths because a disturbance at the right node can influence assets far beyond the point where it began.

So interconnection is neither simply good nor bad. It is both **buffer** and **pathway.**

That is one of the recurring tensions in complex systems.

### Constraints

You cannot surround every kilometre of high-voltage infrastructure with guards. You cannot eliminate every possible physical access point. You cannot make every component invulnerable.

And attempting to do so would consume enormous amounts of money and operational capacity.

The practical question therefore becomes: **where does additional protection make the greatest difference?**

That requires knowing which locations are not merely valuable assets but **high-consequence propagation nodes**.

Those are not necessarily the same thing.

## The Risks In Sync view

A conventional risk assessment might describe the scenario as:

> Sabotage of electricity infrastructure.

RiS would be more interested in the path.

```text
OUTSIDE ACTOR → physical access → conductive material → high-voltage line
→ substation / feeder → generation connection → five generating units
→ 3 GW sudden imbalance → grid control + reserves → consumer supply
```

Now the interesting question becomes: **at which boundary can propagation be interrupted most effectively?**

There were several opportunities.

Before the attack:

```text
access → detection → intervention
```

During the attack:

```text
electrical disturbance → protection → isolation
```

After the attack:

```text
generation loss → balancing → alternative supply
```

And finally:

```text
damaged system → repair → staged restart
```

Some of those layers appear to have worked extremely well. Others deserve harder questions.

### Buffers versus breakers

This case is also useful because it shows the difference.

A **breaker** stops propagation. Disconnecting affected generation can function as a breaker:

```text
abnormal electrical condition → TRIP × equipment damage / instability
```

A **buffer** absorbs the consequence after propagation has already occurred. The wider interconnected grid behaved more like a buffer:

```text
3 GW disappears → other system capacity → imbalance absorbed
→ customers remain supplied
```

Both matter. A resilient system usually needs both.

### What could Risks In Sync change?

Rather than asking only **which assets are critical?**, RiS would ask: **which assets sit on paths that can synchronise several systems at once?**

The Rommerskirchen event apparently connected:

- physical security;
- transmission infrastructure;
- generation;
- automated electrical protection;
- grid-control operations;
- balancing resources;
- plant restart procedures;
- law enforcement;
- and national critical-infrastructure security.

The substation matters because of those relationships. Not merely because a substation is expensive.

This is why cascade analysis should follow **connections**, not asset values.

### What could Gray Zones change?

Gray Zones pushes the investigation one step further. It asks where the most important questions fall outside neat organisational ownership.

**Uncertainty:** Are contingency models testing accidental failures or intelligent adversaries selecting correlated targets?

**Ownership:** Who owns security along the complete propagation path?

**Over-reliance:** Which nodes connect more systems than their apparent physical importance suggests?

**Constraints:** Where should limited security money, people and monitoring capability be concentrated?

Those questions may produce more useful protection than simply adding another fence around every substation.

## Practical lessons

1. **Study successful containment, not only failure.** The absence of a blackout is evidence. Something worked.
2. **Separate prevention from resilience.** The grid may have been resilient to the electrical consequence while physical prevention was insufficient.
3. **Model deliberate correlation.** Independent-failure assumptions are weaker when someone can intentionally select several connected targets.
4. **Measure fallback capacity.** A reserve is useful only if it can absorb the size and speed of the disturbance that actually arrives.
5. **Look for propagation nodes.** The most important asset may be the one connecting several systems rather than the most expensive one.
6. **Protect paths, not only objects.** Physical security, detection, electrical protection, balancing and recovery are successive layers of one system.

## Closing reflection

A significant amount of generation disappeared from Germany's grid in a few seconds.

Five large units were affected. Yet ordinary electricity users apparently saw almost nothing.

That makes this incident easy to underestimate. I think it should produce the opposite reaction.

A catastrophe did not occur partly because several systems absorbed and interrupted the disturbance. Those successful protections give us evidence about how resilience actually works.

But they also reveal the next question.

If one deliberately created short circuit could remove around 3 GW of live generation without causing a blackout: **what happens when the next disturbance arrives through two or three carefully selected paths at the same time?**

That is where Risks In Sync becomes useful.

Not in predicting the next attack. But in finding the pathways that would allow the next disturbance to become something larger.

## Evidence status

### REPORTED

An incident occurred near Amprion's Rommerskirchen substation at about 20:00 on 1 September. Five RWE lignite units with 4.2 GW of total capacity went offline; they had been providing about 3 GW. Police treated the event as deliberate interference. Amprion reported no general supply interruption and said grid stability remained secure.

### OBSERVED

A local physical disturbance propagated across transmission infrastructure into five generating units at two separate power stations, but did not propagate into a general customer blackout.

### INFERRED

The wider transmission system, available alternative supply, operating controls and protective isolation together behaved as buffers and breakers that prevented further propagation.

The exact contribution of each layer has not yet been publicly documented.

### UNKNOWN

Perpetrator, motive, detailed protection sequence, precise balancing response, upstream security gaps and any confirmed connection to the other German grid incidents remained unresolved in the public evidence reviewed through 7 September 2026.

## Sources

1. **[Amprion — “Ausfall von Kraftwerkszuleitungen im Rheinland: Untersuchungen zu Vorfall laufen,” 2 September 2026.](https://www.amprion.net/Presse/Presse-Detailseite_98753.html)** Primary transmission-operator statement confirming effects on power-plant feeders and that public supply and system stability remained unaffected.
2. **[RWE — “Power stations affected by incident near substation,” 2 September 2026.](https://www.rwe.com/en/press/rwe-power/2026-09-02-rwe-power-plants-in-the-rhenish-region-affected-by-an-incident-near-a-substation/)** Primary generator statement confirming five affected units, 4,200 MW total capacity and approximately 3,000 MW of generation at the time.
3. **[Reuters — “Germany probes second power grid sabotage case,” 2 September 2026.](https://www.internazionale.it/ultime-notizie-reuters/2026/09/02/german-power-grid-under-fresh-sabotage-attack-police-say)** Independent reporting on the police investigation, generation loss and continued grid stability.
4. **[Associated Press — “Germany probes suspected sabotage after disruption at 2 power substations,” 2 September 2026.](https://apnews.com/article/ef9c21908f232651d056d7462330e2b7)** Independent reporting on the apparent short-circuit mechanism and wider investigation.
5. **[Die Zeit / dpa — “Drei von fünf Kraftwerksblöcken nach Sabotage wieder am Netz,” 2 September 2026.](https://www.zeit.de/news/2026-09/02/zwei-von-fuenf-kraftwerksbloecken-nach-sabotage-wieder-am-netz)** Restoration update confirming the staged return of generating units.
6. **[Brandenburg Police — “Medieninformation bzgl. des Anschlags in Turnow-Preilack,” 2 September 2026.](https://polizei.brandenburg.de/pressemeldung/medieninformation-bzgl-des-anschlags-in-/5711687)** Primary statement on the separate Brandenburg attack, included as contextual evidence and not as proof that the incidents were linked.
