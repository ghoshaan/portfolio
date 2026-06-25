# Portfolio of Work

**Quality & Operations Specialist | AI Data Quality | Process Design**

---

## About This Document

This document presents three case studies from my work as a Team Lead on a large-scale AI audio transcription project at Alignerr, where I was one of seven leads overseeing a team of approximately 1,000 contributors.

My role evolved from annotator to reviewer to Team Lead within a month. As lead, my focus was quality assurance at scale — auditing contributor performance, designing feedback systems, building tools to improve the research and review workflow, and communicating operational findings to project stakeholders.

The case studies below represent work I conceived and drove independently, and are representative of how I approach problems: identifying the root cause, building something that addresses it systematically, and measuring whether it worked.

---

## Case Study 1: Aviation Research Chrome Extension

**Alignerr | Audio Transcription Project | Team Lead**

### Background

On a large-scale audio transcription project at Alignerr, contributors were required to accurately transcribe aviation communications containing specialised identifiers — aircraft callsigns, navigational fix names, route waypoints, and aircraft types. This information was dense and required active research to verify correctly.

### The Problem

In practice, many contributors were skipping verification entirely and guessing from audio alone — producing a systematic category of errors that were difficult to catch without already knowing the correct answer. For those who did research, the process was slow and fragmented: multiple browser tabs, manual lookups across several sources, and no tooling to connect the results.

At a project scale of 100,000+ data rows per week, even two minutes of unnecessary lookup time per row represented an enormous cumulative drag on throughput and accuracy.

### What I Built

I designed and built a Chrome extension that consolidated the research workflow into a single interface. A contributor entering a flight's callsign and date could fetch a unified view drawing from multiple sources simultaneously:

- **FlightAware route and tracklog data** — showing the decoded route (airports and fixes with coordinates) alongside altitude and speed at each waypoint, directly useful for verifying controller-assigned crossing restrictions in the audio
- **FAA CIFP navaid data** — hardcoded and mapped so that three-letter codes (e.g. *SIE*) resolved to their full spoken names and project-compliant formatting (e.g. *SEA ISLE*), eliminating an entire category of transcription error
- **FAA Order 7360.1K aircraft model dictionary** — parsed and cross-referenced with FlightAware registration data to identify aircraft by model name, since US-registered aircraft are frequently referred to by type rather than registration prefix
- **Historical flight pattern summarisation** — for recordings older than three months, where exact flight data was unavailable, the extension summarised recent route history to identify the most likely airports involved — a research angle that would otherwise have been impractical to pursue manually

The extension also auto-populated the date field from the project platform's UI, minimising manual input.

### Impact

- Eliminated multiple categories of transcription error endemic to the manual research process
- Saved approximately 2 minutes per data row at a project throughput of 100,000+ rows per week
- Introduced research capabilities — particularly historical flight summarisation — that had no practical equivalent in the prior workflow
- Shared via demo videos; adopted by the full team within two weeks
- Published to the Chrome Web Store, reaching a peak of **997 active users**: [Froyo Flight/Route Overlay](https://chromewebstore.google.com/detail/froyo-flightroute-overlay/mffgffgdhkpmjdkhhapknmnofnegeoop)

---

## Case Study 2: Audit Tool Redesign

**Alignerr | Audio Transcription Project | Team Lead**

### Background

As one of seven Team Leads overseeing a ~1,000-person annotation team on an audio transcription project at Alignerr, I was responsible for auditing contributor work and producing feedback documents that could drive genuine improvement. Audit quality was consequential: it determined who was remediated, who was removed, and ultimately the quality of training data reaching the model.

### The Problem

The existing audit workflow required loading data rows individually through the project's platform UI — a slow process that capped each session at 10–15 rows. Feedback was written as plain-text corrections, which was functional but difficult to parse quickly and harder still to learn from systematically.

With nearly 1,000 contributors to oversee across seven leads, the ceiling on audit volume was a real constraint on quality visibility.

### What I Built

I designed and directed the development of an NDJSON-based audit viewer. Contributor data exported from the project platform could be uploaded directly, displaying all rows simultaneously with instant loading. Instead of typing corrections as text, auditors could edit transcriptions inline — with changes rendered as a visual differential, making it immediately clear what had changed, where, and by how much. Each row could be rated on a severity scale (good / minor issue / major issue / reject), and the completed audit exported as a structured PDF — giving contributors a clear, self-contained document they could reference and learn from independently.

### Impact

- Audit throughput increased from 10–15 rows to 25–30 rows per session in approximately 20 minutes — roughly doubling the sample size per audit
- Larger samples produced more accurate pictures of quality trends per contributor, rather than snapshots of isolated errors
- The improvement in feedback richness directly contributed to a shift in project remediation policy: rather than removing underperforming contributors outright, project managers introduced a structured improvement pathway — maintaining team throughput while targeting quality
- Adopted by all team leads across the project

---

## Case Study 3: Operational Scope Analysis

**Alignerr | Audio Transcription Project | Team Lead**

### Background

When the project expanded from US-sourced aviation audio to international datasets, the workflow complexity increased substantially. Project managers asked me to document the operational impact — a written analysis to be passed to the client to justify a budget increase or scope adjustment.

### What I Did

I produced a structured analysis covering four categories of increased burden: chart accessibility, licensing and cost constraints, audio and linguistic barriers, and flight tracking limitations. Each point was grounded in specifics rather than general complaint:

- International aviation charts are predominantly unstructured PDFs with no parseable data; building a custom extraction script for a single country required approximately 7 hours of work
- Official international chart subscriptions cost up to $913 per user per year; the only affordable alternative contractually prohibited use outside flight simulation
- Standard flight verification relied on ADS-B transponder data — infrastructure many international governments do not mandate, making aircraft frequently untrackable through the methods used for US data

### Outcome

The budget increase was not approved. However, the client subsequently discontinued international dataset submissions and returned to US-sourced audio — effectively resolving the complications the analysis had outlined. The document achieved its practical goal, if not its stated one.

*Full analysis available on request.*

---

*References available on request.*
