import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert AI prompt engineer specializing in image generation. Analyze the provided reference image and generate a detailed, structured prompt that could recreate the same visual style using AI image generators like Midjourney, DALL·E, or Stable Diffusion.

You MUST respond using the "extract_prompt" tool/function provided. Do not respond with plain text.

Analyze every visual detail: subject, art style, lighting, color palette, mood, composition, camera angle, depth of field, texture, and quality level.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this reference image and generate a detailed AI image generation prompt that captures its exact visual style, lighting, composition, mood, and technical qualities.",
                },
                {
                  type: "image_url",
                  image_url: { url: imageBase64 },
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_prompt",
                description:
                  "Extract a structured AI image generation prompt from the analyzed image.",
                parameters: {
                  type: "object",
                  properties: {
                    prompt: {
                      type: "string",
                      description:
                        "A detailed, comma-separated prompt describing the image style, subject, lighting, colors, mood, composition, camera settings, and quality tags. Should be 50-150 words.",
                    },
                    negativePrompt: {
                      type: "string",
                      description:
                        "Comma-separated list of things to avoid in the generated image (e.g. blurry, low quality, distorted).",
                    },
                    tags: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "5-8 short quality/style tags like '8K', 'ultra realistic', 'cinematic', etc.",
                    },
                    style: {
                      type: "string",
                      description:
                        "The overall art/photography style (e.g. 'Cinematic Realism', 'Anime', 'Watercolor')",
                    },
                    lighting: {
                      type: "string",
                      description:
                        "Lighting description (e.g. 'Golden Hour, Warm', 'Studio Lighting')",
                    },
                    mood: {
                      type: "string",
                      description:
                        "The emotional mood/atmosphere (e.g. 'Dreamy & Ethereal', 'Dark & Moody')",
                    },
                    composition: {
                      type: "string",
                      description:
                        "Composition style (e.g. 'Close-up Portrait', 'Wide Landscape', 'Rule of Thirds')",
                    },
                    camera: {
                      type: "string",
                      description:
                        "Camera/lens details (e.g. '85mm f/1.4 Hasselblad', '35mm wide angle')",
                    },
                  },
                  required: [
                    "prompt",
                    "negativePrompt",
                    "tags",
                    "style",
                    "lighting",
                    "mood",
                    "composition",
                    "camera",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "extract_prompt" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      // Fallback: try to parse from content
      throw new Error("No structured response from AI");
    }

    const parsed = JSON.parse(toolCall.function.arguments);

    const result = {
      prompt: parsed.prompt,
      negativePrompt: parsed.negativePrompt,
      tags: parsed.tags,
      details: {
        style: parsed.style,
        lighting: parsed.lighting,
        mood: parsed.mood,
        composition: parsed.composition,
        camera: parsed.camera,
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
