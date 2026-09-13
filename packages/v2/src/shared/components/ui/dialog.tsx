"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type DialogProps = Omit<
  ComponentProps<"dialog">,
  "open" | "onClose" | "onCancel"
> & {
  open: boolean;
  onDismiss: () => void;
  onAfterClose?: () => void;
};

export const Dialog = ({
  open,
  onDismiss,
  onAfterClose,
  className,
  children,
  ...props
}: DialogProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropPointer = useRef(false);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    else if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      {...props}
      ref={dialog}
      data-slot="dialog-content"
      className={cn("ui-dialog", className)}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClose={onAfterClose}
      onPointerDown={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        backdropPointer.current =
          event.target === event.currentTarget &&
          (event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom);
      }}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          backdropPointer.current &&
          event.target === event.currentTarget &&
          (event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom)
        )
          onDismiss();
        backdropPointer.current = false;
      }}
    >
      {children}
      <button
        type="button"
        className="ui-dialog-dismiss"
        onClick={onDismiss}
        aria-label="閉じる"
      >
        <X size={16} />
      </button>
    </dialog>
  );
};
