"use client"

import { TranslationInterface } from "@/components/translation-interface"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export default function TranslatePage() {

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Translation Tool</h1>
      <TranslationInterface />
    </div>
  )
}