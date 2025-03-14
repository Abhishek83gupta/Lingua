"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"

export function LandingHero() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-background to-background/80">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-36">
        <div className="text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Break language barriers in real-time
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Translate text and voice across multiple languages instantly with our AI-powered translation platform.
            Perfect for travelers, language learners, and global businesses.
          </motion.p>
          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={() => {
                if (session) {
                  router.push("/translate")
                } else {
                  router.push("/sign-in")
                }
              }}
            >
              Start Translating
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/#features")}>
              Learn more
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

