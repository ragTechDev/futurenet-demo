# Interview Notes – E03

## Participant Info
| Field | Notes |
|-------|--------|
| Stakeholder type | Expert (Cloudflare Web Filter Sales) |
| Age group | Adult / Account Executive |
| Location | Queensland, Australia |
| Interview date | 9th Jan 2026 |
| Interviewer | Saloni, Sugirdha, Aishwarya |
| Consent status | Recording allowed: TBD |

---

## Key Discussion Points
### Overview / Current Context
- Account executive at Cloudflare working across financial services, critical infrastructure, and schools
- Schools are the most excited industry about Cloudflare products
- Works with K-12 schools (Kindergarten to high school)
- Currently has 2 schools adopted (mentioned as being in New Zealand)
- Only private schools using it so far; government schools need whole fleet deployment
- Has 3-year-old and 6-month-old children
- Practices intentional parenting around screen time and digital devices
- Talks extensively with other parents about cybersecurity and smart devices

### Pain Points / Frustrations
- **MDM bypass issues**: Sugirdha shared students in Singapore can bypass/disable MDM systems on school devices
- **Network-only filtering limitations**: Traditional filters only work on school network, not at home
- **VPN bypass**: Traditional firewalls (like Palo Alto) can be bypassed by VPNs
- **Personal device gap**: Students' personal devices don't have web filters
- **Parental tech literacy**: Parents who are not tech savvy just rely on school devices
- **Device management complexity**: Schools have existing setups with physical networks and routers
- **Divided school approaches**: Some schools only care about filtering on school network, others want comprehensive protection
- **Parenting reality vs ideal**: Ideal screen time is 1 hour, reality is 2-3 hours when both parents working
- **Phone attention guilt**: 3-year-old says "Daddy put phone in pocket" when parent is distracted

### Current Cloudflare Web Filter Capabilities
- **Device-level deployment**: Agent installed on device itself, not just network layer
- **Works everywhere**: Filtering that works both on and off school premises, regardless of network
- **Cannot be bypassed**: VPN-proof filtering that students cannot disable
- **Remote management**: Admin can toggle settings remotely without physical access
- **Default rulesets**: 95% effective with default Cloudflare ruleset for small IT teams
- **Granular customization**: Ability to add custom rules for specific needs (e.g., Wikipedia pages)
- **Color-coded categorization**: Green (safe), Red (blocked), Yellow (uncategorized - requires approval)
- **User-friendly logs**: Made for non-techies to understand (school administrators)
- **Remote browser isolation**: Malicious content opens in remote environment, not directly on device
- **Comprehensive logging**: All student activity logged with timestamps, domains, IP addresses
- **Low stimulating content**: For young children, prefers Studio Ghibli over high-stimulation shows
- **Co-viewing**: Parent and child watching together, talking about content
- **GPS tracking**: Wants tracking device separate from smartphone for kids

### Safety & Trust Requirements
- **UK act compliance**: Cloudflare follows UK act to hinder access to certain activities
- **Cannot be altered**: Cloud-based product that cannot be digitally altered or removed without admin access
- **Constant device checking**: Agent constantly checks device structure
- **IT admin approval**: Yellow/uncategorized sites require manual vetting before student access
- **Incident event management**: Integration with tools like Splunk for log analysis
- **Pastoral care alignment**: Christian schools use it for religious content filtering
- **Protection from external threats**: Schools get hit with phishing attacks
- **Protection from internal threats**: Malicious websites accessed by students
- **No smart devices for young kids**: Haven't incorporated smart devices for 3-year-old and 6-month-old
- **No doomscrolling**: Agreed early on not to doomscroll in front of kids
- **Active monitoring**: Try to monitor what child is watching, rarely alone

### Opportunities / Ideas
- **Complement to MDM**: Cloudflare as extra security layer on top of existing school systems
- **DNS filtering for personal devices**: When connected to school network
- **Free base version**: Parents can use Cloudflare base version for free at home
- **Sweeper management**: Comprehensive default filtering with granularity for custom rules
- **SASE integration**: Secure Access Service Edge that ingests logs and provides simpler logs for schools
- **Nokia phone + GPS tracker**: Alternative to smartphone for kids taking bus
- **Situation-based device access**: Not about age but about situation (picking up vs taking bus)
- **Delayed smartphone access**: 14-15 years old for smartphone
- **No social media under 16**: Aligns with Australian legislation
- **Resistance leads to improvement**: Parents report massive improvement when social media removed
- **Colleague tracking**: Teenage daughters tracked by parents who know where they are
- **Varied approaches in social circle**: Acknowledges diversity in parenting approaches

---

## Direct Quotes
> "Schools are probably the one industry that is most excited about specific Cloudflare products"

> "Every time it concerns kids, everyone understands the risks"

> "Never had to convince schools of the threats and risks"

> "We don't want them to look up things they are not supposed to" (Christian schools)

> "We do this because we care about this" (on device management)

> "Doesn't matter what network they are on, they cannot access certain websites"

> "VPN cannot bypass Cloudflare"

> "There may be some companies that can somehow remove the WARP client, but it's not easy"

> "School nightmare is self-harm content"

> "Daddy put phone in pocket" (3-year-old to parent)

> "His attention is taken away by this device" (child's mindset)

> "The doomscroll conversation happened early on"

> "At first they would resist it, but then there has been a massive improvement since then"


---

## Technical Details
### Cloudflare Architecture
- **380 datacenters** in over 100 countries
- **Anycast network**: Every single datacenter is connected
- **Three main buckets**: CDN (Application Security), Network Connectivity & Security, Protecting Users (Internal Security)
- **WARP agent**: Freely available to download, installed on every device
- **Sweeper management rule set**: Default comprehensive filtering with granular customization
- **Remote Browser Isolation**: Malicious content opens in remote environment, Cloudflare projects to user
- **Cloud-based deployment**: On device itself, not just network layer

### Deployment Models
- **Best scenario**: WARP agent installed on device (works everywhere)
- **DNS filtering**: Implemented in school network itself (only works on school premises)
- **Network layer**: For personal devices connected to school network
- **Device layer**: For school-issued managed devices

### Competitors
- **Palo Alto Global Protect**: Can be bypassed by VPN, not user-friendly for schools, no own datacenters
- **Traditional MDM**: Can be bypassed/disabled by students, network-layer only

---

## Potential Themes Tags
`#web-filtering` `#school-safety` `#device-management` `#vpn-bypass-prevention` `#remote-management` `#content-categorization` `#logging-monitoring` `#christian-schools` `#managed-devices` `#dns-filtering` `#mdm-complement` `#parental-controls` `#screen-time` `#co-viewing` `#doomscrolling` `#smartphone-delay` `#gps-tracking` `#social-media-ban` `#australian-legislation` `#intentional-parenting`

---
