"use client";

import type { CSSProperties } from "react";

import styles from "./page.module.css";

import MultiSelectDropdown from "../../components/MultiSelectDropdown";

export default function EmailGateOverlay(props: {
  emailSent: boolean;
  isSendingEmail: boolean;
  emailError: string | null;
  email: string;
  setEmail: (next: string) => void;
  respondentType: "parent" | "expecting" | "considering" | "na" | null;
  setRespondentType: (next: "parent" | "expecting" | "considering" | "na") => void;
  researchOptIn: boolean;
  setResearchOptIn: (next: boolean) => void;
  birthYear: string;
  setBirthYear: (next: string) => void;
  nationalityOptions: ReadonlyArray<{ value: string; label: string }>;
  nationalities: string[];
  setNationalities: (next: string[]) => void;
  ethnicityOptions: ReadonlyArray<{ value: string; label: string }>;
  ethnicities: string[];
  setEthnicities: (next: string[]) => void;
  gender: "m" | "w" | "na" | null;
  setGender: (next: "m" | "w" | "na") => void;
  kidsAgeOptions: ReadonlyArray<{ value: string; label: string }>;
  kidsAgeBands: string[];
  setKidsAgeBands: (next: string[]) => void;
  optionButtonClassName: string;
  optionButtonSelectedClassName: string;
  buttonClassName: string;
  buttonSecondaryClassName: string;
  optionButtonStyle: CSSProperties;
  onSubmit: () => void;
  onRestart: () => void;
  onCloseAfterSent: () => void;
}) {
  const {
    emailSent,
    isSendingEmail,
    emailError,
    email,
    setEmail,
    respondentType,
    setRespondentType,
    researchOptIn,
    setResearchOptIn,
    birthYear,
    setBirthYear,
    nationalityOptions,
    nationalities,
    setNationalities,
    ethnicityOptions,
    ethnicities,
    setEthnicities,
    gender,
    setGender,
    kidsAgeOptions,
    kidsAgeBands,
    setKidsAgeBands,
    optionButtonClassName,
    optionButtonSelectedClassName,
    buttonClassName,
    buttonSecondaryClassName,
    optionButtonStyle,
    onSubmit,
    onRestart,
    onCloseAfterSent,
  } = props;

  return (
    <div className={styles.resultGateOverlay} role="dialog" aria-modal="true">
      <div className={styles.resultGateWindow}>
        <div className={styles.resultGateTitlebar}>
          <div className={styles.resultGateTitle}>{emailSent ? "Email sent" : "Email required"}</div>
          <div className={styles.resultGateControls}>
            <div className={styles.resultGateControl} aria-hidden="true" />
            <div className={styles.resultGateControl} aria-hidden="true" />
            <div className={styles.resultGateControl} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.resultGateBody}>
          {emailSent ? (
            <>
              <div className={styles.resultGateCopy}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                  <svg
                    width="72"
                    height="72"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0 0; 0 -4; 0 0"
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                      <path
                        d="M24 42H96V86C96 91.5228 91.5228 96 86 96H34C28.4772 96 24 91.5228 24 86V42Z"
                        stroke="rgba(0,0,0,0.8)"
                        strokeWidth="4"
                        fill="rgba(176,38,255,0.10)"
                      />
                      <path
                        d="M24 46L60 70L96 46"
                        stroke="rgba(0,0,0,0.8)"
                        strokeWidth="4"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M26 88L50 70"
                        stroke="rgba(176,38,255,0.55)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M94 88L70 70"
                        stroke="rgba(176,38,255,0.55)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M86 30C92 30 96 34 96 40"
                        stroke="rgba(176,38,255,0.85)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M18 62C12 62 8 58 8 52"
                        stroke="rgba(176,38,255,0.85)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                </div>

                <div style={{ marginBottom: 10 }}>Thanks again for helping our research!</div>

                <div style={{ marginBottom: 10 }}>
                  We&apos;ve sent a <strong>full breakdown</strong> of your results to your email, together with an <strong>overview of the other personas</strong>.
                </div>

                <div style={{ marginBottom: 8 }}>If you don&apos;t see it:</div>

                <ul style={{ margin: "0 0 10px", paddingLeft: 18 }}>
                  <li>
                    Check your <strong>Spam</strong> (or Promotions) folder.
                  </li>
                  <li>
                    If it&apos;s there, please mark it as <strong>Not spam</strong> so future research reach-outs arrive.
                  </li>
                </ul>

                <div>You can close this popup now to view your shareable result here in your browser.</div>
              </div>

              <div className={styles.resultGateButtons}>
                <button type="button" className={buttonClassName} onClick={onCloseAfterSent} disabled={isSendingEmail}>
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.resultGateCopy}>
                Thank you for taking the quiz and helping us in our research! Enter your email to reveal the rest of your result and get a full breakdown of all Digital Parent persona types.
              </div>

              <div className={styles.resultGateRow}>
                <div className={styles.resultGateLabel}>I am:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <button
                    type="button"
                    className={`${buttonClassName} ${optionButtonClassName} ${respondentType === "parent" ? optionButtonSelectedClassName : ""}`}
                    onClick={() => setRespondentType("parent")}
                    disabled={isSendingEmail}
                    style={optionButtonStyle}
                  >
                    A parent
                  </button>
                  <button
                    type="button"
                    className={`${buttonClassName} ${optionButtonClassName} ${respondentType === "expecting" ? optionButtonSelectedClassName : ""}`}
                    onClick={() => {
                      setRespondentType("expecting");
                      setKidsAgeBands([]);
                    }}
                    disabled={isSendingEmail}
                    style={optionButtonStyle}
                  >
                    Expecting parent
                  </button>
                  <button
                    type="button"
                    className={`${buttonClassName} ${optionButtonClassName} ${respondentType === "considering" ? optionButtonSelectedClassName : ""}`}
                    onClick={() => {
                      setRespondentType("considering");
                      setKidsAgeBands([]);
                    }}
                    disabled={isSendingEmail}
                    style={optionButtonStyle}
                  >
                    Considering children
                  </button>
                  <button
                    type="button"
                    className={`${buttonClassName} ${optionButtonClassName} ${respondentType === "na" ? optionButtonSelectedClassName : ""}`}
                    onClick={() => {
                      setRespondentType("na");
                      setKidsAgeBands([]);
                    }}
                    disabled={isSendingEmail}
                    style={optionButtonStyle}
                  >
                    Not applicable
                  </button>
                </div>
              </div>

              <div className={styles.resultGateRow}>
                <label className={styles.resultGateLabel} htmlFor="dpq-research-optin">
                  Optional
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
                  <input
                    id="dpq-research-optin"
                    type="checkbox"
                    checked={researchOptIn}
                    onChange={(ev) => setResearchOptIn(ev.target.checked)}
                    disabled={isSendingEmail}
                  />
                  Help further our research with optional questions
                </label>
              </div>

              {researchOptIn ? (
                <>
                  <div className={styles.resultGateRow}>
                    <label className={styles.resultGateLabel} htmlFor="dpq-birth-year">
                      Birth year
                    </label>
                    <input
                      id="dpq-birth-year"
                      className={styles.resultGateInput}
                      value={birthYear}
                      onChange={(ev) => setBirthYear(ev.target.value)}
                      inputMode="numeric"
                      placeholder="e.g. 1990"
                      disabled={isSendingEmail}
                    />
                  </div>

                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)", margin: "10px 0" }} />

                  <div className={styles.subtle} style={{ margin: "0 0 10px" }}>
                    Select all that apply (you can choose more than one) — useful for dual nationality / mixed ethnicity.
                  </div>

                  <div className={styles.resultGateRow}>
                    <div className={styles.resultGateLabel}>Nationality (country)</div>
                    <MultiSelectDropdown
                      id="dpq-nationality"
                      placeholder="Select country / nationality (optional)"
                      searchPlaceholder="Type to filter countries…"
                      options={nationalityOptions}
                      selected={nationalities}
                      onChange={setNationalities}
                      disabled={isSendingEmail}
                    />
                  </div>

                  <div className={styles.resultGateRow}>
                    <div className={styles.resultGateLabel}>Ethnicity</div>
                    <MultiSelectDropdown
                      id="dpq-ethnicity"
                      placeholder="Select ethnicity (optional)"
                      searchPlaceholder="Type to filter ethnicities…"
                      options={ethnicityOptions}
                      selected={ethnicities}
                      onChange={setEthnicities}
                      disabled={isSendingEmail}
                    />
                  </div>

                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)", margin: "10px 0" }} />

                  <div className={styles.resultGateRow}>
                    <div className={styles.resultGateLabel}>Gender</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      <button
                        type="button"
                        className={`${buttonClassName} ${optionButtonClassName} ${gender === "m" ? optionButtonSelectedClassName : ""}`}
                        onClick={() => setGender("m")}
                        disabled={isSendingEmail}
                        style={optionButtonStyle}
                      >
                        Man
                      </button>
                      <button
                        type="button"
                        className={`${buttonClassName} ${optionButtonClassName} ${gender === "w" ? optionButtonSelectedClassName : ""}`}
                        onClick={() => setGender("w")}
                        disabled={isSendingEmail}
                        style={optionButtonStyle}
                      >
                        Woman
                      </button>
                      <button
                        type="button"
                        className={`${buttonClassName} ${optionButtonClassName} ${gender === "na" ? optionButtonSelectedClassName : ""}`}
                        onClick={() => setGender("na")}
                        disabled={isSendingEmail}
                        style={optionButtonStyle}
                      >
                        Prefer not to say
                      </button>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)", margin: "10px 0" }} />

                  {respondentType === "parent" ? (
                    <div className={styles.resultGateRow}>
                      <div className={styles.resultGateLabel}>Kid age(s)</div>
                      <MultiSelectDropdown
                        id="dpq-kids-ages"
                        placeholder="Select kid age(s) (optional)"
                        searchPlaceholder="Type to filter ages…"
                        options={kidsAgeOptions}
                        selected={kidsAgeBands}
                        onChange={setKidsAgeBands}
                        disabled={isSendingEmail}
                      />
                    </div>
                  ) : null}
                </>
              ) : null}

              <div className={styles.resultGateRow}>
                <label className={styles.resultGateLabel} htmlFor="dpq-email">
                  Email
                </label>
                <input
                  id="dpq-email"
                  className={styles.resultGateInput}
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") onSubmit();
                  }}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@domain.com"
                  disabled={isSendingEmail}
                />
              </div>

              {emailError ? <div className={styles.subtle} style={{ marginTop: 10 }}>{emailError}</div> : null}

              <div className={styles.resultGateButtons}>
                <button type="button" className={`${buttonClassName} ${buttonSecondaryClassName}`} onClick={onRestart} disabled={isSendingEmail}>
                  Not now
                </button>
                <button type="button" className={buttonClassName} onClick={onSubmit} disabled={isSendingEmail}>
                  {isSendingEmail ? "Sending…" : "Reveal result"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
