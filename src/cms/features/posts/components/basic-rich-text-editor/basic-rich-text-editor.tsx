"use client";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Quote, Redo2, RemoveFormatting, Undo2, Unlink } from "lucide-react";
import { CmsButton } from "@/cms/components/ui/button";
import { isSafeLinkHref } from "../../lib/post-html";
import styles from "./basic-rich-text-editor.module.css";

export function BasicRichTextEditor({ value, onChange, disabled = false, labelledBy }: { value: string; onChange: (html: string) => void; disabled?: boolean; labelledBy?: string }) {
  const editor = useEditor({ immediatelyRender: false, editable: !disabled, content: value,
    extensions: [StarterKit.configure({ link: false, heading: { levels: [2, 3] } }), Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" })],
    editorProps: { attributes: { class: styles.content, "aria-labelledby": labelledBy ?? "" } }, onUpdate: ({ editor: current }) => onChange(current.getHTML()) });
  if (!editor) return <div className={styles.loading}>Đang khởi tạo trình soạn thảo…</div>;
  const setLink = () => { const previous = editor.getAttributes("link").href as string | undefined; const href = window.prompt("Nhập liên kết an toàn (https://, mailto:, tel:, / hoặc #)", previous ?? "https://"); if (href === null) return; if (!href.trim()) { editor.chain().focus().unsetLink().run(); return; } if (!isSafeLinkHref(href)) { window.alert("Liên kết không hợp lệ hoặc không an toàn."); return; } editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run(); };
  const button = (label: string, active: boolean, onClick: () => void, icon: React.ReactNode, disabledState = false) => <CmsButton aria-label={label} title={label} type="button" size="icon" variant={active ? "secondary" : "ghost"} disabled={disabled || disabledState} onClick={onClick}>{icon}</CmsButton>;
  return <div className={styles.editor} data-disabled={disabled || undefined}>
    <div className={styles.toolbar} role="toolbar" aria-label="Định dạng nội dung">
      <CmsButton type="button" size="sm" variant={editor.isActive("paragraph") ? "secondary" : "ghost"} disabled={disabled} onClick={() => editor.chain().focus().setParagraph().run()}>Đoạn</CmsButton>
      <CmsButton type="button" size="sm" variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</CmsButton>
      <CmsButton type="button" size="sm" variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</CmsButton>
      {button("Đậm", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold aria-hidden="true" size={16} />)}
      {button("Nghiêng", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic aria-hidden="true" size={16} />)}
      {button("Danh sách", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List aria-hidden="true" size={16} />)}
      {button("Danh sách số", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered aria-hidden="true" size={16} />)}
      {button("Trích dẫn", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote aria-hidden="true" size={16} />)}
      {button("Thêm hoặc sửa liên kết", editor.isActive("link"), setLink, <RemoveFormatting aria-hidden="true" size={16} />)}
      {button("Gỡ liên kết", false, () => editor.chain().focus().unsetLink().run(), <Unlink aria-hidden="true" size={16} />, !editor.isActive("link"))}
      {button("Hoàn tác", false, () => editor.chain().focus().undo().run(), <Undo2 aria-hidden="true" size={16} />, !editor.can().undo())}
      {button("Làm lại", false, () => editor.chain().focus().redo().run(), <Redo2 aria-hidden="true" size={16} />, !editor.can().redo())}
    </div><EditorContent editor={editor} />
  </div>;
}
