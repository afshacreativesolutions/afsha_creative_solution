"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import { deleteBlogPost } from "../actions";

export default function BlogDeleteButton({
  id,
  title,
  className = "",
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await deleteBlogPost(fd);
      setOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-red-500/35 px-3.5 text-xs text-red-300 transition hover:bg-red-600 hover:text-white ${className}`}
      >
        <Trash2 size={14} />
        <span>Delete</span>
      </button>

      <AdminConfirmDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title={`Delete "${title}"?`}
        description="This permanently removes the article from the blog database."
        confirmLabel="Confirm Delete"
        tone="danger"
        busy={isPending}
      />
    </>
  );
}
