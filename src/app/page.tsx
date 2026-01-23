import { TokenDashboard } from "@/components/TokenDashboard";
import { TippingModule } from "@/components/TippingModule";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Token Dashboard */}
      <TokenDashboard />

      {/* Tipping Section */}
      <section className="py-24 border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
          <TippingModule />
        </div>
      </section>

    </main>
  );
}
