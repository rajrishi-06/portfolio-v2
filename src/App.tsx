import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { NowBuilding } from "@/components/NowBuilding";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Journey } from "@/components/Journey";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      {/* Global ambient backdrop — subtle depth over the deep-dark base */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-22%] h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(29,111,255,0.10),transparent)]" />
        <div className="absolute bottom-[-12%] right-[-8%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.08),transparent)]" />
        <div className="absolute bottom-[6%] left-[-10%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.05),transparent)]" />
        <div className="bg-noise absolute inset-0 opacity-[0.025] mix-blend-soft-light" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <NowBuilding />
        <Projects />
        <About />
        <Journey />
        <Contact />
      </main>
      <Footer />

      {/* Custom AI assistant — quiet terminal launcher, bottom-right */}
      <ChatWidget />

      {/* Vercel Web Analytics*/}
      <Analytics />
    </>
  );
}
