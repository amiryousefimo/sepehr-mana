import {ImageResponse} from "next/og";

export const runtime = "edge";
export const alt = "Takapoo Garan Sepehr Mana — Integrated technology solutions";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#030b16",
          color: "white",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 650,
            height: 650,
            right: -120,
            top: -100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,211,238,.3), rgba(14,165,233,.08) 45%, transparent 70%)"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(56,189,248,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px"
          }}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "80px"
          }}
        >
          <div style={{display: "flex", flexDirection: "column", maxWidth: 710}}>
            <div
              style={{
                color: "#38bdf8",
                fontSize: 22,
                letterSpacing: 2,
                textTransform: "uppercase"
              }}
            >
              Integrated enterprise solutions
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 61,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -3
              }}
            >
              Takapoo Garan
              <br />
              Sepehr Mana
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                color: "#9cb4c7",
                fontSize: 25,
                lineHeight: 1.5
              }}
            >
              Software · Data · Process · Infrastructure
            </div>
          </div>
          <div
            style={{
              width: 250,
              height: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(56,189,248,.5)",
              borderRadius: "50%",
              boxShadow: "0 0 80px rgba(14,165,233,.26)"
            }}
          >
            <div
              style={{
                width: 125,
                height: 125,
                display: "flex",
                transform: "rotate(45deg)",
                border: "16px solid #38bdf8",
                borderLeftColor: "#22d3ee",
                background: "#071322"
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  );
}
