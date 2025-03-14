import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function translateWithGemini(text: string, sourceLanguage: string, targetLanguage: string) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create a prompt for translation
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
    Only return the translated text without any explanations or additional content.
    
    Text to translate: "${text}"`

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const translatedText = response.text()

    return translatedText.trim()
  } catch (error) {
    console.error("Error translating with Gemini:", error)
    throw new Error("Translation failed")
  }
}

export async function detectLanguage(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Detect the language of the following text and return only the ISO 639-1 language code (e.g., 'en' for English, 'es' for Spanish, etc.).
    
    Text: "${text}"`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const languageCode = response.text().trim().toLowerCase()

    return languageCode
  } catch (error) {
    console.error("Error detecting language with Gemini:", error)
    throw new Error("Language detection failed")
  }
}