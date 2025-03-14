import { LandingHero } from "@/components/landing-hero"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHero />
      <Features />
      <Footer />
    </div>
  )
}

