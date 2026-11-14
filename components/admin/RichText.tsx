"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?![\/\\])|#)/i;

/** WYSIWYG editor. Output is HTML; the API sanitizes it again before storing. */
export function RichText({ value, onChange, label, tone }: { value: string; onChange: (html: string) => void; label: string; tone: "ink" | "paper" }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } })],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rich min-h-32 rounded-xl px-1 py-2 outline-none focus-visible:ring-2 focus-visible:ring-gold",
        "aria-label": label,
        "aria-multiline": "true",
        role: "textbox",
      },
    },
  });

  const active = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
            undo: e.can().undo(),
            redo: e.can().redo(),
          }
        : null,
  });

  if (!editor) return <div className="min-h-32" />;
  const on = active ?? { bold: false, italic: false, h2: false, h3: false, bullet: false, ordered: false, quote: false, link: false, undo: false, redo: false };
  const chain = () => editor.chain().focus();

  const setLink = () => {
    const prev = editor.getAttributes("link").href ?? "";
    const href = window.prompt("URL tautan (kosongkan untuk menghapus):", prev);
    if (href === null) return;
    if (!href.trim()) return chain().unsetLink().run();
    if (!SAFE_HREF.test(href.trim())) return window.alert("Gunakan URL yang diawali https://, mailto:, tel:, atau /.");
    chain().extendMarkRange("link").setLink({ href: href.trim() }).run();
  };

  const tools = [
    { label: "Tebal", icon: Bold, on: on.bold, run: () => chain().toggleBold().run() },
    { label: "Miring", icon: Italic, on: on.italic, run: () => chain().toggleItalic().run() },
    { label: "Judul besar", icon: Heading2, on: on.h2, run: () => chain().toggleHeading({ level: 2 }).run() },
    { label: "Judul kecil", icon: Heading3, on: on.h3, run: () => chain().toggleHeading({ level: 3 }).run() },
    { label: "Daftar berpoin", icon: List, on: on.bullet, run: () => chain().toggleBulletList().run() },
    { label: "Daftar bernomor", icon: ListOrdered, on: on.ordered, run: () => chain().toggleOrderedList().run() },
    { label: "Kutipan", icon: Quote, on: on.quote, run: () => chain().toggleBlockquote().run() },
    { label: "Tautan", icon: Link2, on: on.link, run: setLink },
  ];

  const bar = tone === "ink" ? "bg-ink-2 text-paper" : "bg-black/5 text-ink";
  return (
    <div>
      <div role="toolbar" aria-label={`Format ${label}`} className={`mb-2 flex flex-wrap gap-1 rounded-xl p-1 ${bar}`}>
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.label}
            aria-label={t.label}
            aria-pressed={t.on}
            onClick={t.run}
            className="grid size-9 place-items-center rounded-lg transition-colors hover:bg-gold/30 aria-pressed:bg-gold aria-pressed:text-ink"
          >
            <t.icon aria-hidden="true" className="size-4" />
          </button>
        ))}
        <span className="mx-1 w-px self-stretch bg-current opacity-20" />
        <button type="button" title="Urungkan" aria-label="Urungkan" disabled={!on.undo} onClick={() => chain().undo().run()} className="grid size-9 place-items-center rounded-lg hover:bg-gold/30 disabled:opacity-30">
          <Undo2 aria-hidden="true" className="size-4" />
        </button>
        <button type="button" title="Ulangi" aria-label="Ulangi" disabled={!on.redo} onClick={() => chain().redo().run()} className="grid size-9 place-items-center rounded-lg hover:bg-gold/30 disabled:opacity-30">
          <Redo2 aria-hidden="true" className="size-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
