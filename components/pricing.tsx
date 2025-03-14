"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    price: "$0",
    description: "Basic translation for casual users.",
    features: [
      "500 text translations per month",
      "100 voice translations per month",
      "Access to 20 languages",
      "Standard translation quality",
      "Translation history (7 days)",
    ],
    cta: "Start for free",
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    price: "$9.99",
    description: "Perfect for frequent travelers and language learners.",
    features: [
      "Unlimited text translations",
      "500 voice translations per month",
      "Access to all 100+ languages",
      "Enhanced translation quality",
      "Translation history (unlimited)",
      "Offline mode for common phrases",
      "Priority support",
    ],
    cta: "Get started",
    mostPopular: true,
  },
  {
    name: "Business",
    id: "tier-business",
    price: "$29.99",
    description: "For teams and businesses with global reach.",
    features: [
      "Everything in Pro",
      "Unlimited voice translations",
      "Team accounts (up to 10 users)",
      "API access",
      "Custom terminology management",
      "Advanced analytics",
      "Dedicated account manager",
      "99.9% uptime SLA",
    ],
    cta: "Contact sales",
    mostPopular: false,
  },
]

export function Pricing() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div id="pricing" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Choose the right plan for you</p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Whether you're a casual user, frequent traveler, or business with global needs, we have a plan that fits.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              className={`relative rounded-2xl p-8 ${
                tier.mostPopular
                  ? "bg-primary text-primary-foreground shadow-xl scale-105 z-10"
                  : "bg-card text-card-foreground border sm:mx-8 lg:mx-0"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {tier.mostPopular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary-foreground px-3 py-1 text-center text-xs font-medium text-primary">
                  Most popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-semibold leading-8">{tier.name}</h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                  <span className="text-sm font-semibold">/month</span>
                </p>
                <p
                  className={`mt-6 text-sm leading-6 ${
                    tier.mostPopular ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {tier.description}
                </p>
              </div>
              <div>
                <ul
                  className={`space-y-3 text-sm leading-6 ${
                    tier.mostPopular ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={`h-5 w-5 flex-none ${tier.mostPopular ? "text-primary-foreground" : "text-primary"}`}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full ${
                    tier.mostPopular ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""
                  }`}
                  variant={tier.mostPopular ? "secondary" : "default"}
                  onClick={() => {
                    if (session) {
                      if (tier.id === "tier-business") {
                        router.push("/contact")
                      } else {
                        router.push("/subscribe")
                      }
                    } else {
                      router.push("/sign-in")
                    }
                  }}
                >
                  {tier.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

