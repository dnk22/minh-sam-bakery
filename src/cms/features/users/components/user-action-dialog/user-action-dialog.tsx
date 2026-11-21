"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";

import { useUserMutations } from "../../hooks/use-user-mutations";
import type { CmsUser, UserAction } from "../../types";
import styles from "./user-action-dialog.module.css";

export type UserActionTarget = { user: CmsUser; action: UserAction } | null;

export function UserActionDialog({ target, currentUserId, onClose, onCompleted }: {
  target: UserActionTarget;
  currentUserId: string;
  onClose: () => void;
  onCompleted: (action: UserAction) => void;
}) {
  const mutations = useUserMutations(currentUserId);
  const targetKey = target ? `${target.user.id}:${target.action}` : "closed";
  const [errorState, setErrorState] = useState<{ key: string; message: string | null }>({ key: "closed", message: null });
  const error = errorState.key === targetKey ? errorState.message : null;
  const mutation = target?.action === "lock" ? mutations.lock : target?.action === "unlock" ? mutations.unlock : mutations.remove;
  const selfBlocked = Boolean(target && target.user.id === currentUserId && (target.action === "lock" || target.action === "delete"));
  const confirm = async () => {
    if (!target || mutation.isPending || selfBlocked) return;
    setErrorState({ key: targetKey, message: null });
    try { await mutation.mutateAsync(target.user.id); onCompleted(target.action); }
    catch (caught) { setErrorState({ key: targetKey, message: caught instanceof CmsApiError ? caught.message : "Không thể hoàn tất thao tác lúc này." }); }
  };
  const copy = getActionCopy(target?.action);
  return <ResponsiveModal
    footer={<><CmsButton type="button" variant="outline" disabled={mutation.isPending} onClick={onClose}>Hủy</CmsButton><CmsButton type="button" variant={target?.action === "delete" || target?.action === "lock" ? "destructive" : "default"} disabled={mutation.isPending || selfBlocked} onClick={confirm}>{mutation.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}{copy.confirm}</CmsButton></>}
    onBeforeClose={() => !mutation.isPending}
    onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}
    open={Boolean(target)}
    title={copy.title}
    variant="confirm"
  >
    <div className={styles.body}>
      <p>{copy.question} <strong>“{target?.user.fullName}”</strong> ({target?.user.email})?</p>
      {selfBlocked ? <p className={styles.alert} role="alert">Không thể tự khóa hoặc tự xóa tài khoản đang sử dụng từ giao diện CMS.</p> : null}
      {error ? <p className={styles.alert} role="alert">{error}</p> : null}
    </div>
  </ResponsiveModal>;
}

function getActionCopy(action?: UserAction) {
  if (action === "lock") return { title: "Khóa tài khoản", question: "Bạn có chắc muốn khóa tài khoản", confirm: "Khóa" };
  if (action === "unlock") return { title: "Mở khóa tài khoản", question: "Bạn có chắc muốn mở khóa tài khoản", confirm: "Mở khóa" };
  return { title: "Xóa tài khoản", question: "Bạn có chắc muốn xóa tài khoản", confirm: "Xóa" };
}
