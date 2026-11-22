import { expect, test } from "bun:test";
import { markdownSlug, prefersMarkdown, renderMarkdown } from "./markdown";

test("Accept negotiation serves Markdown only when it outranks HTML", () => {
  expect(prefersMarkdown("text/markdown")).toBe(true);
  expect(prefersMarkdown("text/markdown, text/html;q=0.9")).toBe(true);
  expect(prefersMarkdown("text/markdown;q=0.1, text/html")).toBe(false);
  expect(prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")).toBe(false);
  expect(prefersMarkdown("*/*")).toBe(false);
  expect(prefersMarkdown("")).toBe(false);
});

test("Markdown lookups ignore inherited object keys", () => {
  expect(markdownSlug("/constructor")).toBeNull();
  expect(renderMarkdown("toString")).toBeNull();
  expect(markdownSlug("/")).toBe("index");
  expect(renderMarkdown("jadwal-ibadah")).toContain("# Jadwal Ibadah");
});
