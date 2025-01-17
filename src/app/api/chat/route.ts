import { NextResponse } from "next/server";
import axios from "axios";

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is not set");
}

const RIZZ_SYSTEM_PROMPT = `You are Rizz GPT, a romantic conversation assistant developed by 6hive.ee.
You specialize in providing charming, concise, and natural responses for friendly or romantic chats.

When you receive a message or a screenshot (e.g. from social media):
1. Analyze its content and craft a response suitable for the conversation's tone.
2. Provide only one high-quality response.
3. If necessary, include a very brief explanation of why this response is appropriate.
4. Ensure the response is under 60 characters.
5. Feel free to use emojis, but sparingly and appropriately.

Respond with a **valid JSON object only**, without any additional text or formatting. Do not include code block markers (\`\`\` or similar).

The JSON response must strictly follow this format:
{
  "text": "The suggested response",
  "explanation": "Why this response is good (optional)"
}`;




async function sendRequestToOpenAI(
  message: string,
  image?: string,
  personality: string = "NORMAL"
) {
  try {
    const personalityContext =
      {
        RIZZ: "Balanced and natural tone.",
        PROFESSIONAL: "Balanced and natural tone.",
        CASUAL: "Balanced and natural tone.",
        NORMAL: "Balanced and natural tone.",
      }[personality] || "Balanced and natural tone.";

    const content = `${message}\n\nimage(Base64): ${image || "without picture"}`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "o1",
        messages: [
          {
            role: "system",
            content: `${RIZZ_SYSTEM_PROMPT}\n\nCurrent Character Traits: ${personalityContext}`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: message,
              },
              ...(image
                ? [
                    {
                      type: "image_url",
                      image_url: {
                        url: image,
                      },
                    },
                  ]
                : []),
            ],
          },
        ],
        temperature: personality === "RIZZ" ? 0.9 : 0.7,
        max_tokens: 250,
        presence_penalty: 0.6,
        frequency_penalty: 0.5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error(
      "Error sending request to OpenAI:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data.error.message || "Request to OpenAI failed"
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, image, personality = "NORMAL" } = body;

    if (!message && !image) {
      return NextResponse.json(
        { error: "Message or image required" },
        { status: 400 }
      );
    }

    const responseContent = await sendRequestToOpenAI(
      message,
      image,
      personality
    );

    return NextResponse.json({
      response: responseContent,
    });
  } catch (error: any) {
    console.error("Error:", error.message || error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
