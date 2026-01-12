"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileX2 } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-[#0e1220] to-gray-900 text-white px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-6 max-w-lg"
      >
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl shadow-xl"
        >
          <FileX2 className="w-16 h-16 text-blue-400" />
        </motion.div>

        <h1 className="text-5xl font-bold text-blue-400 tracking-tight">
          Page introuvable
        </h1>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Oups 😅 Il semble que la page que vous cherchez n’existe plus ou a été déplacée.
          <br />
          Vous pouvez revenir en arrière ou retourner à l’accueil.
        </p>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white"
          >
            Accueil
          </Button>
        </div>

        <p className="text-gray-600 text-xs mt-8">
          © {new Date().getFullYear()} AutoFacture • Conçu avec 💙 par NeuriFlux
        </p>
      </motion.div>
    </main>
  );
}
