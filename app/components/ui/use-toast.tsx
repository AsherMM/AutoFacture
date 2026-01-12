"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, Bell } from "lucide-react";
import clsx from "clsx";

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);
  const idRef = useRef(0);

  const addToast = useCallback((toast: ToastProps) => {
    idRef.current += 1;
    const id = idRef.current;
    const newToast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/* ============================================================================
   🧩 ToastContainer — Handles stacking, animation & layout
   ============================================================================ */
function ToastContainer({ toasts, removeToast }: { toasts: any[]; removeToast: (id: number) => void }) {
  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Toast {...toast} onClose={() => removeToast(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================================
   🎨 Toast Component — Beautiful animated notification cards
   ============================================================================ */
export interface ToastProps {
  id?: number;
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info" | "neutral";
  duration?: number; // 0 = persistent
  onClose?: () => void;
}

export function Toast({ title, description, type = "neutral", onClose }: ToastProps) {
  const icons: Record<string, JSX.Element> = {
    success: <CheckCircle2 className="text-green-400 w-6 h-6" />,
    error: <XCircle className="text-red-400 w-6 h-6" />,
    warning: <AlertTriangle className="text-yellow-400 w-6 h-6" />,
    info: <Info className="text-blue-400 w-6 h-6" />,
    neutral: <Bell className="text-gray-400 w-6 h-6" />,
  };

  const bgClasses: Record<string, string> = {
    success: "bg-green-900/40 border-green-700",
    error: "bg-red-900/40 border-red-700",
    warning: "bg-yellow-900/40 border-yellow-700",
    info: "bg-blue-900/40 border-blue-700",
    neutral: "bg-gray-900/70 border-gray-700",
  };

  return (
    <div
      className={clsx(
        "relative flex items-start gap-3 border rounded-xl p-4 shadow-lg backdrop-blur-md",
        "transition-all duration-200 text-gray-100",
        bgClasses[type]
      )}
    >
      <div>{icons[type]}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm leading-tight">{title}</p>}
        {description && <p className="text-xs text-gray-300 mt-1 leading-snug">{description}</p>}
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

/* ============================================================================
   🚀 Exemple d’utilisation :
   ============================================================================
   
   import { useToast } from "@/components/ui/use-toast";
   
   function Example() {
     const { toast } = useToast();

     return (
       <Button onClick={() => toast({
         title: "Utilisateur ajouté",
         description: "Le nouvel utilisateur a bien été enregistré.",
         type: "success",
         duration: 4000,
       })}>
         Ajouter utilisateur
       </Button>
     );
   }

   // Enveloppe ton app dans <ToastProvider>
   export default function App({ children }) {
     return <ToastProvider>{children}</ToastProvider>;
   }
*/

