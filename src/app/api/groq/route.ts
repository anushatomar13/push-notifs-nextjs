import { NextResponse } from "next/server";
import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY; 

export async function GET() {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768", 
        messages: [{ role: "system", content: "generate a short quote of only 5 words without any additional information." }],
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const quote = response.data.choices?.[0]?.message?.content || "Stay positive and keep going!";
    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}
