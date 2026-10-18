import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt = "Zinox Speech — Free AI Text to Speech that runs 100% in your browser";

export default function OpengraphImage() {
  const bars = [42, 88, 150, 220, 280, 340, 300, 240, 170, 110, 70, 48, 90, 140, 200, 260, 310, 270, 200, 130, 80, 52];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.28), transparent 55%), radial-gradient(circle at 80% 85%, rgba(217,70,239,0.24), transparent 55%)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 44,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundImage: "linear-gradient(135deg, #8b5cf6, #d946ef)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <div style={{ width: 7, height: 26, backgroundColor: "#fff", borderRadius: 4 }} />
            <div style={{ width: 7, height: 40, backgroundColor: "#fff", borderRadius: 4 }} />
            <div style={{ width: 7, height: 18, backgroundColor: "#fff", borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#fafafa", display: "flex" }}>
            Zinox Speech
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 800,
            color: "#fafafa",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 26,
          }}
        >
          Free AI Text to Speech
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#a1a1aa",
            marginBottom: 52,
          }}
        >
          100% in your browser · 16 voices · No sign-up
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 120 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: h,
                borderRadius: 6,
                backgroundImage: "linear-gradient(180deg, #d946ef, #8b5cf6)",
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
