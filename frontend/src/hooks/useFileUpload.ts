"use client";

/**
 * useFileUpload — Sichere Datei-Upload-Logik.
 *
 * Client-Side Validation (schnelles UX-Feedback, kein Security-Ersatz):
 * - MIME-Type via file.type (spoofbar vom User — daher nur UX, nie Security)
 * - Dateigröße (Netzwerk sparen)
 * - Dateiendung als dritte Linie
 *
 * WICHTIG: Server validiert MIME aus Datei-Bytes via python-magic (nicht spoofbar).
 * Client-Validation ist nur für schnelles Feedback — niemals allein ausreichend.
 *
 * Kein eval(), keine dangerouslySetInnerHTML, kein new Function().
 */

import { ApiClientError, apiClient } from "@/lib/apiClient";
import { useCallback, useState } from "react";

// ── Typen ──────────────────────────────────────────────────────────────────────

export type UploadStatus = "idle" | "validating" | "uploading" | "success" | "error";

export interface UploadState {
  status: UploadStatus;
  progress: number;       // 0–100
  error: string | null;
  filename: string | null;
}

// Erlaubte Typen (muss mit Backend übereinstimmen)
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useFileUpload(candidateId: string) {
  const [state, setState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    error: null,
    filename: null,
  });

  const upload = useCallback(
    async (file: File): Promise<boolean> => {
      // ── 1. Client-Side Validation (UX-Feedback, nicht Security) ─────────────

      setState({ status: "validating", progress: 0, error: null, filename: file.name });

      // Größe prüfen
      if (file.size > MAX_SIZE_BYTES) {
        setState((s) => ({
          ...s,
          status: "error",
          error: `Die Datei ist zu groß. Maximal ${MAX_SIZE_MB} MB erlaubt.`,
        }));
        return false;
      }

      // MIME-Type (client-seitig — spoofbar, nur UX)
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        setState((s) => ({
          ...s,
          status: "error",
          error: "Nur PDF und Word-Dokumente (.pdf, .doc, .docx) sind erlaubt.",
        }));
        return false;
      }

      // Dateiendung (dritte Prüfung)
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        setState((s) => ({
          ...s,
          status: "error",
          error: "Nur .pdf, .doc und .docx Dateien sind erlaubt.",
        }));
        return false;
      }

      // Dateiname sanity check (kein Path Traversal)
      if (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\")) {
        setState((s) => ({
          ...s,
          status: "error",
          error: "Ungültiger Dateiname.",
        }));
        return false;
      }

      // ── 2. Upload ────────────────────────────────────────────────────────────

      setState((s) => ({ ...s, status: "uploading", progress: 10 }));

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Progress simulieren (Fetch hat kein echtes Progress-Event)
        const progressInterval = setInterval(() => {
          setState((s) => ({
            ...s,
            progress: Math.min(s.progress + 10, 90),
          }));
        }, 300);

        await apiClient.upload(
          `/api/v1/candidates/${candidateId}/documents`,
          formData
        );

        clearInterval(progressInterval);

        setState({ status: "success", progress: 100, error: null, filename: file.name });
        return true;
      } catch (err) {
        const message =
          err instanceof ApiClientError
            ? err.error.message
            : "Upload fehlgeschlagen. Bitte versuchen Sie es erneut.";

        setState((s) => ({ ...s, status: "error", progress: 0, error: message }));
        return false;
      }
    },
    [candidateId]
  );

  const reset = useCallback(() => {
    setState({ status: "idle", progress: 0, error: null, filename: null });
  }, []);

  return { ...state, upload, reset };
}

// ── Image Preview (nur für Images, niemals für PDFs/Docs ausführen) ─────────

/**
 * Erzeugt einen sicheren Object-URL-Preview für Image-Dateien.
 * Für PDFs/Docs wird kein Preview generiert (Sicherheitsregel: keine Ausführung).
 * Aufrufer muss URL.revokeObjectURL(url) aufrufen wenn nicht mehr benötigt.
 */
export function createImagePreview(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    // Kein Preview für nicht-Bilder — verhindert versehentliche Ausführung
    return null;
  }
  return URL.createObjectURL(file);
}
