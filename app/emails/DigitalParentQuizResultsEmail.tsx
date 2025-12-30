import { Html, Head, Preview, Body, Container, Section, Text, Heading, Hr, Img, Link } from "@react-email/components";
import { PHONE_IMAGE_URLS, PERSONAS } from "../digital-parent-quiz/quizPersonas";

export type PersonaId =
  | "bb-bold"
  | "htc-desire"
  | "palm-treo"
  | "razr"
  | "walkman"
  | "nokia-3310"
  | "nokia-e71"
  | "bb-curve";

export type DigitalParentQuizResultsPayload = {
  submittedAt: string;
  participantId: string;
  email: string;
  quizVersion?: string | null;
  questionSetHash?: string | null;
  answers: Array<{
    questionId: string;
    optionId: string;
    chapter: string;
    prompt: string;
    selectedLabel: string;
  }>;
  scores: Record<PersonaId, number>;
  topPersonaId: PersonaId;
  respondent?: {
    type?: "parent" | "expecting" | "considering" | "na" | null;
    researchOptIn?: boolean;
    birthYear?: number | null;
    gender?: "m" | "w" | "na" | null;
    kidsAges?: string[] | null;
  } | null;
};

export type DigitalParentQuizResultsEmailProps = {
  topPersona: {
    id: PersonaId;
    phoneModel: string;
    characterName: string;
    tagline: string;
    summary: string;
    strengths: string[];
    watchOutFor: string[];
    nextQuest: string[];
  };
  allPersonas: Array<{
    id: PersonaId;
    phoneModel: string;
    characterName: string;
    tagline: string;
    summary: string;
  }>;
  payload: DigitalParentQuizResultsPayload;
  baseUrl: string;
  quizUrl: string;
  unsubscribeTo?: string;
};

const base = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "#1a1a1a",
  lineHeight: "1.6",
};

const highlight = {
  background: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.18) 10%, rgba(0, 0, 0, 0.18) 90%, rgba(0, 0, 0, 0) 100%)",
  padding: "2px 6px",
  borderRadius: "6px",
};

// Default props for email preview
const defaultProps: DigitalParentQuizResultsEmailProps = {
  topPersona: {
    id: "bb-bold",
    phoneModel: "BlackBerry Bold 9900",
    characterName: "The Executive",
    tagline: "Always connected, always in control",
    summary: "You're the type who needs to stay on top of everything. You're calm under pressure and you want safety systems that are transparent, enforceable, and fair—so trust can grow over time.",
    strengths: [
      "Excellent at multitasking",
      "Great organizational skills",
      "Strong communication abilities",
      "Natural leadership qualities",
      "Efficient time management",
      "Problem-solving mindset",
    ],
    watchOutFor: [
      "Work-life balance can suffer",
      "May overwhelm family with structure",
      "Could miss spontaneous moments",
      "Tendency to over-schedule",
      "Risk of burnout",
      "May prioritize efficiency over connection",
    ],
    nextQuest: [
      "Schedule regular device-free family time",
      "Practice being present in conversations",
      "Let kids lead some activities",
      "Create space for unstructured play",
      "Model healthy tech boundaries",
      "Focus on quality over quantity time",
    ],
  },
  allPersonas: PERSONAS,
  payload: {
    submittedAt: "2025-12-26T14:00:00Z",
    participantId: "demo-participant-id",
    email: "parent@example.com",
    quizVersion: "dpq-2025-12-29",
    questionSetHash: "demo-hash",
    answers: [
      {
        questionId: "q1",
        optionId: "o1",
        chapter: "Morning Routine",
        prompt: "How do you start your day?",
        selectedLabel: "Check emails and messages immediately",
      },
    ],
    scores: {
      "bb-bold": 85,
      "nokia-3310": 45,
      "razr": 60,
      "htc-desire": 30,
      "palm-treo": 25,
      "walkman": 20,
      "nokia-e71": 70,
      "bb-curve": 55,
    },
    topPersonaId: "bb-bold",
    respondent: {
      type: "parent",
      researchOptIn: true,
      birthYear: 1990,
      gender: "na",
      kidsAges: ["3-5", "6-9"],
    },
  },
  baseUrl: "https://futurenet-demo..app/",
  quizUrl: "https://futurenet-demo..app/digital-parent-quiz",
  unsubscribeTo: "hello@ragtechdev.com",
};

export default function DigitalParentQuizResultsEmail(props: DigitalParentQuizResultsEmailProps) {
  const { 
    topPersona = defaultProps.topPersona, 
    allPersonas = defaultProps.allPersonas, 
    payload = defaultProps.payload, 
    baseUrl = defaultProps.baseUrl, 
    quizUrl = defaultProps.quizUrl,
    unsubscribeTo = defaultProps.unsubscribeTo,
  } = props;
  
  const unsubscribeSubject = encodeURIComponent("Unsubscribe request — Digital Parent Quiz");
  const unsubscribeBody = encodeURIComponent(
    [
      "Hi FutureNet,",
      "",
      "Please remove me from future research outreach emails.",
      "",
      `Participant ID: ${payload?.participantId ?? "unknown"}`,
      `Email: ${payload?.email ?? ""}`,
    ].join("\n")
  );
  const unsubscribeHref = unsubscribeTo
    ? `mailto:${unsubscribeTo}?subject=${unsubscribeSubject}&body=${unsubscribeBody}`
    : undefined;
  

  return (
    <Html>
      <Head />
      <Preview>Your Digital Parent Quiz results + full persona breakdown</Preview>
      <Body style={{ ...base, backgroundColor: "#f7f3ea", padding: "20px 12px", backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>

          {/* Main content container */}
          <Container style={{ backgroundColor: "#ffffff", border: "3px solid rgba(26, 26, 26, 0.65)", borderRadius: "0", padding: "32px 24px", position: "relative", zIndex: "1" }}>
            {/* Thank You Note */}
            <Section style={{ textAlign: "center", padding: "24px", backgroundColor: "rgba(247, 243, 234, 0.7)", borderRadius: "12px", marginBottom: "32px", border: "2px solid rgba(26, 26, 26, 0.1)" }}>
              <Text style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 16px", color: "#1a1a1a" }}>
                Thank you for joining our research! 🙏
              </Text>
              <Text style={{ fontSize: "14px", lineHeight: "1.6", margin: "0 0 16px", color: "#4a4a4a" }}>
                By taking this quiz, you&apos;ve contributed to crucial research on the digital landscape of children, adolescents, and their parents here at <a href={baseUrl} target="_blank" style={{ 
                  backgroundColor: "#000000", 
                  color: "#ffffff", 
                  padding: "4px 8px", 
                  borderRadius: "0px", 
                  border: "2px solid #ffffff", 
                  textDecoration: "none", 
                  fontWeight: "700", 
                  fontSize: "12px", 
                  letterSpacing: "1px", 
                  textTransform: "uppercase",
                  fontFamily: "'Verdana', sans-serif",
                  display: "inline-block",
                  margin: "0 2px"
                }}><strong>FutureNet</strong></a>. We&apos;re a group of technologists who are also parents, working together to give our kids a chance to grow up with the same freedom, creativity, and authentic connections we experienced in our own childhoods.
              </Text>
              <Text style={{ fontSize: "14px", lineHeight: "1.6", margin: "0", color: "#4a4a4a" }}>
                Every response helps us understand how parenting styles have evolved with technology, and how we can build a better digital future for the next generation.
              </Text>
            </Section>

            {/* Hero section */}
            <Section style={{ textAlign: "center", marginBottom: "32px" }}>
              <Heading style={{ margin: "0 0 8px", fontSize: "32px", fontWeight: "600", letterSpacing: "0.02em", lineHeight: "1.02" }}>
                We Guessed Your Phone! 📱
              </Heading>
              <Text style={{ fontSize: "16px", margin: "0 0 24px", color: "#666", fontStyle: "italic" }}>
                Based on your digital parenting style, here&apos;s the phone we think you had...
              </Text>
              <div style={{ ...highlight, display: "inline-block", marginBottom: "16px" }}>
                <Text style={{ margin: "0", fontSize: "20px", fontWeight: "600" }}>
                  You&apos;re a <strong>{topPersona.characterName}</strong>
                </Text>
              </div>
              <Text style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "600", color: "rgba(26, 26, 26, 0.8)" }}>
                {topPersona.tagline}
              </Text>
              {/* Nostalgic Phone Display - Front and Center */}
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <table style={{ margin: "0 auto", border: "3px solid rgba(26, 26, 26, 0.4)", borderRadius: "16px", backgroundColor: "#ffffff", padding: "32px" }}>
                  <tr>
                    <td style={{ textAlign: "center", padding: "0" }}>
                      <Img src={PHONE_IMAGE_URLS[topPersona.id]} alt={topPersona.phoneModel} width={120} height={120} style={{ objectFit: "contain", marginBottom: "16px", display: "block", margin: "0 auto 16px auto" }} />
                      <Text style={{ margin: "0", fontSize: "18px", fontWeight: "700", color: "#1a1a1a", textAlign: "center", display: "block" }}>
                        {topPersona.phoneModel}
                      </Text>
                      <Text style={{ margin: "8px 0 0", fontSize: "14px", color: "#666", textAlign: "center", fontStyle: "italic", display: "block" }}>
                        Remember this beauty? 📱✨
                      </Text>
                    </td>
                  </tr>
                </table>
              </div>
            </Section>

            {/* Detailed persona writeup */}
            <Section style={{ marginBottom: "32px", padding: "24px", backgroundColor: "#f7f3ea", border: "2px solid rgba(26, 26, 26, 0.2)" }}>
              <Heading as="h2" style={{ margin: "0 0 16px", fontSize: "22px", fontWeight: "600" }}>
                Your Digital Parenting Profile
              </Heading>
              <Text style={{ margin: "0 0 16px", fontSize: "16px", lineHeight: "1.6" }}>
                {topPersona.summary}
              </Text>
              <Text style={{ margin: "0 0 16px", fontSize: "16px", lineHeight: "1.6" }}>
                As <strong>{topPersona.characterName}</strong>, you represent a unique approach to digital parenting that balances technology use with family values. Your {topPersona.phoneModel} choice reflects your personality - practical yet forward-thinking, reliable yet adaptable to new challenges.
              </Text>
              <Text style={{ margin: "0", fontSize: "16px", lineHeight: "1.6", fontStyle: "italic" }}>
                You&apos;re the family&apos;s creative catalyst—you see tech as a tool for connection, expression, and learning together. You&apos;re practical and technical: you&apos;ll allow tech, but only in staged tiers with strong defaults and a rollback plan.
              </Text>
            </Section>

            {/* Strengths section */}
            <Section style={{ marginBottom: "24px" }}>
              <Heading as="h3" style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "600", color: "#2d5a27" }}>
                🌟 Your Superpowers
              </Heading>
              <div style={{ display: "grid", gap: "8px" }}>
                {topPersona.strengths.slice(0, 6).map((strength) => (
                  <Text key={strength} style={{ margin: "0", fontSize: "15px", padding: "8px 12px", backgroundColor: "rgba(45, 90, 39, 0.1)", border: "1px solid rgba(45, 90, 39, 0.2)", borderRadius: "4px" }}>
                    ✓ {strength}
                  </Text>
                ))}
              </div>
            </Section>

            {/* Watch-outs section */}
            <Section style={{ marginBottom: "24px" }}>
              <Heading as="h3" style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "600", color: "#8b4513" }}>
                ⚠️ Growth Areas
              </Heading>
              <div style={{ display: "grid", gap: "8px" }}>
                {topPersona.watchOutFor.slice(0, 6).map((watchOut) => (
                  <Text key={watchOut} style={{ margin: "0", fontSize: "15px", padding: "8px 12px", backgroundColor: "rgba(139, 69, 19, 0.1)", border: "1px solid rgba(139, 69, 19, 0.2)", borderRadius: "4px" }}>
                    → {watchOut}
                  </Text>
                ))}
              </div>
            </Section>

            {/* Next quest section */}
            <Section style={{ marginBottom: "32px" }}>
              <Heading as="h3" style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "600", color: "#4a5568" }}>
                🎯 Your Next Quest
              </Heading>
              <div style={{ display: "grid", gap: "8px" }}>
                {topPersona.nextQuest.slice(0, 6).map((quest) => (
                  <Text key={quest} style={{ margin: "0", fontSize: "15px", padding: "8px 12px", backgroundColor: "rgba(74, 85, 104, 0.1)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "4px" }}>
                    🚀 {quest}
                  </Text>
                ))}
              </div>
            </Section>

            <Hr style={{ borderColor: "rgba(26, 26, 26, 0.2)", margin: "32px 0", borderWidth: "2px" }} />

            {/* Shareable Result Poster */}
            <Section style={{ marginBottom: "32px", textAlign: "center" }}>
              <Heading as="h2" style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: "600" }}>
                Share Your Results
              </Heading>
              <Text style={{ margin: "0 0 24px", fontSize: "16px", opacity: "0.8" }}>
                Got your digital parent type? Share it with friends and invite them to discover theirs!
              </Text>
              
              {/* Result Poster Card */}
              <div style={{ 
                textAlign: "center", 
                padding: "32px 24px", 
                borderRadius: "0px", 
                background: "#000000",
                border: "4px solid #ffffff",
                position: "relative",
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(rgba(255,0,255,0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px, 20px 20px, 60px 60px, 60px 60px",
                backgroundPosition: "0 0, 0 0, 10px 10px, 30px 30px"
              }}>
                {/* Header */}
                <Text style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: "400", color: "#ffffff", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>
                  FUTURENET / DIGITAL PARENT QUIZ
                </Text>
                
                {/* Phone Image */}
                <div style={{ margin: "16px 0", textAlign: "center" }}>
                  <table style={{ 
                    margin: "0 auto",
                    border: "2px solid #ffffff", 
                    borderRadius: "0px", 
                    backgroundColor: "#ffffff", 
                    padding: "16px", 
                    width: "120px",
                    height: "120px"
                  }}>
                    <tr>
                      <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0" }}>
                        <Img src={PHONE_IMAGE_URLS[topPersona.id]} alt={topPersona.phoneModel} width={88} height={88} style={{ objectFit: "contain", display: "block", margin: "0 auto" }} />
                      </td>
                    </tr>
                  </table>
                </div>
                
                {/* Phone Model */}
                <Text style={{ margin: "0 0 4px", fontSize: "32px", fontWeight: "900", color: "#ffffff", lineHeight: "0.9", fontFamily: "'Impact', 'Arial Black', sans-serif", letterSpacing: "-1px", textTransform: "uppercase" }}>
                  {topPersona.phoneModel.toUpperCase()}
                </Text>
                
                {/* Character Name */}
                <Text style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "400", color: "#ffffff", fontFamily: "'Helvetica', 'Arial', sans-serif", letterSpacing: "2px", textTransform: "uppercase" }}>
                  {topPersona.characterName}
                </Text>
                
                {/* Tagline */}
                <div style={{ 
                  backgroundColor: "#ffffff", 
                  border: "2px solid #000000", 
                  borderRadius: "0px", 
                  padding: "6px 12px", 
                  margin: "0 auto 16px",
                  display: "inline-block"
                }}>
                  <Text style={{ margin: "0", fontSize: "11px", fontWeight: "700", color: "#000000", fontFamily: "'Verdana', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {topPersona.tagline}
                  </Text>
                </div>
                
                {/* URL */}
                <Text style={{ margin: "0", fontSize: "9px", fontWeight: "400", color: "#ffffff", fontFamily: "'Courier New', monospace", letterSpacing: "1px" }}>
                  {quizUrl}
                </Text>
                
              </div>

              {/* Social Share Buttons */}
              <div style={{ textAlign: "center", margin: "16px 0" }}>
                <Link href={`https://wa.me/?text=I just discovered I'm "${topPersona.characterName}" (${topPersona.phoneModel}) in FutureNet's Digital Parent Quiz! 📱 Help us research how technology shapes modern parenting - what's your digital parenting style? Take the quiz: ${quizUrl}`} style={{ textDecoration: "none" }}>
                  <div style={{ 
                    backgroundColor: "#a8e6a3", 
                    color: "#2d5a2d", 
                    padding: "5px 12px", 
                    borderRadius: "8px", 
                    fontSize: "14px", 
                    fontWeight: "600",
                    border: "2px solid rgba(168, 230, 163, 0.6)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <svg width="40" height="40" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                      <g fill="none" stroke="#2d5a2d" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M200 80
                                 C120 80, 80 130, 80 200
                                 C80 270, 120 320, 200 320
                                 C220 320, 240 315, 260 305
                                 L300 320 L285 280
                                 C310 250, 320 225, 320 200
                                 C320 130, 280 80, 200 80 Z"/>
                        <path d="M160 180
                                 C150 170, 150 150, 165 145
                                 C190 135, 210 165, 220 185
                                 C230 205, 260 220, 245 245
                                 C230 270, 200 255, 180 230
                                 C165 215, 150 195, 160 180 Z"/>
                      </g>
                    </svg>
                    WhatsApp
                  </div>
                </Link>
                
                <Link href={`https://t.me/share/url?url=${quizUrl}&text=I just discovered I'm "${topPersona.characterName}" (${topPersona.phoneModel}) in FutureNet's Digital Parent Quiz! Help us research how technology shapes modern parenting - what's your digital parenting style?`} style={{ textDecoration: "none" }}>
                  <div style={{ 
                    backgroundColor: "#a3d5f0", 
                    color: "#2d4a5a", 
                    padding: "5px 12px", 
                    borderRadius: "8px", 
                    fontSize: "14px", 
                    fontWeight: "600",
                    border: "2px solid rgba(163, 213, 240, 0.6)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <svg width="40" height="40" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                      <g fill="none" stroke="#2d4a5a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="200" cy="200" r="120"/>
                        <path d="M140 220 L280 140 L220 260 L200 220 Z"/>
                      </g>
                    </svg>
                    Telegram
                  </div>
                </Link>
                
                <Link href={`${quizUrl}?share=${encodeURIComponent(`I just discovered I'm "${topPersona.characterName}" (${topPersona.phoneModel}) in FutureNet's Digital Parent Quiz! Help us research how technology shapes modern parenting.`)}`} style={{ textDecoration: "none" }}>
                  <div style={{ 
                    backgroundColor: "#d5a3f0", 
                    color: "#4a2d5a", 
                    padding: "5px 12px", 
                    borderRadius: "8px", 
                    fontSize: "14px", 
                    fontWeight: "600",
                    border: "2px solid rgba(213, 163, 240, 0.6)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <svg width="40" height="40" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                      <g fill="none" stroke="#4a2d5a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" transform="rotate(30 200 200)">
                        <circle cx="120" cy="120" r="40"/>
                        <circle cx="280" cy="120" r="40"/>
                        <circle cx="200" cy="280" r="40"/>
                        <path d="M155 145 L245 145"/>
                        <path d="M155 145 L165 245"/>
                        <path d="M245 145 L235 245"/>
                      </g>
                    </svg>
                    Share Link
                  </div>
                </Link>
              </div>
              
              <Text style={{ margin: "16px 0 0", fontSize: "14px", opacity: "0.7", fontStyle: "italic" }}>
                Share your result and challenge your friends to find their digital parent type! Every share helps us expand our research and better understand how technology shapes modern parenting.
              </Text>
            </Section>

            <Hr style={{ borderColor: "rgba(26, 26, 26, 0.2)", margin: "32px 0", borderWidth: "2px" }} />

            {/* Other personas section */}
            <Section style={{ marginBottom: "32px" }}>
              <Heading as="h2" style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: "600", textAlign: "center" }}>
                Discover Other Digital Parent Types
              </Heading>
              <Text style={{ margin: "0 0 24px", fontSize: "16px", textAlign: "center", opacity: "0.8" }}>
                Curious about other parenting styles? Here&apos;s the full lineup:
              </Text>

              {allPersonas.map((persona, index) => (
                <table key={persona.id} style={{ width: "100%", marginBottom: index < allPersonas.length - 1 ? "16px" : "0", backgroundColor: "#f7f3ea", border: "2px solid rgba(26, 26, 26, 0.15)", borderRadius: "8px", borderCollapse: "separate", borderSpacing: "0" }}>
                  <tr>
                    <td style={{ padding: "16px", width: "76px", verticalAlign: "top" }}>
                      <table style={{ border: "2px solid rgba(26, 26, 26, 0.3)", borderRadius: "4px", backgroundColor: "#ffffff", width: "60px", height: "60px", borderCollapse: "separate", borderSpacing: "0" }}>
                        <tr>
                          <td style={{ textAlign: "center", verticalAlign: "middle", width: "60px", height: "60px" }}>
                            <Img src={PHONE_IMAGE_URLS[persona.id]} alt={persona.phoneModel} width={40} height={40} style={{ display: "block", margin: "0 auto" }} />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style={{ padding: "16px 16px 16px 0", verticalAlign: "top" }}>
                      <Text style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "600" }}>
                        {persona.phoneModel} — {persona.characterName}
                      </Text>
                      <Text style={{ margin: "0 0 8px", fontSize: "14px", fontStyle: "italic", color: "rgba(26, 26, 26, 0.7)" }}>
                        {persona.tagline}
                      </Text>
                      <Text style={{ margin: "0", fontSize: "14px", lineHeight: "1.4" }}>
                        {persona.summary}
                      </Text>
                    </td>
                  </tr>
                </table>
              ))}
            </Section>

            <Hr style={{ borderColor: "rgba(26, 26, 26, 0.2)", margin: "32px 0", borderWidth: "2px" }} />

            {/* Call to action */}
            <Section style={{ textAlign: "center", marginBottom: "24px" }}>
              <Heading as="h2" style={{ margin: "0 0 16px", fontSize: "22px", fontWeight: "600" }}>
                Share Your Results!
              </Heading>
              <Text style={{ margin: "0 0 20px", fontSize: "16px", lineHeight: "1.6" }}>
                Think your friends and family would be curious about their digital parenting style? 
                Share the quiz and compare your results!
              </Text>
              <div style={{ margin: "20px 0" }}>
                <a href={quizUrl} style={{ display: "inline-block", padding: "14px 24px", backgroundColor: "#f7f3ea", border: "3px solid rgba(26, 26, 26, 0.65)", borderRadius: "0", textDecoration: "none", color: "#1a1a1a", fontWeight: "600", fontSize: "16px", letterSpacing: "0.01em" }}>
                  Take the Quiz Again
                </a>
              </div>
              <Text style={{ margin: "16px 0 0", fontSize: "14px", opacity: "0.7" }}>
                Forward this email to friends or share the link: {quizUrl}
              </Text>
            </Section>

            <Section style={{ marginBottom: "24px" }}>
              <Text style={{ margin: "0 0 10px", fontSize: "13px", lineHeight: "1.6", color: "#4a4a4a" }}>
                You’re receiving this email because you entered your email address to view your Digital Parent Quiz results.
                We may also contact you in future about research updates or follow-up studies.
              </Text>
              <Text style={{ margin: "0 0 14px", fontSize: "13px", lineHeight: "1.6", color: "#4a4a4a" }}>
                If you’d rather not receive future emails, you can unsubscribe below.
              </Text>
              {unsubscribeHref ? (
                <div style={{ textAlign: "center" }}>
                  <a
                    href={unsubscribeHref}
                    style={{
                      display: "inline-block",
                      padding: "12px 18px",
                      backgroundColor: "#ffffff",
                      border: "2px solid rgba(26, 26, 26, 0.65)",
                      textDecoration: "none",
                      color: "#1a1a1a",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Unsubscribe
                  </a>
                </div>
              ) : null}
            </Section>

            <Hr style={{ borderColor: "rgba(26, 26, 26, 0.2)", margin: "32px 0", borderWidth: "2px" }} />

            {/* Research Data Section */}
            <Section style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <Heading as="h3" style={{ margin: "0", fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
                  Research Data
                </Heading>
              </div>
              <Text style={{ margin: "0 0 12px", fontSize: "12px", color: "#666", fontStyle: "italic" }}>
                For FutureNet&#39;s research purposes - thank you for contributing to our study!
              </Text>
              
              {/* Metadata Block */}
              <div style={{ marginBottom: "16px" }}>
                <Text style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
                  Participant Metadata:
                </Text>
                <div style={{ 
                  backgroundColor: "#f8f8f8", 
                  border: "2px solid #e0e0e0", 
                  borderRadius: "0px", 
                  padding: "12px", 
                  fontFamily: "'Courier New', monospace", 
                  fontSize: "11px", 
                  lineHeight: "1.2",
                  color: "#333",
                  wordBreak: "break-all"
                }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: "11px" }}>
                  {JSON.stringify({
                  timestamp: new Date().toISOString(),
                  persona_id: topPersona.id,
                  participant_id: payload?.participantId || 'unknown',
                  quiz_version: payload?.quizVersion ?? null,
                  question_set_hash: payload?.questionSetHash ?? null,
                  respondent_type: payload?.respondent?.type ?? null,
                  research_opt_in: payload?.respondent?.researchOptIn ?? null,
                  birth_year: payload?.respondent?.birthYear ?? null,
                  gender: payload?.respondent?.gender ?? null,
                  kids_ages: payload?.respondent?.kidsAges ?? null,
                  })}
                  </span>
                </div>
              </div>

              {/* Question Responses Block */}
              <div>
                <Text style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
                  Question Responses:
                </Text>
                <div style={{ 
                  backgroundColor: "#f8f8f8", 
                  border: "2px solid #e0e0e0", 
                  borderRadius: "0px", 
                  padding: "12px", 
                  fontFamily: "'Courier New', monospace", 
                  fontSize: "11px", 
                  lineHeight: "1.2",
                  color: "#333",
                  wordBreak: "break-all"
                }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: "11px" }}>
                  {JSON.stringify(payload?.answers?.map((q, index: number) => ({
                  question_id: q.questionId,
                  selected_option: q.optionId,
                  chapter: q.chapter
                  })) || [])}
                  </span>
                </div>
              </div>
            </Section>

          </Container>
        </Container>
      </Body>
    </Html>
  );
}
