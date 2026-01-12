"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import {
  UserPlus,
  Pencil,
  Trash2,
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import clsx from "clsx";

/* ==========================================================================
   💼 PAGE GESTION DES CLIENTS
   ========================================================================== */
export default function ClientsPage() {
  const [user, setUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
  });

  const MAX_FREE_CLIENTS = 5;

  /* ============================================================
     🔹 Chargement utilisateur et clients
  ============================================================ */
  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: profile } = await supabase
        .from("users")
        .select("subscription_status")
        .eq("id", user.id)
        .maybeSingle();

      const planType =
        profile?.subscription_status === "premium" ? "premium" : "free";
      setPlan(planType);

      const { data: clientList } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setClients(clientList || []);
    };

    loadData();
  }, []);

  /* ============================================================
     🔸 Fonctions CRUD
  ============================================================ */
  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Le nom est obligatoire.");
    if (plan === "free" && clients.length >= MAX_FREE_CLIENTS && !editingClient)
      return alert("Limite atteinte : passez Premium pour ajouter plus de clients.");

    const data = {
      user_id: user.id,
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      address: form.address,
    };

    if (editingClient) {
      await supabase.from("clients").update(data).eq("id", editingClient.id);
    } else {
      await supabase.from("clients").insert(data);
    }

    setForm({ name: "", company: "", email: "", phone: "", address: "" });
    setEditingClient(null);
    setShowModal(false);
    refreshClients();
  };

  const refreshClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setClients(data || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce client ?")) return;
    await supabase.from("clients").delete().eq("id", id);
    refreshClients();
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setForm(client);
    setShowModal(true);
  };

  /* ============================================================
     🔍 Recherche / Tri
  ============================================================ */
  const filteredClients = useMemo(() => {
    let list = [...clients];
    if (searchTerm.trim()) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "company") return (a.company || "").localeCompare(b.company || "");
      if (sortBy === "date") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

    return list;
  }, [clients, sortBy, searchTerm]);

  /* ============================================================
     🎨 UI
  ============================================================ */
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Mes Clients</h1>
          <p className="text-gray-500 mt-1">
            Gérez vos clients — Ajoutez, modifiez ou supprimez-les facilement
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          disabled={plan === "free" && clients.length >= MAX_FREE_CLIENTS}
          className={clsx(
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md flex items-center gap-2",
            plan === "free" && clients.length >= MAX_FREE_CLIENTS && "opacity-50 cursor-not-allowed"
          )}
        >
          <UserPlus className="w-4 h-4" /> Nouveau client
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Search className="w-4 h-4 text-gray-500 absolute ml-3" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="bg-gray-900 border border-gray-800 rounded-lg px-9 py-2 text-sm text-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-1 text-sm text-gray-400 border-gray-700 hover:bg-gray-800"
          >
            <ChevronDown className="w-4 h-4" />
            Trier par
          </Button>
          <div className="absolute bg-gray-900 border border-gray-800 rounded-lg mt-2 shadow-lg w-40 text-sm text-gray-300">
            {["name", "company", "date"].map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={clsx(
                  "block w-full text-left px-4 py-2 hover:bg-gray-800",
                  sortBy === opt && "text-blue-400"
                )}
              >
                {opt === "name" ? "Nom" : opt === "company" ? "Entreprise" : "Date"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLEAU CLIENTS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl"
      >
        {filteredClients.length === 0 ? (
          <p className="text-gray-500 text-center py-10 italic">
            Aucun client enregistré.
          </p>
        ) : (
          <table className="w-full text-sm text-left text-gray-300 border-collapse">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Nom</th>
                <th className="py-3 px-4">Entreprise</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Téléphone</th>
                <th className="py-3 px-4">Adresse</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-all"
                >
                  <td className="py-3 px-4 font-medium text-gray-100">{c.name}</td>
                  <td className="py-3 px-4 text-gray-400">{c.company || "—"}</td>
                  <td className="py-3 px-4 text-gray-400">{c.email || "—"}</td>
                  <td className="py-3 px-4 text-gray-400">{c.phone || "—"}</td>
                  <td className="py-3 px-4 text-gray-400">{c.address || "—"}</td>
                  <td className="py-3 px-4 flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-blue-400 hover:bg-gray-800"
                      onClick={() => handleEdit(c)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-600/20"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* MODAL AJOUT / MODIF */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
              {editingClient ? (
                <>
                  <Pencil className="w-5 h-5" /> Modifier client
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> Nouveau client
                </>
              )}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <InputField icon={<Building2 />} label="Nom" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <InputField icon={<Building2 />} label="Entreprise" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
              <InputField icon={<Mail />} label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <InputField icon={<Phone />} label="Téléphone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <InputField icon={<MapPin />} label="Adresse" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)} className="border-gray-700 text-gray-400">
                Annuler
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                <Check className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   🔹 COMPOSANT CHAMP PERSONNALISÉ
   ========================================================================== */
function InputField({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-gray-400 text-sm mb-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-2.5 text-gray-500">{icon}</div>
        <input
          className="bg-gray-800 border border-gray-700 rounded-lg w-full pl-10 pr-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
