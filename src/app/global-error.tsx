"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              maxWidth: "28rem",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "5rem",
                height: "5rem",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                backgroundColor: "#fef2f2",
              }}
            >
              <AlertTriangle
                style={{ width: "2.5rem", height: "2.5rem", color: "#dc2626" }}
              />
            </div>

            <h2
              style={{
                marginTop: "1.5rem",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Something Went Wrong
            </h2>

            <p style={{ marginTop: "0.75rem", color: "#6b7280" }}>
              A critical error occurred. Please try again.
            </p>

            <button
              onClick={reset}
              style={{
                marginTop: "2rem",
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#ffffff",
                backgroundColor: "#2563eb",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
