import { ImageResponse } from "next/og";

import { PROFILE } from "@/lib/content/local";

export const alt = `${PROFILE.name} | ${PROFILE.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card. Uses the local profile (not Sanity) so it stays a static asset
 * generated at build time.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121016",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent wash */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -120,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,88,240,0.38) 0%, rgba(18,16,22,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#a78bfa",
              display: "flex",
            }}
          >
            {PROFILE.headline}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 86,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -3,
              display: "flex",
            }}
          >
            {PROFILE.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              lineHeight: 1.4,
              color: "#a8a4b4",
              maxWidth: 880,
              display: "flex",
            }}
          >
            {PROFILE.heroStatement}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 32,
            fontSize: 24,
            color: "#8b8798",
          }}
        >
          <div style={{ display: "flex" }}>govindatimsina.com.np</div>
          <div style={{ display: "flex" }}>React Native · Expo · Next.js</div>
        </div>
      </div>
    ),
    size,
  );
}
