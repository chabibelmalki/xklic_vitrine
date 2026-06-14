import { ImageResponse } from "next/og";
import { brand, pricing } from "@/lib/content";

// Visuel de marque 1200×630 partagé sur les réseaux (TikTok, etc.).
// Généré à la volée → pas d'asset binaire à maintenir, reste on-brand.
export const alt = "Xklic — le site pro qui te ramène des clients, en ligne en 2h";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tokens "premium chaleureux" (cf. globals.css @theme).
const IVORY = "#faf6f0";
const INK = "#1b1611";
const MUTED = "#6a6055";
const VERMILLON = "#e5431f";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: IVORY,
          backgroundImage: `radial-gradient(circle at 85% 0%, rgba(229,67,31,0.16), transparent 55%)`,
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: VERMILLON,
              color: IVORY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            X
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            {brand.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            Le site pro qui te ramène des clients,
          </div>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -2,
              color: VERMILLON,
            }}
          >
            en ligne en 2h.
          </div>
          <div style={{ fontSize: 32, color: MUTED, marginTop: 22 }}>
            Artisans, auto-entrepreneurs &amp; TPE — clés en main, sans engagement.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              background: VERMILLON,
              color: IVORY,
              padding: "12px 24px",
              borderRadius: 999,
            }}
          >
            {`${pricing.setup} à la création`}
          </div>
          <div style={{ color: INK }}>{`puis ${pricing.monthly}/mois`}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
