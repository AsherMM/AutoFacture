"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Bell,
} from "lucide-react";
import clsx from "clsx";

/* ============================================================================
   🧩 Types
   ============================================================================ */

export type ToastType = "success" | "error" | "warning" | "info" | "neutral";

export interface ToastProps {
  id?: number;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number; // en ms — 0 = permanent
  sound?: boolean;
  onClose?: () => void;
}

interface ToastContextType {
  toast: (toast: ToastProps) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

/* ============================================================================
   🧠 Context Provider
   ============================================================================ */

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const idRef = useRef(0);
  const timers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));

    // Supprimer le timer correspondant
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const addToast = useCallback(
    (toast: ToastProps) => {
      idRef.current += 1;
      const id = idRef.current;

      const newToast: ToastProps = {
        id,
        type: toast.type || "neutral",
        duration: toast.duration ?? 5000,
        sound: toast.sound ?? true,
        ...toast,
      };

      setToasts((prev) => [...prev, newToast]);

      // 🔔 Lecture du son (optionnel)
      if (newToast.sound) {
        try {
          const sound = new Audio("/sounds/notify.mp3");
          sound.volume = 0.4;
          sound.play().catch(() => {});
        } catch {
          /* ignore si non supporté */
        }
      }

      // ⏳ Timer auto-remove
      if (newToast.duration && newToast.duration > 0) {
        const timer = setTimeout(() => removeToast(id), newToast.duration);
        timers.current.set(id, timer);
      }
    },
    [removeToast]
  );

  // 🧹 Nettoyage à l’unmount
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

/* ============================================================================
   🔥 Hook useToast
   ============================================================================ */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return context;
}

/* ============================================================================
   🎨 ToastContainer — Empile et anime les toasts
   ============================================================================ */
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: ToastProps[];
  removeToast: (id: number) => void;
}) {
  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto"
          >
            <ToastCard {...toast} onClose={() => removeToast(toast.id!)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================================
   💅 ToastCard — carte visuelle
   ============================================================================ */
function ToastCard({
  title,
  description,
  type = "neutral",
  onClose,
}: ToastProps) {
  const icons: Record<ToastType, React.ReactElement> = {
    success: <CheckCircle2 className="text-green-400 w-6 h-6" />,
    error: <XCircle className="text-red-400 w-6 h-6" />,
    warning: <AlertTriangle className="text-yellow-400 w-6 h-6" />,
    info: <Info className="text-blue-400 w-6 h-6" />,
    neutral: <Bell className="text-gray-400 w-6 h-6" />,
  };

  const bgClasses: Record<ToastType, string> = {
    success: "bg-green-900/40 border-green-700",
    error: "bg-red-900/40 border-red-700",
    warning: "bg-yellow-900/40 border-yellow-700",
    info: "bg-blue-900/40 border-blue-700",
    neutral: "bg-gray-900/70 border-gray-700",
  };

  return (
    <div
      className={clsx(
        "relative flex items-start gap-3 border rounded-xl p-4 shadow-xl backdrop-blur-md",
        "transition-all duration-200 text-gray-100 overflow-hidden",
        bgClasses[type]
      )}
    >
      <div>{icons[type]}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm leading-tight truncate">{title}</p>
        )}
        {description && (
          <p className="text-xs text-gray-300 mt-1 leading-snug line-clamp-2">
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          aria-label="Fermer la notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}

