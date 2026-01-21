import Link from "next/link";
import { TokenDashboard } from "@/components/TokenDashboard";
import { TippingModule } from "@/components/TippingModule";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4">
          GIGACHAD
        </h1>
        <p className="text-lg md:text-xl text-[var(--muted)] uppercase tracking-widest">
          The Path to $1B
        </p>
      </div>

      {/* Token Dashboard */}
      <TokenDashboard />

      {/* Tipping Module */}
      <div className="mt-16 w-full">
        <TippingModule />
      </div>

      {/* Clicker CTA */}
      <div className="mt-16">
        <Link
          href="/clicker"
          className="inline-block px-8 py-4 bg-[var(--accent)] text-black font-bold text-lg uppercase tracking-wider rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Enter Giga Clicker
        </Link>
      </div>
    </main>
  );
}
