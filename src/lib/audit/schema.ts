import { z } from "zod";

export const AuditItemSchema = z.object({
  severity: z.number().int().min(0).max(3),
  category: z.string().min(1),
  title: z.string().min(1),
  evidence: z.string().min(1),
  recommendation: z.string().min(1),
  effort: z.enum(["low", "med", "high"]),
  impact: z.enum(["low", "med", "high"]),
});

export type AuditItem = z.infer<typeof AuditItemSchema>;

export const AuditResultSchema = z.object({
  summary: z.string().min(1),
  top_issues: z.array(AuditItemSchema),
  quick_wins: z.array(z.string()),
  accessibility_flags: z.array(z.string()),
  copy_improvements: z.array(z.string()),
  next_steps: z.array(z.string()),
});

export type AuditResult = z.infer<typeof AuditResultSchema>;

