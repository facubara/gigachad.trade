import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing, Audio } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { GlowText } from "../../components/GlowText";
import { AnimatedNumber } from "../../components/AnimatedNumber";

/**
 * TwitterLaunchPromo
 * The ultimate launch video for Twitter - fast, hype, engaging
 * Duration: 45 seconds (1350 frames at 30fps)
 * Format: 16:9
 */

export function TwitterLaunchPromo() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        overflow: "hidden",
      }}
    >
      {/* ========== SECTION 1: HOOK (0-90) ========== */}
      <Sequence from={0} durationInFrames={90}>
        <HookSection frame={frame} />
      </Sequence>

      {/* ========== SECTION 2: THE PROBLEM (90-180) ========== */}
      <Sequence from={90} durationInFrames={90}>
        <ProblemSection frame={frame - 90} />
      </Sequence>

      {/* ========== SECTION 3: THE SOLUTION - LOGO REVEAL (180-270) ========== */}
      <Sequence from={180} durationInFrames={90}>
        <SolutionReveal frame={frame - 180} />
      </Sequence>

      {/* ========== SECTION 4: MULTIPLIER SHOWCASE (270-420) ========== */}
      <Sequence from={270} durationInFrames={150}>
        <MultiplierShowcase frame={frame - 270} />
      </Sequence>

      {/* ========== SECTION 5: FEATURES RAPID FIRE (420-660) ========== */}
      <Sequence from={420} durationInFrames={240}>
        <FeaturesRapidFire frame={frame - 420} />
      </Sequence>

      {/* ========== SECTION 6: SOCIAL PROOF (660-840) ========== */}
      <Sequence from={660} durationInFrames={180}>
        <SocialProof frame={frame - 660} />
      </Sequence>

      {/* ========== SECTION 7: COMMUNITY HYPE (840-1050) ========== */}
      <Sequence from={840} durationInFrames={210}>
        <CommunityHype frame={frame - 840} />
      </Sequence>

      {/* ========== SECTION 8: FINAL CTA (1050-1350) ========== */}
      <Sequence from={1050} durationInFrames={300}>
        <FinalCTA frame={frame - 1050} />
      </Sequence>

      {/* Scan line effect for terminal aesthetic */}
      <ScanLines frame={frame} />
    </AbsoluteFill>
  );
}

// ============ SECTION COMPONENTS ============

function HookSection({ frame }: { frame: number }) {
  const text1Opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const text2Opacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" });
  const text3Scale = interpolate(frame, [45, 70], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(3)),
  });
  const text3Opacity = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(circle at center, #111 0%, ${colors.bg} 70%)`,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 32,
            color: colors.dim,
            letterSpacing: "0.3em",
            marginBottom: 20,
            opacity: text1Opacity,
          }}
        >
          YOU BOUGHT A MEMECOIN
        </p>
        <p
          style={{
            fontSize: 32,
            color: colors.muted,
            letterSpacing: "0.2em",
            marginBottom: 40,
            opacity: text2Opacity,
          }}
        >
          BUT DO YOU KNOW...
        </p>
        <GlowText
          intensity={40}
          style={{
            fontSize: 90,
            fontWeight: 700,
            display: "block",
            opacity: text3Opacity,
            transform: `scale(${text3Scale})`,
          }}
        >
          HOW FAR YOU ARE
          <br />
          FROM MAKING IT?
        </GlowText>
      </div>
    </AbsoluteFill>
  );
}

function ProblemSection({ frame }: { frame: number }) {
  const problems = [
    "No idea what price you bought at",
    "Can't calculate your potential gains",
    "Don't know when to take profits",
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <div>
        {problems.map((problem, i) => {
          const delay = i * 25;
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(frame, [delay, delay + 20], [-100, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginBottom: 30,
                opacity,
                transform: `translateX(${x}px)`,
              }}
            >
              <span style={{ fontSize: 40, color: colors.negative }}>✗</span>
              <span style={{ fontSize: 36, color: colors.muted }}>{problem}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function SolutionReveal({ frame }: { frame: number }) {
  const logoScale = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2.5)),
  });
  const logoOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flash effect on reveal
  const flashOpacity = interpolate(frame, [20, 25, 35], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(circle at center, #1a1a1a 0%, ${colors.bg} 70%)`,
      }}
    >
      {/* Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: colors.white,
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 24,
            color: colors.dim,
            letterSpacing: "0.3em",
            marginBottom: 30,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          INTRODUCING
        </p>

        <GlowText
          intensity={50}
          pulseSpeed={40}
          style={{
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: "0.08em",
            display: "block",
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          GIGACHAD
        </GlowText>

        <p
          style={{
            fontSize: 22,
            color: colors.muted,
            letterSpacing: "0.2em",
            marginTop: 30,
            opacity: taglineOpacity,
          }}
        >
          THE ULTIMATE SOLANA MEME DASHBOARD
        </p>
      </div>
    </AbsoluteFill>
  );
}

function MultiplierShowcase({ frame }: { frame: number }) {
  const multiplierValue = interpolate(frame, [30, 100], [1, 33], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const glowIntensity = interpolate(multiplierValue, [1, 33], [10, 60], {
    extrapolateRight: "clamp",
  });

  const pulseScale = frame > 100
    ? interpolate(frame % 20, [0, 10, 20], [1, 1.03, 1])
    : 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(circle at center, #0f0f0f 0%, ${colors.bg} 60%)`,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 20,
            color: colors.dim,
            letterSpacing: "0.3em",
            marginBottom: 20,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          SEE YOUR MULTIPLIER TO $1 BILLION
        </p>

        <div style={{ transform: `scale(${pulseScale})` }}>
          <p
            style={{
              fontSize: 220,
              fontWeight: 700,
              lineHeight: 0.9,
              color: colors.white,
              textShadow: `
                0 0 ${glowIntensity}px ${colors.white},
                0 0 ${glowIntensity * 2}px rgba(255,255,255,0.5),
                0 0 ${glowIntensity * 3}px rgba(255,255,255,0.3)
              `,
            }}
          >
            x{multiplierValue >= 100 ? Math.round(multiplierValue) : multiplierValue.toFixed(1)}
          </p>
        </div>

        <p
          style={{
            fontSize: 18,
            color: colors.positive,
            letterSpacing: "0.15em",
            marginTop: 30,
            opacity: interpolate(frame, [110, 130], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          REAL-TIME • LIVE DATA • ALWAYS ACCURATE
        </p>
      </div>
    </AbsoluteFill>
  );
}

function FeaturesRapidFire({ frame }: { frame: number }) {
  const features = [
    { icon: "🧮", title: "GAINS CALCULATOR", desc: "Project your wealth at any market cap", duration: 55 },
    { icon: "📊", title: "WALLET ANALYSIS", desc: "See your entry price & unrealized gains", duration: 55 },
    { icon: "🎮", title: "CLICKER GAME", desc: "Click, upgrade perks, climb leaderboards", duration: 55 },
    { icon: "📈", title: "LIVE STATS", desc: "Price, volume, holders - all in one place", duration: 55 },
  ];

  let accumulatedFrame = 0;

  return (
    <AbsoluteFill>
      {features.map((feature, i) => {
        const startFrame = accumulatedFrame;
        const endFrame = startFrame + feature.duration;
        accumulatedFrame = endFrame + 5; // Small gap

        const isVisible = frame >= startFrame && frame < endFrame;
        if (!isVisible) return null;

        const localFrame = frame - startFrame;
        const enterScale = interpolate(localFrame, [0, 15], [0.5, 1], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(2)),
        });
        const enterOpacity = interpolate(localFrame, [0, 10], [0, 1], {
          extrapolateRight: "clamp",
        });
        const exitOpacity = interpolate(localFrame, [feature.duration - 10, feature.duration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <AbsoluteFill
            key={i}
            style={{
              justifyContent: "center",
              alignItems: "center",
              background: i % 2 === 0
                ? `linear-gradient(135deg, #0a0a0a 0%, #111 100%)`
                : `linear-gradient(225deg, #0a0a0a 0%, #111 100%)`,
              opacity: enterOpacity * exitOpacity,
              transform: `scale(${enterScale})`,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: 100,
                  display: "block",
                  marginBottom: 30,
                }}
              >
                {feature.icon}
              </span>
              <GlowText
                intensity={25}
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                {feature.title}
              </GlowText>
              <p
                style={{
                  fontSize: 24,
                  color: colors.muted,
                  letterSpacing: "0.1em",
                }}
              >
                {feature.desc}
              </p>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
}

function SocialProof({ frame }: { frame: number }) {
  const stats = [
    { value: "30M+", label: "MARKET CAP", color: colors.white },
    { value: "12K+", label: "HOLDERS", color: colors.positive },
    { value: "x33", label: "TO $1B", color: colors.purple },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div style={{ textAlign: "center", width: "100%" }}>
        <p
          style={{
            fontSize: 20,
            color: colors.dim,
            letterSpacing: "0.3em",
            marginBottom: 60,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          GIGACHAD BY THE NUMBERS
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 100,
          }}
        >
          {stats.map((stat, i) => {
            const delay = 30 + i * 25;
            const scale = interpolate(frame, [delay, delay + 20], [0.5, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.back(2)),
            });
            const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  opacity,
                  transform: `scale(${scale})`,
                }}
              >
                <p
                  style={{
                    fontSize: 80,
                    fontWeight: 700,
                    color: stat.color,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: colors.dim,
                    letterSpacing: "0.2em",
                    marginTop: 16,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <p
          style={{
            fontSize: 28,
            color: colors.white,
            marginTop: 80,
            opacity: interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Join the fastest-growing community on Solana
        </p>
      </div>
    </AbsoluteFill>
  );
}

function CommunityHype({ frame }: { frame: number }) {
  const words = ["TRACK", "CALCULATE", "CLICK", "COMPETE", "DOMINATE"];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(circle at center, #111 0%, ${colors.bg} 70%)`,
      }}
    >
      {/* Rapid word flash */}
      {words.map((word, i) => {
        const wordStart = i * 35;
        const wordEnd = wordStart + 35;
        const isVisible = frame >= wordStart && frame < wordEnd;

        if (!isVisible) return null;

        const localFrame = frame - wordStart;
        const scale = interpolate(localFrame, [0, 10], [0.3, 1], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(3)),
        });

        return (
          <GlowText
            key={word}
            intensity={35}
            style={{
              fontSize: 140,
              fontWeight: 700,
              transform: `scale(${scale})`,
            }}
          >
            {word}
          </GlowText>
        );
      })}

      {/* Final message */}
      {frame >= 175 && (
        <div
          style={{
            textAlign: "center",
            opacity: interpolate(frame, [175, 195], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(frame, [175, 200], [0.8, 1], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.back(1.5)),
            })})`,
          }}
        >
          <GlowText
            intensity={40}
            style={{
              fontSize: 80,
              fontWeight: 700,
              display: "block",
            }}
          >
            BE A CHAD
          </GlowText>
        </div>
      )}
    </AbsoluteFill>
  );
}

function FinalCTA({ frame }: { frame: number }) {
  const bgPulse = interpolate(frame % 60, [0, 30, 60], [0.8, 1, 0.8]);

  // Countdown effect
  const countdownNumbers = ["3", "2", "1", "GO"];
  const showCountdown = frame < 120;

  // Main CTA appears after countdown
  const ctaVisible = frame >= 120;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(circle at center, rgba(167, 139, 250, ${0.1 * bgPulse}) 0%, ${colors.bg} 70%)`,
      }}
    >
      {/* Countdown */}
      {showCountdown && countdownNumbers.map((num, i) => {
        const numStart = i * 30;
        const numEnd = numStart + 30;
        const isVisible = frame >= numStart && frame < numEnd;

        if (!isVisible) return null;

        const localFrame = frame - numStart;
        const scale = interpolate(localFrame, [0, 8, 25], [0.3, 1.2, 0.8], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(localFrame, [0, 5, 20, 30], [0, 1, 1, 0], {
          extrapolateRight: "clamp",
        });

        return (
          <GlowText
            key={num}
            intensity={num === "GO" ? 60 : 30}
            color={num === "GO" ? colors.positive : colors.white}
            glowColor={num === "GO" ? colors.positive : colors.white}
            style={{
              fontSize: num === "GO" ? 200 : 250,
              fontWeight: 700,
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            {num}
          </GlowText>
        );
      })}

      {/* Main CTA */}
      {ctaVisible && (
        <div
          style={{
            textAlign: "center",
            opacity: interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <p
            style={{
              fontSize: 28,
              color: colors.muted,
              letterSpacing: "0.2em",
              marginBottom: 30,
            }}
          >
            YOUR GAINS AWAIT
          </p>

          <GlowText
            intensity={50}
            pulseSpeed={30}
            style={{
              fontSize: 100,
              fontWeight: 700,
              display: "block",
              marginBottom: 50,
            }}
          >
            GIGACHAD.TRADE
          </GlowText>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 30,
              opacity: interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div
              style={{
                backgroundColor: colors.white,
                color: colors.black,
                padding: "20px 50px",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              CALCULATE GAINS
            </div>
            <div
              style={{
                backgroundColor: "transparent",
                color: colors.white,
                padding: "20px 50px",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.1em",
                border: `2px solid ${colors.white}`,
              }}
            >
              PLAY NOW
            </div>
          </div>

          {/* Social links hint */}
          <p
            style={{
              marginTop: 60,
              fontSize: 16,
              color: colors.dim,
              letterSpacing: "0.15em",
              opacity: interpolate(frame, [240, 270], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            FOLLOW @GIGACHAD ON 𝕏 FOR UPDATES
          </p>

          {/* Final tagline */}
          <p
            style={{
              marginTop: 30,
              fontSize: 24,
              color: colors.positive,
              fontWeight: 700,
              letterSpacing: "0.1em",
              opacity: interpolate(frame, [260, 290], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            WE'RE ALL GONNA MAKE IT 🚀
          </p>
        </div>
      )}
    </AbsoluteFill>
  );
}

function ScanLines({ frame }: { frame: number }) {
  // Subtle scan line effect for terminal aesthetic
  const scanPosition = (frame * 3) % 1200;

  return (
    <>
      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          top: scanPosition,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Subtle noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
