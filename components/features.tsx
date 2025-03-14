"use client"

import { motion } from "framer-motion"
import { Mic, Globe, History, Sparkles, MessageSquare, Volume2 } from "lucide-react"

const features = [
  {
    name: "Text Translation",
    description: "Translate written text between 100+ languages with high accuracy powered by Google's Gemini AI.",
    icon: MessageSquare,
  },
  {
    name: "Voice Translation",
    description: "Speak in your language and get instant voice translations. Perfect for conversations on the go.",
    icon: Mic,
  },
  {
    name: "Audio Playback",
    description: "Listen to translations with natural-sounding text-to-speech in the target language.",
    icon: Volume2,
  },
  {
    name: "Translation History",
    description: "Access your past translations anytime. Save favorites for quick reference.",
    icon: History,
  },
  {
    name: "100+ Languages",
    description: "Support for over 100 languages covering 95% of the world's population.",
    icon: Globe,
  },
  {
    name: "AI-Powered",
    description: "Leveraging AI for context-aware, natural-sounding translations.",
    icon: Sparkles,
  },
]

export function Features() {
  return (
    <div id="features" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Powerful Translation</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for seamless translation
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform combines cutting-edge AI with an intuitive interface to make translation effortless across text
            and voice.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="relative pl-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

