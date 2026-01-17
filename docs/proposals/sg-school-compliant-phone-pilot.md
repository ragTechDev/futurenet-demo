# Proposal: Singapore school-compliant smartphone (Android, bundled hardware) — Pilot v1

## 1) Summary

Singapore has introduced restrictions on smartphone use in secondary schools. This creates a clear niche for a **school-compliant phone** that:

- Preserves **reachability and safety** (calls/SOS)
- Avoids the **distraction + internet** surface area that triggers bans
- Gives schools a **verifiable compliance** mechanism

This proposal describes a [WisePhone](../research/market-research/us-wisephone.md)-like strategy that is **software-led** (launcher + management policy) while shipping **bundled Android hardware**, using **Android Enterprise Device Owner** management and **Zero-touch enrollment**.

**Key v1 constraints (intentional)**

- **No browser in v1**
- **No WhatsApp in v1**
- Bundled hardware (we procure and ship)
- **Parent-owned devices** (DTC purchase; schools do not manage rosters/devices)
- We are willing to **operate an MDM**

---

## 2) Goals and non-goals

### Goals

- Ship a pilotable, enforceable **school-compliant phone** within a short timeline.
- Provide a clear **value proposition** to parents and schools:
  - Parents: “reachable and safe without internet distractions.”
  - Schools: “students can have a phone that is verifiably compliant with school rules.”
- Validate demand, retention, and support burden before expanding capability.

### Non-goals (v1)

- Building a custom Android OS fork.
- Supporting WhatsApp or open internet access.
- Solving every edge-case of on-campus enforcement via geofence in v1.

---

## 3) Target users and use cases

### Primary target

- **Secondary school students (13–16)** and their parents in Singapore.

### Core use cases

- Child can call parents/caregivers before/after school.
- Emergency reachability (999/995 + guardians) at all times.
- During school hours: phone is in **School Mode** (emergency-only + essential comms).
- Optional: an educator can grant a short, auditable exception to School Mode when required for class activities.

---

## 4) Product concept (WisePhone-like)

### Product name (working)

- **FutureNet Phone (v1)**

### What it is

- A bundled Android smartphone with:
  - A **custom launcher** (tool-first experience)
  - A **locked-down device policy** (Device Owner)
  - A **School Mode** schedule
  - **SOS** and emergency-only fallback

### What it is not

- Not a “fully open smartphone”
- Not a children’s app ecosystem

---

## 5) System architecture

### Components

- **Device (Android phone)**
  - Custom launcher app (our UX)
  - Optional device agent app (only if MDM cannot express some policies/scheduling)
  - SOS experience (can be part of launcher or a separate app)

- **MDM** (3rd party, operated by us)
  - Android Enterprise Fully Managed (Device Owner)
  - Managed Google Play allowlist
  - Policy configuration + compliance reporting

- **Backend services (ours)**
  - Identity + accounts (parents)
  - Device registration (pairing codes)
  - Policy assignment metadata (school templates, schedules)
  - Compliance card signing + school verifier endpoint

- **Parent portal (ours)**
  - Pair device
  - Manage guardian contacts
  - View compliance status
  - Request changes (future)

- **School verifier (ours)**
  - Scan/enter device ID → verify compliance

---

## 6) Enrollment model (critical)

### Required: Android Enterprise Device Owner

To be bypass-resistant, devices must be enrolled as **Device Owner**.

### Preferred: Zero-touch enrollment (ZTE)

- Devices are purchased through a reseller supporting **Android Zero-touch enrollment**.
- At first boot (or after factory reset), devices automatically:
  - enroll into our enterprise
  - install required apps
  - apply policy

**Outcome:** factory reset does not “escape” management; the device re-enrolls.

### Early pilot fallback

- QR-code provisioning can work for first 10–20 devices, but we should move to ZTE quickly.

---

## 7) Policy design (v1)

### Always-on restrictions (24/7)

- **No browser**
  - Chrome not installed/allowed
  - No alternate browsers allowed
- **No social / no games** (package allowlist model)
- **No app installs**
  - Managed Play only; only approved apps
- **Integrity / bypass controls**
  - Disable unknown sources
  - Disable developer options + USB debugging
  - Disable VPN (or only allow approved)
  - Disable hotspot/tethering
  - Restrict adding accounts (no personal Google accounts)

### School Mode (scheduled)

During school hours:

- Allow only:
  - Phone (dialer)
  - Contacts (restricted)
  - SOS
  - (Optional) SMS only to guardian allowlist
- Suspend/hide everything else.

**Implementation choices:**

- Prefer MDM-native scheduling/profile assignment.
- If MDM scheduling is limited, implement a small device agent to apply schedule (app suspension) based on server policy.

### Optional educator override (recommended shape)

For parent-owned devices, a full educator portal that manages student devices is operationally heavy (rosters, mapping, identity, support). Instead, offer a lightweight educator override that provides **time-limited, auditable exceptions**.

#### Option: time-limited educator unlock token

- A teacher can generate a **one-time unlock token** (e.g., 6–8 digits) that temporarily relaxes School Mode for a short window (e.g., 5–10 minutes).
- The student enters the token on the phone (from the launcher) to activate the temporary exception.
- The device automatically returns to School Mode when the timer ends.

Guardrails:

- Tokens are time-bound and expire quickly.
- Token usage is logged (timestamp, duration, school identifier).
- Parents can opt-in/opt-out of educator override per device.

Engineering notes:

- This requires a small service that issues tokens and validates them (could be our backend), plus a device-side UI to enter and apply the unlock.
- If the MDM supports policy switching via API per device, the unlock can trigger a temporary profile switch; otherwise, a device agent can implement the temporary relaxation locally.

---

## 8) Allowed app list (v1 recommendation)

Keep v1 minimal:

- Dialer (system)
- Contacts (system)
- SMS (system) (optional)
- Our launcher app
- SOS experience (ours)
- Device settings (restricted)
- [150+ apps hand-picked and approved for SageOS](https://www.sagemobile.com/approved-apps)
- Singapore-related apps (e.g., MyInfo, eServices, SingPass)
- School apps (e.g., Canvas, Google Classroom)
- (Optional) Selected apps possibly required for research for homework - selected news app, dictionary, encyclopedia etc.

Avoid:

- Browsers
- Email
- Social
- News
- App stores

---

## 9) SOS and emergency-only specification

### Emergency numbers

- Always allow:
  - 999 / 995
  - Guardian allowlist numbers

### SOS flow

- Long-press SOS (3 seconds):
  - calls guardian 1 → guardian 2 → (optional) emergency escalation
  - sends location snapshot by SMS (optional; depends on policy)

### Anti-misuse

- Require long-press + confirmation tone
- Log SOS events (timestamp only in v1; location only if enabled)

---

## 10) School compliance package

Schools need a simple way to verify compliance.

### On-device “Compliance Card” screen

- Managed status (Device Owner)
- Policy name + version (e.g., `SG-SCHOOL-V1`)
- Last policy sync/check-in
- QR code containing a signed token:
  - device ID
  - policy version
  - timestamp

### School verifier web page

- Scan QR / enter ID → returns:
  - compliant / non-compliant
  - last check-in
  - assigned school template

### One-page policy sheet (for administrators)

- What is blocked
- What is allowed
- School Mode hours and behavior
- What happens on tamper/reset

---

## 11) Provisioning + fulfillment workflow (bundled hardware)

### Procurement

- Select 1 device model for v1 (add second model later).
- Purchase through a reseller that supports ZTE.
- Devices are **SIM-unlocked**: parents can insert any SIM (Singtel/StarHub/M1/MVNO) and are not required to buy a telco plan from us.

### Staging workflow

1. Receive devices
2. Record serial/IMEI → internal device ID
3. First boot check:
   - auto-enrolls via ZTE
   - launcher appears
   - compliance card shows policy
4. Box with quickstart + pairing instructions

### Parent onboarding

- Parent creates account → enters pairing code → configures guardian contacts + schedule template.

---

## 12) Finance: costs, revenue, and pricing plan (v1)

This section provides an initial unit economics model for a bundled-hardware, SIM-unlocked device.

### Cost drivers (what we pay)

- **Hardware COGS**
  - phone wholesale price (varies by model and volume, Samsung A07 is ~$128.00, OPPO A3x is ~$105.00)
  - accessories: case + screen protector + packaging
- **MDM licensing**
  - per-device/per-month cost for Device Owner management
- **Cloud + ops**
  - backend hosting, SMS provider (if SOS/location SMS), observability
- **Logistics**
  - inbound device shipping, last-mile delivery, returns handling
- **Support + warranty**
  - helpdesk time, replacements, repair pipeline
- **Payment + platform fees**
  - payment processing, fraud/chargebacks

### Revenue model

- **Upfront device sale** (covers hardware and part of onboarding/provisioning)
- **Monthly subscription** (covers MDM licensing + ongoing service + support)

### Proposed pricing plan (initial)

Offer 2 simple options to start:

#### Plan A: Standard

- **Device**: S$299–S$399 one-time (model-dependent) (For comparison, Wise Phone is USD $399)
- **Subscription**: S$8–S$15 / month

Includes:

- device management + compliance verifier
- School Mode scheduling
- SOS features
- basic parent portal

#### Plan B: Annual (discounted)

- **Device**: same as above
- **Subscription**: S$80–S$150 / year

### Pilot discounts (recommended)

- Offer pilot families a reduced subscription (e.g., first 3 months at S$0–S$5/month) in exchange for structured feedback and surveys.
- Offer phone trade-ins (Account for trend that parents tend to give their kids their old smartphones when they change their own)

### Unit economics checklist (to fill with real numbers)

- Hardware COGS (phone + accessories + packaging)
- MDM cost per device/month
- Avg support minutes per device/month
- Shipping + returns cost per unit
- Expected replacement rate during pilot

Decision: set target gross margin for:

- **Device** (low margin acceptable early)
- **Subscription** (should be high margin to sustain support + growth)

---

## 13) Pilot plan (timeline)

### Phase A: internal dogfood (2 weeks)

- 5–10 devices
- Validate:
  - ZTE enrollment
  - policy enforcement
  - reboot/reset behavior
  - school mode schedule reliability

### Phase B: closed pilot (6–8 weeks)

- 30–100 families
- 1–2 partner schools
- Weekly iteration focused on reliability + support volume.

### Success metrics

- >95% devices remain compliant (managed + policy applied)
- >98% school-days: School Mode activates as expected
- Support load: <0.3 tickets/device/week by week 3
- Parent report: reduced conflict/monitoring time

---

## 13) Engineering plan (deliverables)

### Required deliverables

- Launcher app (Android)
  - home UX
  - compliance card screen
  - SOS entry
- Backend
  - device pairing + assignment
  - signed compliance tokens
  - school verifier endpoint
- Parent portal
  - pairing + guardian allowlist + schedule template
- MDM configuration
  - enrollment + managed play allowlist + policies

### Optional (only if needed)

- Device agent app to implement schedule-based app suspension if MDM scheduling is insufficient.

---

## 14) Risks and mitigations

### Risk: bypass via factory reset

- **Mitigation**: ZTE ensures re-enrollment.

### Risk: hidden browser surfaces inside allowed apps

- **Mitigation**: keep v1 allowlist extremely small; avoid apps that embed webviews.

### Risk: support burden

- **Mitigation**: start with 1 device model; strict v1 scope; strong staging QA.

### Risk: school policy variability

- **Mitigation**: school templates + verifier; pilot with 1–2 schools first.

### Risk: privacy concerns (especially location)

- **Mitigation**: location only for SOS in v1, with minimal retention.

---

## 15) Decision points (team alignment)

### Product decisions

- Target age for v1: secondary (13–16) only, or include upper primary (10–12)?
- SMS allowed in school mode, or calls-only?
- Location policy: SOS-only (recommended) vs continuous tracking.

### Technology decisions

- Which MDM: Intune vs Workspace ONE vs other.
- MDM scheduling capability: do we need a device agent?
- Device model selection (Samsung A-series vs Pixel A-series).

### Operations decisions

- Reseller selection (must support ZTE).
- Warranty/repair process and replacement policy for the pilot.
- Support channels and SLA expectations.

### School partnership decisions

- What does “only allowable phone” mean in practice:
  - recommended device vs required device
  - how verification is enforced

---

## 16) Open questions

- Which specific school policy requirements apply (by school level) and what exceptions are needed (CCA, excursions)?
- Are there regulatory/compliance constraints for selling managed devices to minors in SG (data retention, consent flows)?

---

## 17) Next steps

1. Decide MDM + device model + reseller (ZTE).
2. Build launcher + compliance card prototype.
3. Configure MDM policy and test bypass attempts.
4. Recruit 1–2 schools for a controlled pilot.
5. Run Phase A dogfood → Phase B pilot.
