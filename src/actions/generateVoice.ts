"use server";

import { GoogleGenAI } from "@google/genai";
// We don't need 'mime' import for the basic logic if we handle the parsing manually as shown below,
// but keeping your logic structure for safety.
// If you strictly followed the install, you can import it, but usually strictly typed node doesn't like 'mime' without @types.
// To be safe and dependency-free for the specific helper, I will include the specific parsing logic needed.

const apiKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

export async function generateVoiceAction(text: string) {
  if (!apiKey) {
    return { success: false, error: "API Key missing" };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Config: Use 'Zephyr' or any other voice you like
    const config = {
      temperature: 1,
      responseModalities: ["audio"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: "Zephyr",
          },
        },
      },
    };

    const model = "gemini-2.5-flash-preview-tts"; // Use Flash for speed, or 'gemini-2.5-pro-preview-tts' if you have access

    const contents = [
      {
        role: "user",
        parts: [{ text: text }],
      },
    ];

    // Generate the audio stream
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let combinedBuffer = Buffer.alloc(0);
    let mimeType = "";

    // Collect all chunks
    for await (const chunk of response) {
      const part = chunk.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData) {
        const chunkBuffer = Buffer.from(part.inlineData.data || "", "base64");
        combinedBuffer = Buffer.concat([combinedBuffer, chunkBuffer]);

        // Capture mimeType from the first chunk that has it
        if (!mimeType && part.inlineData.mimeType) {
          mimeType = part.inlineData.mimeType;
        }
      }
    }

    if (combinedBuffer.length === 0) {
      throw new Error("No audio data received from Gemini");
    }

    // Convert Raw PCM to WAV
    // If Gemini returns raw L16 (PCM), we MUST add a WAV header for the browser to play it.
    let finalAudioBuffer = combinedBuffer;
    if (mimeType.includes("L16") || !mimeType) {
      // Default to L16;rate=24000 if mime is missing, which is standard for Gemini TTS
      const effectiveMime = mimeType || "audio/L16;rate=24000";
      finalAudioBuffer = convertToWav(combinedBuffer, effectiveMime);
    }

    // Convert to Base64 for the frontend
    const base64Audio = finalAudioBuffer.toString("base64");
    const audioUri = `data:audio/wav;base64,${base64Audio}`;

    return { success: true, audio: audioUri };
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return { success: false, error: "Failed to generate speech" };
  }
}

// --- HELPER FUNCTIONS (Adapted from your snippet) ---

interface WavConversionOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

function convertToWav(pcmData: Buffer, mimeType: string) {
  const options = parseMimeType(mimeType);
  const wavHeader = createWavHeader(pcmData.length, options);
  return Buffer.concat([wavHeader, pcmData]);
}

function parseMimeType(mimeType: string) {
  // Example: "audio/L16;rate=24000"
  const parts = mimeType.split(";").map((s) => s.trim());
  const fileTypePart = parts[0]; // "audio/L16"
  const [_, format] = fileTypePart.split("/");

  const options: WavConversionOptions = {
    numChannels: 1,
    sampleRate: 24000, // Default fallback
    bitsPerSample: 16, // Default fallback
  };

  // Parse Rate
  for (const param of parts.slice(1)) {
    const [key, value] = param.split("=");
    if (key === "rate") {
      options.sampleRate = parseInt(value, 10);
    }
  }

  return options;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
  const { numChannels, sampleRate, bitsPerSample } = options;

  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}
