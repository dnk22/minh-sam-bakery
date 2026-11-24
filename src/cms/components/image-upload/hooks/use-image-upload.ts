"use client";

import { useEffect, useRef, useState } from "react";
import { uploadCmsImage } from "@/cms/lib/api/uploads.client";
import { validateSingleImageUpload } from "@/cms/lib/api/upload-validation";

export function useImageUpload({ folder, disabled, onChange, onPendingChange }: {
  folder: string; disabled: boolean; onChange: (url: string | null) => void; onPendingChange?: (pending: boolean) => void;
}) {
  const [pending, setPending] = useState<{ file: File; preview: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const request = useRef<AbortController | null>(null);
  const preview = useRef<string | null>(null);

  useEffect(() => () => {
    request.current?.abort();
    request.current = null;
    if (preview.current) URL.revokeObjectURL(preview.current);
    preview.current = null;
  }, []);

  const clear = () => {
    if (preview.current) URL.revokeObjectURL(preview.current);
    preview.current = null;
    setPending(null);
    onPendingChange?.(false);
  };
  const select = (file?: File) => {
    if (!file || disabled || request.current) return;
    const issue = validateSingleImageUpload([file]);
    setError(issue);
    if (issue) return;
    if (preview.current) URL.revokeObjectURL(preview.current);
    const url = URL.createObjectURL(file);
    preview.current = url;
    setPending({ file, preview: url });
    onPendingChange?.(true);
  };
  const cancel = () => {
    if (disabled || request.current) return;
    clear();
    setError(null);
  };
  const remove = () => {
    if (disabled || request.current || pending) return;
    clear();
    setError(null);
    onChange(null);
  };
  const upload = async () => {
    if (!pending || disabled || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadCmsImage(pending.file, folder, controller.signal);
      if (controller.signal.aborted || request.current !== controller) return;
      onChange(url);
      clear();
    } catch (caught) {
      if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Không thể tải ảnh lên.");
    } finally {
      if (request.current === controller) {
        request.current = null;
        setUploading(false);
      }
    }
  };
  return { pending, uploading, error, select, cancel, remove, upload };
}
