"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeftRight, Copy, Mic, MicOff, Volume2 } from "lucide-react"
import { motion } from "framer-motion"

// This would come from your API or database
const languages = [
  { code: "auto", name: "Auto Detect" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
]

// Define SpeechRecognition and SpeechRecognitionEvent types
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechRecognitionEvent: any
  }
}

export function TranslationInterface() {
  const { toast } = useToast()
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeTab, setActiveTab] = useState("text")

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Mock translation function - in a real app, this would call the Gemini API
  const translateText = async (text: string, source: string, target: string) => {
    setIsTranslating(true)

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLanguage: source,
          targetLanguage: target,
          autoDetect: source === "auto",
        }),
      })

      if (!response.ok) {
        throw new Error("Translation failed")
      }

      const data = await response.json()
      setTranslatedText(data.translatedText)

      // If language was auto-detected, update the source language
      if (data.detectedLanguage && source === "auto") {
        setSourceLanguage(data.detectedLanguage)
      }
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "There was an error translating your text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  const startListening = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Log the devices to see what devices are available
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("Available devices:", devices);
  
      const audioDevice = devices.find((device) => device.kind === "audioinput");
  
      if (!audioDevice) {
        throw new Error("No audio input device found");
      }
  
      // Request the microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: audioDevice.deviceId },
      });
  
      // Proceed with Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.lang = sourceLanguage;
      recognition.continuous = true;
      recognition.interimResults = true;
  
      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";
  
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
  
        setSourceText(finalTranscript || interimTranscript);
      };
  
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast({
          title: "Speech recognition error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };
  
      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };
  
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error("Microphone permission error", error);
      toast({
        title: "Microphone Permission Denied",
        description: error.message || "Please allow microphone access in your browser settings.",
        variant: "destructive",
      });
    }
  };
  
  
  // const startListening = () => {
  //   if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
  //     toast({
  //       title: "Speech recognition not supported",
  //       description: "Your browser doesn't support speech recognition. Try using Chrome.",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  //   recognitionRef.current = new SpeechRecognition()

  //   const recognition = recognitionRef.current
  //   recognition.lang = sourceLanguage
  //   recognition.continuous = true
  //   recognition.interimResults = true

  //   recognition.onresult = (event: any) => {
  //     let interimTranscript = ""
  //     let finalTranscript = ""

  //     for (let i = event.resultIndex; i < event.results.length; ++i) {
  //       if (event.results[i].isFinal) {
  //         finalTranscript += event.results[i][0].transcript
  //       } else {
  //         interimTranscript += event.results[i][0].transcript
  //       }
  //     }

  //     setSourceText(finalTranscript || interimTranscript)
  //   }

  //   recognition.onerror = (event: any) => {
  //     console.error("Speech recognition error", event.error)
  //     setIsListening(false)
  //     toast({
  //       title: "Speech recognition error",
  //       description: `Error: ${event.error}`,
  //       variant: "destructive",
  //     })
  //   }

  //   recognition.onend = () => {
  //     if (isListening) {
  //       recognition.start()
  //     }
  //   }

  //   recognition.start()
  //   setIsListening(true)
  // }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
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

  useEffect(() => {
    // Clean up speech recognition on component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Translate</CardTitle>
        <CardDescription>Translate text or voice between languages using AI-powered translation</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Translation</TabsTrigger>
            <TabsTrigger value="voice">Voice Translation</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Source Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Enter text to translate"
                  className="min-h-[200px]"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakText(sourceText, sourceLanguage)}
                    disabled={!sourceText}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Button variant="ghost" size="icon" onClick={handleSwapLanguages} className="rounded-full">
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Target Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Translation will appear here"
                  className="min-h-[200px]"
                  value={translatedText}
                  readOnly
                />
                <div className="flex justify-end mt-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakText(translatedText, targetLanguage)}
                    disabled={!translatedText}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyText(translatedText)}
                    disabled={!translatedText}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="voice" className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-6 py-8">
              <div className="flex gap-4 w-full max-w-md justify-center">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="I'm speaking" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Translate to" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <motion.div
                className={`relative w-32 h-32 rounded-full flex items-center justify-center ${
                  isListening ? "bg-primary/20" : "bg-muted"
                }`}
                animate={{
                  scale: isListening ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  repeat: isListening ? Number.POSITIVE_INFINITY : 0,
                  duration: 1.5,
                }}
              >
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="icon"
                  className="w-20 h-20 rounded-full"
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </Button>
              </motion.div>

              <div className="text-center">
                {isListening ? (
                  <p className="text-primary animate-pulse">Listening...</p>
                ) : (
                  <p className="text-muted-foreground">Press the microphone to start speaking</p>
                )}
              </div>

              {sourceText && (
                <div className="w-full max-w-2xl mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">You said:</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{sourceText}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {translatedText && (
                <div className="w-full max-w-2xl mt-4">
                  <Card className="border-primary/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Translation:</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{translatedText}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-0">
                      <Button variant="outline" size="sm" onClick={() => speakText(translatedText, targetLanguage)}>
                        <Volume2 className="h-4 w-4 mr-2" />
                        Listen
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleCopyText(translatedText)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => translateText(sourceText, sourceLanguage, targetLanguage)}
          disabled={isTranslating || !sourceText}
        >
          {isTranslating ? "Translating..." : "Translate"}
        </Button>
      </CardFooter>
    </Card>
  )
}