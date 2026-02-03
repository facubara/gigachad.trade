import { Composition } from "remotion";

// Demo compositions
import {
  MultiplierAnimation,
  ClickerGameplay,
  CalculatorProjections,
  LeaderboardShowcase,
  WalletAnalysis,
  PerkUpgrades,
  ProgressMilestones,
  ShareFunctionality,
  TransactionHistory,
  DataGridStats,
} from "./compositions/demo";

// Launch compositions
import {
  WhatIsGigachad,
  HowToUseCalculator,
  JoinTheClicker,
  TrackYourGains,
  HypeVideo,
  RoadToOneBillion,
  CommunityCall,
  PerkShowcase,
  LeaderboardChallenge,
  TokenomicsExplainer,
  TwitterLaunchPromo,
  PremiumPromo,
} from "./compositions/launch";

const FPS = 30;

// Standard dimensions
const LANDSCAPE = { width: 1920, height: 1080 }; // 16:9
const PORTRAIT = { width: 1080, height: 1920 }; // 9:16

export function RemotionRoot() {
  return (
    <>
      {/* ==================== DEMO VIDEOS ==================== */}

      {/* Demo 1: MultiplierAnimation - 10 seconds */}
      <Composition
        id="MultiplierAnimation"
        component={MultiplierAnimation}
        durationInFrames={10 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Demo 2: ClickerGameplay - 15 seconds */}
      <Composition
        id="ClickerGameplay"
        component={ClickerGameplay}
        durationInFrames={15 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Demo 3: CalculatorProjections - 12 seconds */}
      <Composition
        id="CalculatorProjections"
        component={CalculatorProjections}
        durationInFrames={12 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Demo 4: LeaderboardShowcase - 8 seconds */}
      <Composition
        id="LeaderboardShowcase"
        component={LeaderboardShowcase}
        durationInFrames={8 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Demo 5: WalletAnalysis - 10 seconds */}
      <Composition
        id="WalletAnalysis"
        component={WalletAnalysis}
        durationInFrames={10 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Demo 6: PerkUpgrades - 12 seconds */}
      <Composition
        id="PerkUpgrades"
        component={PerkUpgrades}
        durationInFrames={12 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Demo 7: ProgressMilestones - 10 seconds */}
      <Composition
        id="ProgressMilestones"
        component={ProgressMilestones}
        durationInFrames={10 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Demo 8: ShareFunctionality - 8 seconds */}
      <Composition
        id="ShareFunctionality"
        component={ShareFunctionality}
        durationInFrames={8 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Demo 9: TransactionHistory - 10 seconds */}
      <Composition
        id="TransactionHistory"
        component={TransactionHistory}
        durationInFrames={10 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Demo 10: DataGridStats - 8 seconds */}
      <Composition
        id="DataGridStats"
        component={DataGridStats}
        durationInFrames={8 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* ==================== LAUNCH VIDEOS ==================== */}

      {/* Launch 1: WhatIsGigachad - 30 seconds (16:9) */}
      <Composition
        id="WhatIsGigachad"
        component={WhatIsGigachad}
        durationInFrames={30 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Launch 2: HowToUseCalculator - 45 seconds (16:9) */}
      <Composition
        id="HowToUseCalculator"
        component={HowToUseCalculator}
        durationInFrames={45 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Launch 3: JoinTheClicker - 20 seconds (9:16 vertical) */}
      <Composition
        id="JoinTheClicker"
        component={JoinTheClicker}
        durationInFrames={20 * FPS}
        fps={FPS}
        {...PORTRAIT}
      />

      {/* Launch 4: TrackYourGains - 25 seconds (16:9) */}
      <Composition
        id="TrackYourGains"
        component={TrackYourGains}
        durationInFrames={25 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Launch 5: HypeVideo - 15 seconds (16:9) */}
      <Composition
        id="HypeVideo"
        component={HypeVideo}
        durationInFrames={15 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Launch 6: RoadToOneBillion - 30 seconds (16:9) */}
      <Composition
        id="RoadToOneBillion"
        component={RoadToOneBillion}
        durationInFrames={30 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Launch 7: CommunityCall - 20 seconds (16:9) */}
      <Composition
        id="CommunityCall"
        component={CommunityCall}
        durationInFrames={20 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Launch 8: PerkShowcase - 25 seconds (9:16 vertical) */}
      <Composition
        id="PerkShowcase"
        component={PerkShowcase}
        durationInFrames={25 * FPS}
        fps={FPS}
        {...PORTRAIT}
      />

      {/* Launch 9: LeaderboardChallenge - 20 seconds (16:9) */}
      <Composition
        id="LeaderboardChallenge"
        component={LeaderboardChallenge}
        durationInFrames={20 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* Launch 10: TokenomicsExplainer - 30 seconds (16:9) */}
      <Composition
        id="TokenomicsExplainer"
        component={TokenomicsExplainer}
        durationInFrames={30 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* ==================== PROMO VIDEOS ==================== */}

      {/* TwitterLaunchPromo - 45 seconds (16:9) - THE MAIN LAUNCH VIDEO */}
      <Composition
        id="TwitterLaunchPromo"
        component={TwitterLaunchPromo}
        durationInFrames={45 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />

      {/* PremiumPromo - 30 seconds (16:9) - BRUTALIST PRODUCT VIDEO */}
      <Composition
        id="PremiumPromo"
        component={PremiumPromo}
        durationInFrames={30 * FPS}
        fps={FPS}
        {...LANDSCAPE}
      />
    </>
  );
}
