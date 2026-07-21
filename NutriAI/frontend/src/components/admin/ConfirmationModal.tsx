import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../common";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

const variantStyles: Record<string, { icon: string; bg: string; btn: string }> = {
  danger: {
    icon: "text-red-600",
    bg: "bg-red-100 dark:bg-red-900/30",
    btn: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    btn: "bg-amber-600 hover:bg-amber-700",
  },
  info: {
    icon: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
};

/** Reusable confirmation dialog for admin actions. */
export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  isLoading = false,
  variant = "danger",
}: ConfirmationModalProps) {
  const s = variantStyles[variant] ?? variantStyles.danger;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
          >
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${s.bg}`}>
                    <AlertTriangle size={20} className={s.icon} />
                  </div>
                  <h3
                    id="confirm-dialog-title"
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={onConfirm}
                  isLoading={isLoading}
                  className={s.btn}
                >
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
