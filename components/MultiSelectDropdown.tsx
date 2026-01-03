"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type MultiSelectOption = {
  value: string;
  label: string;
};

export default function MultiSelectDropdown(props: {
  id: string;
  placeholder: string;
  options: ReadonlyArray<MultiSelectOption>;
  selected: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  searchPlaceholder?: string;
}) {
  const { id, placeholder, options, selected, onChange, disabled, searchPlaceholder } = props;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const isOpen = open && !disabled;

  const selectedOptions = useMemo(() => {
    return selected
      .map((v) => options.find((o) => o.value === v))
      .filter((x): x is MultiSelectOption => Boolean(x));
  }, [options, selected]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const na = options.find((o) => o.value === "na") ?? null;
    const rest = options.filter((o) => o.value !== "na");

    const filtered = q ? rest.filter((o) => o.label.toLowerCase().includes(q)) : rest;

    return na ? [na, ...filtered] : filtered;
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) return;

    function onDocMouseDown(ev: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(ev.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    queueMicrotask(() => {
      searchRef.current?.focus();
    });
  }, [isOpen]);

  return (
    <div ref={rootRef} style={{ width: "100%", position: "relative" }}>
      <div
        id={id}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled ? "true" : "false"}
        aria-haspopup="listbox"
        aria-expanded={isOpen ? "true" : "false"}
        onClick={() => {
          if (disabled) return;
          setQuery("");
          setOpen((v) => !v);
        }}
        onKeyDown={(ev) => {
          if (disabled) return;
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            setQuery("");
            setOpen((v) => !v);
          }
          if (ev.key === "Escape") {
            setOpen(false);
          }
        }}
        style={{
          width: "100%",
          cursor: disabled ? "not-allowed" : "pointer",
          padding: "10px 12px",
          border: "1px solid rgba(0,0,0,0.18)",
          borderRadius: 10,
          background: disabled ? "rgba(0,0,0,0.04)" : "#fff",
          userSelect: "none",
          fontSize: 14,
          lineHeight: "20px",
          boxSizing: "border-box",
          textAlign: "left",
        }}
      >
        {selectedOptions.length ? (
          <span
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
            }}
          >
            {selectedOptions.map((opt) => {
              return (
                <span
                  key={opt.value}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid rgba(0,0,0,0.18)",
                    borderRadius: 999,
                    padding: "4px 10px",
                    background: "rgba(0,0,0,0.03)",
                    maxWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      lineHeight: "16px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 220,
                    }}
                    title={opt.label}
                  >
                    {opt.label}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${opt.label}`}
                    disabled={disabled}
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      onChange(selected.filter((v) => v !== opt.value));
                    }}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: disabled ? "not-allowed" : "pointer",
                      padding: 0,
                      lineHeight: "16px",
                      fontSize: 16,
                      color: "rgba(0,0,0,0.6)",
                    }}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </span>
        ) : (
          <span style={{ color: "rgba(0,0,0,0.6)" }}>{placeholder}</span>
        )}
      </div>

      {isOpen ? (
        <div
          role="listbox"
          aria-multiselectable="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 6px)",
            zIndex: 50,
            padding: 12,
            border: "1px solid rgba(0,0,0,0.18)",
            borderRadius: 10,
            background: "#fff",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            maxHeight: 320,
            overflowY: "auto",
          }}
          onKeyDown={(ev) => {
            if (ev.key === "Escape") setOpen(false);
          }}
        >
          <input
            ref={searchRef}
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder={searchPlaceholder ?? "Type to filter…"}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid rgba(0,0,0,0.18)",
              borderRadius: 10,
              fontSize: 14,
              boxSizing: "border-box",
              marginBottom: 12,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredOptions.length ? (
              filteredOptions.map((opt) => {
                const checked = selected.includes(opt.value);
                return (
                  <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={(ev) => {
                        const isNa = opt.value === "na";
                        const nextChecked = ev.target.checked;

                        if (nextChecked) {
                          if (isNa) {
                            onChange(["na"]);
                            return;
                          }
                          onChange([...(selected.filter((v) => v !== "na")), opt.value]);
                          return;
                        }

                        onChange(selected.filter((v) => v !== opt.value));
                      }}
                    />
                    <span style={{ fontSize: 14, lineHeight: "18px" }}>{opt.label}</span>
                  </label>
                );
              })
            ) : (
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>No matches.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
