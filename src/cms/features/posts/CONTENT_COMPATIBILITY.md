# Posts content compatibility boundary

Phase 7.1 stores the existing Backend `content` field as an HTML string. The basic Tiptap editor may write only HTML represented by its installed StarterKit and Link schema.

Before an existing document enters editable mode, `inspectEditorCompatibility()` rejects custom `data-block` markup, CKEditor widget structures, layout/style attributes, embedded media, tables, figures and unknown tags. Unsupported content remains available through the sanitized read-only preview. Metadata-only updates must omit `content` from PATCH.

Phase 7.2 should introduce explicit Tiptap node extensions for each approved visual block. Each extension must own parsing from the canonical HTML shape and serialization back to that same shape, with round-trip fixtures proving no node or required attribute is lost. The Backend contract remains the single HTML `content` field unless a future OpenAPI revision explicitly adds another field.
