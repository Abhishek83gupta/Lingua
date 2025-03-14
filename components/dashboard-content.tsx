"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, Star, Volume2 } from "lucide-react"
import { format } from "date-fns"

// Language codes to names mapping
const languageNames: Record<string, string> = {
  auto: "Auto Detect",
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  hi: "Hindi",
}

type Translation = {
  id: string
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  createdAt: string | Date
  isFavorite: boolean
}

export function DashboardContent() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [translations, setTranslations] = useState<Translation[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch translations from API
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/translations")
        if (!response.ok) {
          throw new Error("Failed to fetch translations")
        }
        const data = await response.json()

        // Convert date strings to Date objects
        const formattedData = data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))

        setTranslations(formattedData)
      } catch (error) {
        console.error("Error fetching translations:", error)
        toast({
          title: "Error",
          description: "Failed to load translation history",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchTranslations()
    }
  }, [session, toast])

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  const speakText = (text: string, lang: string) => {
    if (!("speechSynthesis" in window)) {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech. Try using Chrome.",
        variant: "destructive",
      })
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    window.speechSynthesis.speak(utterance)
  }

  const toggleFavorite = async (id: string) => {
    const currentTranslation = translations.find((t) => t.id === id)
    if (!currentTranslation) return

    // Optimistically update UI
    setTranslations(
      translations.map((translation) =>
        translation.id === id ? { ...translation, isFavorite: !translation.isFavorite } : translation,
      ),
    )

    try {
      const response = await fetch(`/api/translations/${id}/favorite`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFavorite: !currentTranslation.isFavorite,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update favorite status")
      }

      toast({
        title: "Updated",
        description: "Translation favorite status updated.",
      })
    } catch (error) {
      // Revert the optimistic update if the API call fails
      setTranslations(
        translations.map((translation) =>
          translation.id === id ? { ...translation, isFavorite: currentTranslation.isFavorite } : translation,
        ),
      )

      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      })
    }
  }

  const filteredTranslations = activeTab === "favorites" ? translations.filter((t) => t.isFavorite) : translations

  return (
    <Card>
      <CardHeader>
        <CardTitle>Translation History</CardTitle>
        <CardDescription>View and manage your recent translations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Translations</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading your translations...</div>
            ) : translations.length > 0 ? (
              <TranslationTable
                translations={filteredTranslations}
                handleCopyText={handleCopyText}
                speakText={speakText}
                toggleFavorite={toggleFavorite}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                You haven't made any translations yet. Try translating something!
              </div>
            )}
          </TabsContent>
          <TabsContent value="favorites">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading your translations...</div>
            ) : filteredTranslations.length > 0 ? (
              <TranslationTable
                translations={filteredTranslations}
                handleCopyText={handleCopyText}
                speakText={speakText}
                toggleFavorite={toggleFavorite}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                You haven't added any translations to favorites yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function TranslationTable({
  translations,
  handleCopyText,
  speakText,
  toggleFavorite,
}: {
  translations: Translation[]
  handleCopyText: (text: string) => void
  speakText: (text: string, lang: string) => void
  toggleFavorite: (id: string) => void
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Translation</TableHead>
            <TableHead>Languages</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {translations.map((translation) => (
            <TableRow key={translation.id}>
              <TableCell className="font-medium">{format(new Date(translation.createdAt), "MMM d, yyyy")}</TableCell>
              <TableCell className="max-w-[200px] truncate">{translation.sourceText}</TableCell>
              <TableCell className="max-w-[200px] truncate">{translation.translatedText}</TableCell>
              <TableCell>
                {languageNames[translation.sourceLanguage] || translation.sourceLanguage} →{" "}
                {languageNames[translation.targetLanguage] || translation.targetLanguage}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speakText(translation.translatedText, translation.targetLanguage)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyText(translation.translatedText)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleFavorite(translation.id)}>
                    {translation.isFavorite ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

