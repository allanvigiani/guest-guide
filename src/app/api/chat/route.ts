import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages"
import { getPropertyByCode } from "@/domain/property/property.service"
import { buildChatPayload } from "@/domain/chat/chat.service"
import { aiClient } from "@/lib/ai"

export async function POST(request: NextRequest) {
  let body: { propertyCode?: unknown; messages?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { propertyCode, messages } = body

  if (
    typeof propertyCode !== "string" ||
    propertyCode.trim() === "" ||
    !Array.isArray(messages) ||
    messages.length === 0
  ) {
    return NextResponse.json(
      { error: "propertyCode (string) and messages (non-empty array) are required" },
      { status: 400 }
    )
  }

  const property = await getPropertyByCode(propertyCode.toUpperCase())

  const { stream: _, ...streamParams } = buildChatPayload(
    messages as MessageParam[],
    property,
    property.experiences
  )

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  try {
    const sdkStream = aiClient.messages.stream(streamParams)

    sdkStream.on("text", (chunk: string) => {
      writer.write(encoder.encode(chunk))
    })

    sdkStream.on("finalMessage", () => {
      writer.close()
    })

    sdkStream.on("error", (err: unknown) => {
      writer.abort(err)
    })
  } catch (err) {
    await writer.close()
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${err.message}` },
        { status: 502 }
      )
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
