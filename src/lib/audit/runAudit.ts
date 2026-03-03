import { AuditResult, AuditResultSchema } from "./schema";

type RunAuditOptions = {
  imageBase64: string;
  mimeType: string;
};

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function runAudit({
  imageBase64,
  mimeType,
}: RunAuditOptions): Promise<AuditResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const prompt = [
    "You are a senior UX researcher performing a heuristic and accessibility review of a single UI screenshot.",
    "",
    "Use Nielsen's 10 usability heuristics and basic accessibility principles (WCAG 2.1 AA level) as your primary lenses.",
    "Focus on information hierarchy, visual clarity, affordances, feedback, consistency, error prevention, and learnability.",
    "",
    "For each issue you report:",
    "- Be specific and cite concrete visual evidence from the screenshot (e.g. label text, component position, color contrast, spacing).",
    "- Explain why it is a problem in terms of usability or accessibility.",
    "- Provide a clear, actionable recommendation to fix or improve it.",
    "- Estimate effort (low/med/high) and impact (low/med/high) on user experience.",
    "",
    "Severity scale (map to integer 0–3):",
    "- 3 = P0: critical, blocks key tasks or causes severe errors.",
    "- 2 = P1: major, frequently impacts primary flows.",
    "- 1 = P2: moderate, noticeable but users can work around it.",
    "- 0 = P3: minor, polish or low-risk issues.",
    "",
    "Return a STRICT JSON object only, matching this TypeScript type exactly:",
    "  type AuditItem = {",
    "    severity: 0 | 1 | 2 | 3;",
    "    category: string; // e.g. 'Navigation', 'Forms', 'Accessibility', 'Visual hierarchy'",
    "    title: string; // short, punchy issue name",
    "    evidence: string; // specific on-screen evidence from the screenshot",
    "    recommendation: string; // concrete recommendation",
    "    effort: 'low' | 'med' | 'high';",
    "    impact: 'low' | 'med' | 'high';",
    "  };",
    "",
    "  type AuditResult = {",
    "    summary: string; // 2–4 sentence narrative overview",
    "    top_issues: AuditItem[]; // prioritize most important issues first",
    "    quick_wins: string[]; // small, fast changes that improve UX",
    "    accessibility_flags: string[]; // specific accessibility concerns (e.g. contrast, labels, targets)",
    "    copy_improvements: string[]; // suggestions for labels, microcopy, error messages",
    "    next_steps: string[]; // recommended follow-up actions or experiments",
    "  };",
    "",
    "Rules:",
    "- Respond with JSON ONLY. No markdown, no prose outside the JSON.",
    "- Do not include comments or trailing commas.",
    "- Ensure the JSON is syntactically valid and can be parsed by JSON.parse.",
  ].join("\n");

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a meticulous UX auditor. You only ever respond with strict JSON that matches the requested schema.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `OpenAI API error: ${response.status} ${response.statusText} ${errorText}`,
    );
  }

  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = json.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI API returned no content");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error("Failed to parse OpenAI JSON response");
  }

  return AuditResultSchema.parse(parsed);
}

