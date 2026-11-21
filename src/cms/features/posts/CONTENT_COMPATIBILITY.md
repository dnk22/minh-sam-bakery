# Posts content compatibility boundary

Posts continue to store the existing Backend `content` field as an HTML string. Phase 7.2 adds versioned `data-ms-*` article envelopes while retaining the Phase 7.1 basic HTML path.

Before an existing document enters editable mode, `inspectEditorCompatibility()` rejects custom `data-block` markup, CKEditor widget structures, layout/style attributes, embedded media, tables, figures and unknown tags. Unsupported content remains available through the sanitized read-only preview. Metadata-only updates must omit `content` from PATCH.

Structured layout contracts, parser/serializer rules and future versioning are documented in `docs/article-layout-contract.md`. Tiptap remains restricted to rich-text slots; React layout components own structural blocks. The Backend contract remains the single HTML `content` field unless a future OpenAPI revision explicitly adds another field.
