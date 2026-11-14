import { z } from "zod";
import type { Field } from "../../lib/cms";
import { sanitizeHtml } from "./sanitize";

// Absolute http(s) URL or a site-relative path ("/campuses#jadwal").
const link = z.string().trim().max(500).regex(/^(https?:\/\/|\/(?![\/\\])|#)/, "Gunakan URL http(s) atau path yang diawali /");

function fieldSchema(f: Field): z.ZodType {
  switch (f.type) {
    case "text":
    case "textarea": {
      const s = z.string().trim().max(f.max ?? 2000);
      return f.required ? s.min(1, `${f.label} wajib diisi`) : s.default("");
    }
    case "richtext": {
      const s = z.string().max(50_000).transform(sanitizeHtml);
      return f.required ? s.pipe(z.string().min(1, `${f.label} wajib diisi`)) : s.default("");
    }
    case "url":
    case "image":
      return f.required ? link : z.union([z.literal(""), link]).default("");
    case "boolean":
      return z.boolean().default(false);
    case "select": {
      const s = z.enum(f.options as [string, ...string[]]);
      return f.required ? s : s.optional();
    }
    case "list": {
      const item = z.string().trim().min(1).max(300);
      return z.array(f.pattern ? item.regex(new RegExp(f.pattern), `${f.label}: format tidak valid`) : item).max(50).default([]);
    }
    case "group":
      return objectSchema(f.fields);
    case "repeater":
      return z.array(objectSchema(f.fields)).max(50).default([]);
  }
}

/** Strict object schema: unknown keys are rejected rather than stored. */
export function objectSchema(fields: Field[]) {
  return z.strictObject(Object.fromEntries(fields.map((f) => [f.key, fieldSchema(f)])));
}
