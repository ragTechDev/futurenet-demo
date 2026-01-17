# Interview Transcript – E03

## Participant Info
| Field | Notes |
|-------|--------|
| Stakeholder type | Expert (Cloudflare Web Filter Sales) |
| Age group | Adult / Account Executive |
| Location | Queensland, Australia |
| Interview date | 9th Jan 2026 |
| Interviewer | Saloni , Sugirdha, Aishwarya |
| Consent status | Recording allowed: TBD |

# Role and Background
- Account executive at Cloudflare in Queensland — focused on sales
- Looks after customers who have already bought Cloudflare and brings in new customers
- Not industry-specific — works across financial services, critical infrastructure, and schools
- Has inherited school clients (Kindergarten to high school/12th grade)
- Schools are probably the one industry that is most excited about specific Cloudflare products

# Cloudflare Overview
Cloudflare calls itself the "connectivity cloud" — it's the connectivity tissue between:
- Apps and on-prem services
- Users
- Domains
- Physical sites (like shopping centres)

What Cloudflare does is connect all these different elements in a fast and secure way.

## Three Main Buckets:
1. **CDN (Application Security)**
   - Over 100 countries, 380 datacenters around the world
   - **Key difference**: Anycast network — every single datacenter is connected
   - Everything you're accessing is close to the endpoint (datacenters)
   - Ensures content is delivered from the nearest location to the user

2. **Network Connectivity and Security**
   - Firewall service
   - SDN (Software-Defined Networking) as a service
   - DDoS mitigation as a service
   - This is the bucket schools are most interested in

3. **Protecting Users (Internal Security)**
   - Protecting how users access critical information
   - Protecting the device
   - Zero Trust architecture
   - AI (NEW offering)

# Web Filter for Schools

## Why Schools Need It
- Students with devices can connect to school WiFi and access anything on the internet
- Can be helpful: student resources, educational content
- Some schools are using Minecraft and Roblox as learning blocks (part of curriculum)
- But students could also access things parents don't want them to see:
  - Racism
  - Sexual content
  - Hate speech
  - Gambling
  - Self-harm content (school nightmare scenario)

## How Cloudflare Web Filter Works
- Install an agent on every device called **WARP** (freely available to download)
- With the agent on the device, it follows the school policies
- Cloudflare follows the UK act which ensures it hinders access to certain activities
- **Sweeper management rule set**: Default comprehensive filtering
  - Has granularity to add custom rules
  - If sweeper doesn't cover certain sites (e.g., specific Wikipedia pages), schools can add their own rules
- IT staff (security administrator) manages the policies
- Relatively small IT teams in schools — 95% effective can just use the default ruleset by Cloudflare
- Not sure about the experience/qualification requirements for IT administrators

## Current Adoption
- At the moment only private schools are using it; government schools need the whole fleet
- Sales rep does have to teach the schools what threats/risks are
- **2 schools have adopted it so far** (mentioned as being in New Zealand in other notes)
- Others are in the pipeline

### School Examples:
**Rockhampton School** (not in main city):
- They said as long as it's not on the school network, they don't care
- Only concerned about filtering on school premises

**Other Schools**:
- Feel more responsible to do more than just school network filtering
- Want to protect students beyond school hours
- School nightmare is self-harm content

## Network Coverage
- **Schools are divided** between two approaches:
  1. Only filtering on school network
  2. Filtering on both school devices and school network (more comprehensive)
- Traditional filtering wouldn't be effective if students use another network (e.g., home WiFi, mobile data)
- Other web filters only work on school network but at home they don't work — Cloudflare solves this
- **Cloudflare works both on and off school premises** — doesn't matter what network students are on, they cannot access certain websites
- This is because the agent is deployed on the device itself, not just the network layer

## Bypass Prevention
- **VPN cannot bypass Cloudflare** (unlike traditional firewalls like Palo Alto)
- Schools have Palo Alto firewalls but VPN can bypass them — doesn't work with Cloudflare
- Agent constantly checks the device structure
- **Agent cannot be turned off by students**
- Only admin can remotely toggle the agent on/off
- Happens remotely — no need to physically access the device
- Cloudflare is a cloud-based product deployed on the device and cannot be digitally altered or removed unless given access (usually only IT admin has this access)
- Note: There may be some companies that can somehow remove the WARP client, but it's not easy

# School Adoption Insights

## Why Schools Adopt Easily
- **Never had to convince schools** — every time it concerns kids, everyone understands the risks
- There is never a question about various threats
- **External threats**: Schools get hit with phishing attacks
- **Internal threats**: Malicious websites accessed by students
- **Christian schools (private schools)**: 
  - Pastoral care concerns
  - Religious elements — "We don't want them to look up things they are not supposed to"
  - Content filtering aligns with religious values

### Comparison to Corporate Security:
- In companies: Security teams care about sensitive business data being leaked
- In schools: Focus is entirely on protecting children from harmful content

# Device Management: School vs Personal Devices

## Australia Context
- Australia is moving to **managed devices** or **1-to-1 devices** in schools
- Used to be a hybrid scenario (mix of school and personal devices)
- Now going towards managed devices, at least for private schools
- Students still have their 2nd devices (personal devices) which don't have the web filter

## DNS Filtering for Personal Devices
- Students connect to the school network and there is a network layer filter
- Personal devices can use DNS filtering if connected to school network
- **Best scenario**: Having the WARP agent installed on the device itself (works everywhere)
- **DNS filtering** is implemented in the school network itself (only works on school premises)
- VPN on personal devices doesn't have Cloudflare but may have DNS filtering
- But at home, the personal device is out of the school's reach
- Up to parents to manage
- **Could students access malicious websites from their own device? Yes, they can** (if no agent installed)
- Parents can use other tools — Cloudflare base version is free
- If parents are not tech savvy, they just rely on school device

## Singapore Context
- In Singapore, there is an MDM (Mobile Device Management) system - from @sugirdha
- The MDM is supposed to work on the device all the time and run continuously
- But students are able to bypass/disable it on their devices
- **Cloudflare's perspective on MDM bypass**:
  - Not sure exactly how students can disable it — could be the way it was deployed
  - Schools already have their setups with physical networks, routers, and services
  - Schools are using Cloudflare as an extra security layer
  - The reason schools went with Cloudflare is the deployment method
  - Cloudflare is deployed at the network layer (for DNS filtering) or on the device (WARP agent)
  - If MDM is only deployed at network layer, students using private networks can bypass it
- **Cloudflare is a complement to MDM** — not a device management solution itself
- Device management is not handled by Cloudflare — "We do this because we care about this"

## Bypass Attempts
- Someone at a company was able to bypass, but the policy is that they cannot connect to internet without WARP
- This shows that while bypass attempts may occur, the policy enforcement prevents actual internet access without the agent

# Competitors

## Palo Alto Global Protect
- Competes in the same space as Cloudflare
- Works in reverse: Once turned off, it's very restricted and can only access certain networks
- **Looked over by schools** — not user-friendly for schools
- They don't have their own datacenter compared to Cloudflare
- Can be bypassed by VPN (unlike Cloudflare)
- One device accessing Cloudflare vs one accessing Palo Alto — different security models

# Content Filtering System

## How Cloudflare Categorizes Websites
**If the filter doesn't pick something up**, websites are coded by color:
- **Green list (Whitelists)**: Safe websites that are allowed
- **Red lists**: Websites they want to block/call out
- **Yellow (Uncategorized)**: Websites that are unsure because they haven't been categorized yet
  - Up to the school or IT team to set up policy for how to approach yellow sites
  - Can have a policy: "There is a request to access this website"
  - The student won't be able to access it until IT admin vets it
  - Requires manual approval from IT administrator

## Threat Protection
### Remote Browser Isolation
- If something is malicious, it would open in a **remote environment**
- There would be a gap between the user and the actual malicious content
- What you're actually interacting with is Cloudflare projecting the content to you
- The actual interaction goes to the datacenter, not directly to the malicious site
- **Ransomware**: Cloudflare has a protection screen that protects the user

### Logging and Monitoring
- **All activity of students are individually logged** and flagged as risk or not
- Logs include: timestamps, domains, IP addresses, things that don't make sense
- All websites accessed by students are logged and can be called out

### Incident Event Management
- **Incident event management tools** (e.g., Splunk) analyze the logs
- If you are a system administrator, you would be looking at these logs
- Logs made for schools in a user-friendly way (non-techies are looking at this)
- **SASE (Secure Access Service Edge)** ingests the logs and provides simpler logs for schools

# Personal Perspective as a Parent

## Family Context
- Has a 3-year-old and 6-month-old
- Talks a lot about this with other parents
- Discusses not just cybersecurity but also smart devices

## Current Screen Time Practices
- **Haven't incorporated smart devices** for the kids yet
- **One-off exception**: Had to take a 15-minute flight
  - 3-year-old was really unhappy
  - Put on a low stimulating video to watch
  - She was not interacting with it, just watching
- **No screens for the 6-month-old**
- **Any screen time is usually TV** (not tablets or phones)
- Even then, it's low stimulating shows
- **Time limit**: 1 hour max per day (ideal)
- **Reality**: Working 5 days a week (dad) and 1 day a week (mom), it moves to 2-3 hours which is not ideal
- When childcare or stranger babysits, they let them watch Studio Ghibli
- **They talk about what they are watching all the time** — active co-viewing
- **Child is rarely alone watching**: "He's not watching, just doing backflips. He has paused in front of the screen."
- Try to monitor what he's watching
- Child won't be by himself — runs off to find parents
- If watching for longer periods of time, it's with parents
- While working, child will come sit next to him, and he'll put on Studio Ghibli or trucks
- Child won't do it by himself — needs parent presence

## Parental Digital Habits
- **The doomscroll conversation happened early on**
- They agreed early not to doomscroll in front of the kids
- **"Daddy put phone in pocket"** — something the 3-year-old says when he's on LinkedIn/texting
- Child's mindset: "His attention is taken away by this device"
- It gives a reminder to the parent to put the phone away
- He feels the guilt when the child says this

## Future Device Plans
- **Spoke about it a couple days ago** (husband/wife conversation)
- **Pretty much the phones they're giving out won't be a smartphone**
- **It's not about the age but rather about the situation**:
  - If parents are picking up from school → don't see the need for a device
  - If kids are taking the bus → yes, need a device but not a smartphone
  - Maybe a Nokia phone
- **When they are 14 or 15** → yes, can have a smartphone
- **But no social media under 16** (referring to Australian legislation banning social media for under 16)
- **Resistance and improvement**: "At first they would resist it, but then there has been a massive improvement since then"
- He heard from parents saying when social media is taken away — there is so much improvement in behavior

## Alternative Solutions
- **Spoke about getting a tracker** — some sort of GPS tracking device
- Colleague has teenage daughters and they basically know where they are (using tracking)
- **Current plan**: Suitable phone for kids (Nokia) + tracking device
- At the moment, these devices usually don't have a tracker installed, so need separate GPS tracker
- **Nokia phone + GPS tracker** as an alternative to smartphone

# Additional Questions

## Social Norms Around Device Usage
**Question:** What do you see around you? Is this the norm around you?
- "So I have said a lot, it's varied."
- [Response indicates diversity in approaches among his social circle]
