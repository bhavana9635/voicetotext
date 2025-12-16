import type { NextRequest } from "next/server"

const DEEPGRAM_API_KEY = "c2c615fc696e484ca26498876a643fa27f4eb5da"

export async function POST(request: NextRequest) {
  try {
    const { audio } = await request.json()

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audio, "base64")

    // Call Deepgram API
    const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true", {
      method: "POST",
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/webm",
      },
      body: audioBuffer,
    })

    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.statusText}`)
    }

    const data = await response.json()
    const transcript = data.results?.channels[0]?.alternatives[0]?.transcript || ""

    return Response.json({ transcript })
  } catch (error) {
    console.error("[v0] Transcription error:", error)
    return Response.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
