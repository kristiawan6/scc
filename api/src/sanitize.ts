// Allowlist sanitizer for rich text from the CMS editor, using Bun's native
// HTMLRewriter. Runs on every write so stored HTML is always safe to render.

const KEEP = new Set(["p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "code", "pre", "hr"]);
// Harmless wrappers (e.g. from pasted content): removed, their content kept.
// Every other tag is dropped together with its content. Fail-closed on purpose:
// raw-text elements (xmp, noembed, noframes, plaintext, ...) hold markup as text,
// so unwrapping them would turn that text into live HTML.
const UNWRAP = new Set(["div", "span", "section", "article", "header", "footer", "main", "aside", "figure", "figcaption", "small", "sub", "sup", "mark", "font", "center", "html", "body"]);
const SAFE_HREF = /^(https?:|mailto:|tel:|\/(?![\/\\])|#)/i; // "/\\x" acts like "//x" in browsers

// After rewriting, any "<" that does not start a complete allowed tag is escaped.
// HTMLRewriter passes through an unfinished trailing tag ("<img src=x onerror=..."
// with no ">") and stray end tags verbatim; those become live markup once the
// value is embedded in a larger page.
const TAGS = [...KEEP].join("|");
const ALLOWED_TAG = new RegExp(`<(?!(?:(?:${TAGS})\\b[^<>]*|/(?:${TAGS})\\s*)>)`, "gi"); // end tags must be bare

export function sanitizeHtml(html: string): string {
  return rewrite(html).replace(ALLOWED_TAG, "&lt;");
}

function rewrite(html: string): string {
  return new HTMLRewriter()
    .on("*", {
      element(el) {
        const tag = el.tagName.toLowerCase();
        if (KEEP.has(tag)) {
          // fall through to attribute cleanup
        } else if (UNWRAP.has(tag)) {
          el.removeAndKeepContent();
          return;
        } else {
          el.remove();
          return;
        }
        const href = tag === "a" ? el.getAttribute("href")?.trim() : undefined;
        for (const [name] of [...el.attributes]) el.removeAttribute(name);
        if (tag !== "a") return;
        if (href && SAFE_HREF.test(href)) {
          el.setAttribute("href", href);
          if (/^https?:/i.test(href)) el.setAttribute("rel", "noopener noreferrer");
        } else el.removeAndKeepContent();
      },
    })
    .onDocument({
      comments(c) {
        c.remove();
      },
    })
    .transform(html);
}
