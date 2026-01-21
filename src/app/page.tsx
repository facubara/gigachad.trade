import Image from "next/image";
import Link from "next/link";
import { TokenDashboard } from "@/components/TokenDashboard";
import { TippingModule } from "@/components/TippingModule";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16">
        <Image
          src="/definition.png"
          alt="Giga - Of or referring to one billion"
          width={600}
          height={300}
          priority
          className="w-full max-w-xl md:max-w-2xl"
        />
      </div>

      {/* Token Dashboard */}
      <TokenDashboard />

      {/* Tipping Module */}
      <div className="mt-16 w-full">
        <TippingModule />
      </div>

      {/* CTAs */}
      <div className="mt-16 flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/clicker"
          className="inline-block px-8 py-4 bg-[var(--accent)] text-black font-bold text-lg uppercase tracking-wider rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Enter Giga Clicker
        </Link>
        <Link
          href="/calculator"
          className="inline-block px-8 py-4 border-2 border-[var(--accent)] text-[var(--accent)] font-bold text-lg uppercase tracking-wider rounded-lg hover:bg-[var(--accent)] hover:text-black transition-colors"
        >
          Portfolio Calculator
        </Link>
      </div>
    </main>
  );
}
