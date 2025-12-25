import { Literata } from "next/font/google";
import Link from "next/link";
import Doodle from "../components/Doodle";
import Typewriter from "../components/Typewriter";
import styles from "./page.module.css";

const kindleLike = Literata({ subsets: ["latin"], weight: ["400", "600"] });

export default function Home() {
  const descriptionText =
    "A technologist-led research initiative into the digital landscape for children, adolescents, and their parents.";

  return (
    <main className={`${kindleLike.className} ${styles.page}`}>
      <section className={styles.hero} aria-label="FutureNet hero">
        <div className={styles.heroGrid}>
          <Doodle className={`${styles.doodleCell} ${styles.tl}`} delayMs={80} src="/doodles/tree.svg" />
          <Doodle className={`${styles.doodleCell} ${styles.tr}`} delayMs={420} src="/doodles/leaf.svg" />
          <Doodle className={`${styles.doodleCell} ${styles.bl}`} delayMs={760} src="/doodles/cat.svg" />
          <Doodle className={`${styles.doodleCell} ${styles.br}`} delayMs={980} src="/doodles/phone.svg" />
          <Doodle className={`${styles.doodleCell} ${styles.bc}`} delayMs={1250} src="/doodles/laptop.svg" />

          <div className={styles.heroInner}>
            <h1 className={styles.title}>FutureNet</h1>
            <p className={`${styles.tagline} ${styles.taglineHero}`}>
              Giving our children <span className={styles.highlight}>a chance to grow up</span>, 
              <br></br>
              <span className={styles.handUnderline}>
                <span className={styles.handUnderlineText}>like we did</span>
                <svg
                  className={styles.handUnderlineSvg}
                  viewBox="0 0 220 26"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M4 18 C 32 8, 56 24, 88 14 S 150 20, 216 12" />
                </svg>
              </span>
              .
            </p>
            <div className={styles.typeBlock} role="doc-subtitle">
              <p className={styles.description}>
                <Typewriter
                  text={descriptionText}
                  startDelayMs={600}
                  charDelayMs={18}
                  showCaret
                />
              </p>

              <div className={styles.ctaRow}>
                <Link className={styles.ctaButton} href="/digital-parent-quiz">
                  Digital Parent Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
