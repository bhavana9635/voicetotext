"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Copy, Trash2, Download, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VoiceToTextApp() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setIsProcessing(true)

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

        // Convert blob to base64
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(",")[1]

          try {
            const response = await fetch("/api/transcribe", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ audio: base64Audio }),
            })

            const data = await response.json()

            if (data.transcript) {
              setTranscript((prev) => (prev ? prev + " " + data.transcript : data.transcript))
              toast({
                title: "Transcription Complete",
                description: "Your audio has been transcribed",
              })
            } else {
              toast({
                title: "No Speech Detected",
                description: "Please try speaking more clearly",
                variant: "destructive",
              })
            }
          } catch (error) {
            console.error(" Error transcribing:", error)
            toast({
              title: "Transcription Failed",
              description: "Failed to transcribe audio",
              variant: "destructive",
            })
          } finally {
            setIsProcessing(false)
          }
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)

      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      })
    } catch (error) {
      console.error(" Error accessing microphone:", error)
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice input",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      toast({
        title: "Recording Stopped",
        description: "Processing your audio...",
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript)
    toast({
      title: "Copied!",
      description: "Transcript copied to clipboard",
    })
  }

  const clearTranscript = () => {
    setTranscript("")
    toast({
      title: "Cleared",
      description: "Transcript cleared",
    })
  }

  const downloadTranscript = () => {
    const element = document.createElement("a")
    const file = new Blob([transcript], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `transcript-${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast({
      title: "Downloaded",
      description: "Transcript saved as text file",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Mic className="size-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Voice Flow</h1>
              <p className="text-xs text-muted-foreground">Powered by Deepgram</p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <div
              className={`size-2 rounded-full ${
                isRecording
                  ? "bg-red-500 animate-pulse"
                  : isProcessing
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-muted-foreground"
              }`}
            />
            {isRecording ? "Recording" : isProcessing ? "Processing" : "Ready"}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mb-2">
            <Zap className="size-3 mr-1" />
            Powered by Deepgram AI
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">Voice to Text with AI</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Click the microphone button and start speaking. Your words will be transcribed with high accuracy using
            Deepgram AI.
          </p>
        </div>

        {/* Recording Control */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {isRecording && (
              <>
                <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping" />
                <div className="absolute inset-0 bg-red-500 rounded-full opacity-10 animate-pulse" />
              </>
            )}
            {isProcessing && <div className="absolute inset-0 bg-yellow-500 rounded-full opacity-10 animate-pulse" />}
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`size-24 rounded-full shadow-2xl transition-all duration-300 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 scale-110"
                  : isProcessing
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              }`}
            >
              {isRecording ? <MicOff className="size-10" /> : <Mic className="size-10" />}
            </Button>
          </div>
        </div>

        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground">
            {isRecording
              ? "Click to stop recording"
              : isProcessing
                ? "Processing audio..."
                : "Click to start recording"}
          </p>
        </div>

        {/* Transcript Display */}
        <Card className="bg-card border-border/50 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Transcription</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!transcript}>
                  <Copy className="size-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadTranscript} disabled={!transcript}>
                  <Download className="size-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={clearTranscript} disabled={!transcript}>
                  <Trash2 className="size-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="min-h-[300px] bg-background rounded-lg p-6 border border-border/50">
              {transcript ? (
                <p className="text-lg leading-relaxed">{transcript}</p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="size-16 bg-muted rounded-full flex items-center justify-center">
                    <Mic className="size-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">No transcription yet</p>
                    <p className="text-sm text-muted-foreground">Start recording to see your words appear here</p>
                  </div>
                </div>
              )}
            </div>

            {transcript && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{transcript.split(" ").filter(Boolean).length} words</Badge>
                <Badge variant="secondary">{transcript.length} characters</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: Zap,
              title: "AI Powered",
              description: "Advanced Deepgram AI for superior accuracy and understanding",
            },
            {
              icon: Mic,
              title: "High Quality",
              description: "Professional-grade transcription with smart formatting",
            },
            {
              icon: Copy,
              title: "Easy Export",
              description: "Copy or download your transcripts with one click",
            },
          ].map((feature, i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center space-y-3">
                <div className="size-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
                  <feature.icon className="size-6 text-accent-foreground" />
                </div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-accent/50 border-border/50 mt-12">
          <CardContent className="p-6">
            <p className="text-sm text-center text-accent-foreground/80">
              <strong>Powered by Deepgram:</strong> This app uses Deepgram's Nova-2 model and made by <strong>Bhavana</strong>.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
