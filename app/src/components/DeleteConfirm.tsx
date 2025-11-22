import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  children?: React.ReactNode;
}

export default function DeleteConfirm({
  open,
  onOpenChange,
  onConfirm,
  children,
}: Props) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        {/* Overlay */}
        <AlertDialog.Overlay
          className="
            fixed inset-0 
            bg-black/30 
            backdrop-blur-sm 
            z-40
          "
        />

        {/* Content */}
        <AlertDialog.Content
          className="
            fixed left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2 
            p-[50px]
            w-[670px] max-w-[95%]
            bg-[#00bfff] dark:bg-sky-600
            rounded-[10px] shadow-2xl 
            z-50
          "
        >
          <AlertDialog.Title className="text-xl font-semibold text-white">
            Confirm Delete
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-white/90">
            {children}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button
                className="
                  m-[10px] p-[10px] w-[108px] rounded-[10px]
                  border border-white/50 text-white
                "
              >
                Cancel
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className="
                  m-[10px] p-[10px] w-[108px] rounded-[10px]
                  bg-red-700 text-white
                "
              >
                Delete
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>

      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
