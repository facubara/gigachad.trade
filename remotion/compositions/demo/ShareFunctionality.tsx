import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";

/**
 * Demo 8: ShareFunctionality
 * Share button click → Twitter compose preview
 * Duration: 8 seconds (240 frames at 30fps)
 */

export function ShareFunctionality() {
  const frame = useCurrentFrame();

  // Click happens at frame 90
  const clickFrame = 90;
  const isClicked = frame >= clickFrame;

  // Button animation on click
  const buttonScale = isClicked
    ? interpolate(
        frame - clickFrame,
        [0, 5, 15],
        [1, 0.9, 1],
        { extrapolateRight: "clamp" }
      )
    : interpolate(
        frame % 60,
        [0, 30, 60],
        [1, 1.02, 1]
      );

  // Twitter compose preview slides in
  const previewSlide = interpolate(
    frame,
    [clickFrame + 30, clickFrame + 60],
    [100, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const previewOpacity = interpolate(
    frame,
    [clickFrame + 30, clickFrame + 50],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        padding: 80,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.dim,
            marginBottom: 8,
          }}
        >
          Share Your Gains
        </p>
        <p
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: colors.white,
          }}
        >
          Spread the Word
        </p>
      </div>

      {/* Stats card that will be shared */}
      <div
        style={{
          backgroundColor: colors.steel,
          border: `1px solid ${colors.border}`,
          padding: 40,
          width: 500,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <p
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: colors.white,
            lineHeight: 0.9,
          }}
        >
          x33
        </p>
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.muted,
            marginTop: 16,
          }}
        >
          My Potential at $1B
        </p>
        <div
          style={{
            marginTop: 24,
            padding: "8px 16px",
            backgroundColor: colors.positive,
            color: colors.black,
            display: "inline-block",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          $49,500
        </div>
      </div>

      {/* Share button */}
      <div
        style={{
          transform: `scale(${buttonScale})`,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            backgroundColor: colors.white,
            color: colors.black,
            padding: "16px 48px",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>𝕏</span>
          <span>Share on Twitter</span>
        </div>
      </div>

      {/* Click indicator */}
      {frame >= clickFrame - 20 && frame < clickFrame && (
        <div
          style={{
            position: "absolute",
            transform: "translateY(60px)",
            opacity: interpolate(frame, [clickFrame - 20, clickFrame], [0, 1]),
          }}
        >
          <span style={{ fontSize: 24 }}>👆</span>
        </div>
      )}

      {/* Twitter compose preview */}
      {isClicked && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            width: 450,
            backgroundColor: "#15202B",
            borderRadius: 16,
            padding: 24,
            transform: `translateY(${previewSlide}px)`,
            opacity: previewOpacity,
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Twitter header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#1DA1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              𝕏
            </div>
            <div>
              <p style={{ color: "#FFFFFF", fontWeight: 600, fontSize: 14 }}>
                Compose Tweet
              </p>
              <p style={{ color: "#8899A6", fontSize: 12 }}>@yourhandle</p>
            </div>
          </div>

          {/* Tweet content */}
          <p
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              lineHeight: 1.5,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            I'm up x33 on $GIGA if we hit $1B market cap! 🚀
            <br />
            <br />
            My bag would be worth $49,500 💰
            <br />
            <br />
            Calculate your gains at gigachad.trade
            <br />
            <br />
            <span style={{ color: "#1DA1F2" }}>#GIGACHAD #Solana</span>
          </p>

          {/* Tweet button */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                backgroundColor: "#1DA1F2",
                color: "#FFFFFF",
                padding: "10px 24px",
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Post
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
