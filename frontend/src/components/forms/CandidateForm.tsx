"use client";

/**
 * CandidateForm — Sichere Formular-Komponente.
 *
 * XSS-Schutz:
 * - Kein dangerouslySetInnerHTML (außer in sanitizeHtml() mit DOMPurify)
 * - Alle User-Inputs werden als Text, nie als HTML gerendert
 * - File-Upload nur über useFileUpload (MIME-Prüfung)
 *
 * Validation:
 * - Frontend: sofortiges Feedback (kein Security-Ersatz)
 * - Backend: Pydantic validiert nochmal (Pflicht)
 */

import { useFileUpload } from "@/hooks/useFileUpload";
import { ApiClientError, apiClient } from "@/lib/apiClient";
import { ChangeEvent, FormEvent, useId, useState } from "react";

// ── Typen ──────────────────────────────────────────────────────────────────────

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  salaryMin: string;
  salaryMax: string;
  skills: string;
  notes: string;
}

interface FormErrors {
  [K in keyof FormValues]?: string;
}

const INITIAL_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  salaryMin: "",
  salaryMax: "",
  skills: "",
  notes: "",
};

// ── Validation ─────────────────────────────────────────────────────────────────
// Frontend-Validation: UX-Feedback. Backend validiert noch einmal (Pflicht!).

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "Vorname ist erforderlich.";
  } else if (values.firstName.length > 100) {
    errors.firstName = "Vorname darf maximal 100 Zeichen haben.";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Nachname ist erforderlich.";
  } else if (values.lastName.length > 100) {
    errors.lastName = "Nachname darf maximal 100 Zeichen haben.";
  }

  if (!values.email.trim()) {
    errors.email = "E-Mail ist erforderlich.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }

  if (values.phone && !/^\+?[\d\s\-().]{7,20}$/.test(values.phone)) {
    errors.phone = "Bitte geben Sie eine gültige Telefonnummer ein.";
  }

  if (!values.jobTitle.trim()) {
    errors.jobTitle = "Berufsbezeichnung ist erforderlich.";
  } else if (values.jobTitle.length > 200) {
    errors.jobTitle = "Maximal 200 Zeichen.";
  }

  const min = parseInt(values.salaryMin, 10);
  const max = parseInt(values.salaryMax, 10);

  if (values.salaryMin && (isNaN(min) || min < 0 || min > 500000)) {
    errors.salaryMin = "Bitte geben Sie ein gültiges Gehalt ein (0–500.000 €).";
  }

  if (values.salaryMax && (isNaN(max) || max < 0 || max > 500000)) {
    errors.salaryMax = "Bitte geben Sie ein gültiges Gehalt ein (0–500.000 €).";
  }

  if (values.salaryMin && values.salaryMax && !isNaN(min) && !isNaN(max) && min > max) {
    errors.salaryMax = "Maximalgehalt muss größer als Minimalgehalt sein.";
  }

  if (values.notes.length > 2000) {
    errors.notes = "Notizen dürfen maximal 2.000 Zeichen haben.";
  }

  return errors;
}

// ── Komponente ─────────────────────────────────────────────────────────────────

interface CandidateFormProps {
  onSuccess?: (candidateId: string) => void;
}

export function CandidateForm({ onSuccess }: CandidateFormProps) {
  const formId = useId();    // Stabile IDs für Accessibility (kein Math.random)

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const { upload, status: uploadStatus, error: uploadError, filename, reset: resetUpload } =
    useFileUpload(createdId ?? "pending");

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));

    // Live-Validation nach erstem Blur
    if (touched[name as keyof FormValues]) {
      const next = { ...values, [name]: value };
      const nextErrors = validate(next);
      setErrors((prev) => ({ ...prev, [name]: nextErrors[name as keyof FormValues] }));
    }
  }

  function handleBlur(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const nextErrors = validate(values);
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name as keyof FormValues] }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Alle Felder als touched markieren
    const allTouched = Object.keys(INITIAL_VALUES).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof FormValues, boolean>
    );
    setTouched(allTouched);

    const allErrors = validate(values);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim() || undefined,
        job_title: values.jobTitle.trim(),
        salary_min: values.salaryMin ? parseInt(values.salaryMin, 10) : undefined,
        salary_max: values.salaryMax ? parseInt(values.salaryMax, 10) : undefined,
        // Skills: String splitten + trimmen (keine Eval, keine Injection)
        skills: values.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 20),         // Max 20 Skills
        notes: values.notes.trim() || undefined,
      };

      const result = await apiClient.post<{ id: string }>("/api/v1/candidates", payload);
      setCreatedId(result.id);
      onSuccess?.(result.id);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.error.message
          : "Fehler beim Speichern. Bitte versuchen Sie es erneut.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !createdId) return;
    await upload(file);
    // Input zurücksetzen (verhindert erneutes Submit mit gleichem File)
    e.target.value = "";
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  function Field({
    name,
    label,
    type = "text",
    required = false,
    placeholder,
  }: {
    name: keyof FormValues;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) {
    const error = errors[name];
    const hasError = !!error && !!touched[name];

    return (
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor={fieldId(name)} style={{ display: "block", marginBottom: "0.25rem", fontWeight: 500 }}>
          {/* Kein dangerouslySetInnerHTML — Text wird escaped */}
          {label}{required && <span aria-hidden="true" style={{ color: "red" }}> *</span>}
        </label>
        <input
          id={fieldId(name)}
          name={name}
          type={type}
          value={values[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId(name) : undefined}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            border: `1px solid ${hasError ? "#dc2626" : "#d1d5db"}`,
            borderRadius: "0.375rem",
            fontSize: "1rem",
          }}
        />
        {hasError && (
          <p
            id={errorId(name)}
            role="alert"
            style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.25rem" }}
          >
            {/* error ist ein String aus validate() — kein HTML, kein dangerouslySetInnerHTML */}
            {error}
          </p>
        )}
      </div>
    );
  }

  if (createdId) {
    return (
      <div>
        <p style={{ color: "#16a34a", fontWeight: 500 }}>
          Kandidat erfolgreich angelegt (ID: {createdId}).
        </p>

        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
            Lebenslauf hochladen (optional):
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
            Erlaubte Formate: PDF, DOC, DOCX · Max. 10 MB
          </p>

          <label htmlFor={fieldId("cv-upload")} style={{ cursor: "pointer" }}>
            <span style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "0.375rem",
            }}>
              Datei auswählen
            </span>
            <input
              id={fieldId("cv-upload")}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              disabled={uploadStatus === "uploading"}
              style={{ display: "none" }}
            />
          </label>

          {filename && (
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              {/* Dateiname als Text — kein HTML */}
              Ausgewählt: {filename}
            </p>
          )}

          {uploadStatus === "uploading" && (
            <p style={{ color: "#2563eb", marginTop: "0.5rem" }}>Wird hochgeladen...</p>
          )}

          {uploadStatus === "success" && (
            <p style={{ color: "#16a34a", marginTop: "0.5rem" }}>Lebenslauf erfolgreich hochgeladen.</p>
          )}

          {uploadError && (
            <p role="alert" style={{ color: "#dc2626", marginTop: "0.5rem" }}>{uploadError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Kandidat anlegen">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
        <Field name="firstName" label="Vorname" required placeholder="Max" />
        <Field name="lastName" label="Nachname" required placeholder="Mustermann" />
      </div>

      <Field name="email" label="E-Mail" type="email" required placeholder="max@beispiel.de" />
      <Field name="phone" label="Telefon" type="tel" placeholder="+49 211 123456" />
      <Field name="jobTitle" label="Berufsbezeichnung" required placeholder="Senior Maschinenbauingenieur" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
        <Field name="salaryMin" label="Gehalt Minimum (€)" type="number" placeholder="60000" />
        <Field name="salaryMax" label="Gehalt Maximum (€)" type="number" placeholder="80000" />
      </div>

      <Field name="skills" label="Fähigkeiten (kommagetrennt)" placeholder="AutoCAD, SolidWorks, Python" />

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor={fieldId("notes")} style={{ display: "block", marginBottom: "0.25rem", fontWeight: 500 }}>
          Notizen
        </label>
        <textarea
          id={fieldId("notes")}
          name="notes"
          value={values.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          placeholder="Interne Notizen zum Kandidaten..."
          aria-invalid={!!errors.notes && !!touched.notes}
          aria-describedby={errors.notes && touched.notes ? errorId("notes") : undefined}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            border: `1px solid ${errors.notes && touched.notes ? "#dc2626" : "#d1d5db"}`,
            borderRadius: "0.375rem",
            fontSize: "1rem",
            resize: "vertical",
          }}
        />
        {errors.notes && touched.notes && (
          <p id={errorId("notes")} role="alert" style={{ color: "#dc2626", fontSize: "0.875rem" }}>
            {errors.notes}
          </p>
        )}
        <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
          {values.notes.length}/2.000 Zeichen
        </p>
      </div>

      {submitError && (
        <div role="alert" style={{ color: "#dc2626", background: "#fef2f2", padding: "0.75rem", borderRadius: "0.375rem", marginBottom: "1rem" }}>
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: "0.625rem 1.5rem",
          background: submitting ? "#93c5fd" : "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "0.375rem",
          fontSize: "1rem",
          cursor: submitting ? "not-allowed" : "pointer",
          fontWeight: 500,
        }}
      >
        {submitting ? "Wird gespeichert..." : "Kandidat anlegen"}
      </button>
    </form>
  );
}
