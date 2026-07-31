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
import { MotionConfig } from "framer-motion";

export default function App() {
  return (
    // reducedMotion="user" makes every framer-motion animation in the tree honour
    // prefers-reduced-motion: transform/layout animations are dropped, opacity is
    // kept. One wrapper instead of a check in each component.
    <MotionConfig reducedMotion="user">
      {/* No ambient backdrop. The page is a sheet — its ground is flat and the
          structure comes from rules, not from atmosphere. See DESIGN.md. */}
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

      {/* Custom AI assistant — draggable robot launcher, bottom-right */}
      <ChatWidget />

      {/* Vercel Web Analytics*/}
      <Analytics />
    </MotionConfig>
  );
}
