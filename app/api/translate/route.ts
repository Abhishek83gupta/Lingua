import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { translateWithGemini, detectLanguage } from "@/lib/gemini"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    const { text, sourceLanguage, targetLanguage, autoDetect = false } = await req.json()

    // Validate input
    if (!text || !targetLanguage) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // If autoDetect is true, detect the source language
    let actualSourceLanguage = sourceLanguage
    if (autoDetect) {
      actualSourceLanguage = await detectLanguage(text)
    }

    // Translate the text using Gemini API
    const translatedText = await translateWithGemini(text, actualSourceLanguage, targetLanguage)

    // Save translation to history if user is logged in
    if (session?.user?.id) {
      await prisma.translationHistory.create({
        data: {
          userId: session.user.id,
          sourceText: text,
          translatedText,
          sourceLanguage: actualSourceLanguage,
          targetLanguage,
        },
      })
    }

    return NextResponse.json({
      translatedText,
      detectedLanguage: autoDetect ? actualSourceLanguage : null,
    })
  } catch (error) {
    console.error("Translation error:", error)
    console.log(error);
    return NextResponse.json({ message: "Something went wrong", error }, { status: 500 })
  }
}

