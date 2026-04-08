import { Check, Edit2, Loader2, Plus, Shield, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Racket } from "../backend.d";
import { useTheme } from "../context/ThemeContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateRacket,
  useDeleteRacket,
  useIsAdmin,
  useRackets,
  useUpdateRacket,
} from "../hooks/useQueries";

const EMPTY_RACKET: Omit<Racket, "id"> = {
  name: "",
  description: "",
  price: 0,
  weight: 300,
  balance: "Even Balance",
  power: 80n,
  category: "Performance",
  inStock: true,
};

function RacketForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial: Omit<Racket, "id"> & { id?: bigint };
  onSave: (r: Omit<Racket, "id"> & { id?: bigint }) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const { accentColor } = useTheme();
  const [form, setForm] = useState({
    ...initial,
    power: Number(initial.power),
  });

  const set = (k: string, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#F2F5FF",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(18,24,38,0.9)",
        border: `1px solid ${accentColor}30`,
        boxShadow: `0 0 30px ${accentColor}10`,
      }}
      data-ocid="admin.dialog"
    >
      <h3 className="font-display font-black text-lg uppercase tracking-wider text-white mb-6">
        {initial.name ? `Edit: ${initial.name}` : "Add New Racket"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            Name
          </div>
          <input
            data-ocid="admin.input"
            style={inputStyle}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. APEX PRO X1"
          />
        </div>
        <div>
          <div className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            Category
          </div>
          <select
            data-ocid="admin.select"
            style={inputStyle}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {[
              "Performance",
              "Speed",
              "Control",
              "All-Court",
              "Power",
              "Pro",
            ].map((c) => (
              <option key={c} value={c} style={{ background: "#0A0D12" }}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            Price ($)
          </div>
          <input
            data-ocid="admin.input"
            style={inputStyle}
            type="number"
            value={form.price}
            onChange={(e) =>
              set("price", Number.parseFloat(e.target.value) || 0)
            }
          />
        </div>
        <div>
          <div className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            Weight (g)
          </div>
          <input
            data-ocid="admin.input"
            style={inputStyle}
            type="number"
            value={form.weight}
            onChange={(e) =>
              set("weight", Number.parseFloat(e.target.value) || 0)
            }
          />
        </div>
        <div>
          <div className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            Balance
          </div>
          <select
            data-ocid="admin.select"
            style={inputStyle}
            value={form.balance}
            onChange={(e) => set("balance", e.target.value)}
          >
            {["Head Heavy", "Even Balance", "Head Light"].map((b) => (
              <option key={b} value={b} style={{ background: "#0A0D12" }}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            Power (1-100)
          </div>
          <input
            data-ocid="admin.input"
            style={inputStyle}
            type="number"
            min={1}
            max={100}
            value={form.power}
            onChange={(e) =>
              set("power", Number.parseInt(e.target.value) || 80)
            }
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
          Description
        </div>
        <textarea
          data-ocid="admin.textarea"
          style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe this racket..."
        />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <label
          htmlFor="admin-instock"
          className="flex items-center gap-2 cursor-none"
        >
          <input
            id="admin-instock"
            data-ocid="admin.checkbox"
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => set("inStock", e.target.checked)}
            style={{ accentColor }}
          />
          <span className="text-sm text-gray-400">In Stock</span>
        </label>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() =>
            onSave({ ...form, power: BigInt(form.power), id: initial.id })
          }
          disabled={isSaving}
          data-ocid="admin.save_button"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest transition-all"
          style={{
            background: isSaving
              ? "rgba(0,245,255,0.1)"
              : `linear-gradient(135deg, ${accentColor}, #9D00FF)`,
            color: isSaving ? accentColor : "#050505",
            cursor: "none",
          }}
        >
          {isSaving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} />
          )}
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          data-ocid="admin.cancel_button"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest border border-gray-700 text-gray-400 hover:text-white transition-colors"
          style={{ cursor: "none" }}
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { identity, login } = useInternetIdentity();
  const { accentColor } = useTheme();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsAdmin();
  const { data: rackets = [], isLoading } = useRackets();
  const createRacket = useCreateRacket();
  const updateRacket = useUpdateRacket();
  const deleteRacket = useDeleteRacket();

  const [showForm, setShowForm] = useState(false);
  const [editingRacket, setEditingRacket] = useState<Racket | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);

  // Not logged in
  if (!identity) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-16"
        style={{ background: "#050505" }}
      >
        <div
          className="text-center p-12 rounded-2xl max-w-md w-full mx-4"
          style={{
            background: "rgba(18,24,38,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          data-ocid="admin.panel"
        >
          <Shield
            size={48}
            className="mx-auto mb-6"
            style={{ color: accentColor }}
          />
          <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white mb-4">
            Admin Access Required
          </h2>
          <p className="text-gray-500 mb-8">
            Connect your Internet Identity to access the admin panel.
          </p>
          <button
            type="button"
            onClick={login}
            data-ocid="admin.primary_button"
            className="w-full py-3 rounded-full font-black text-sm uppercase tracking-widest"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #9D00FF)`,
              color: "#050505",
              cursor: "none",
            }}
          >
            Connect Identity
          </button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!adminLoading && !isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-16"
        style={{ background: "#050505" }}
      >
        <div
          className="text-center p-12 rounded-2xl max-w-md w-full mx-4"
          style={{
            background: "rgba(18,24,38,0.8)",
            border: "1px solid rgba(255,0,0,0.2)",
          }}
          data-ocid="admin.panel"
        >
          <Shield size={48} className="mx-auto mb-6 text-red-500" />
          <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-500">
            Your account does not have admin privileges.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = async (data: Omit<Racket, "id"> & { id?: bigint }) => {
    if (data.id !== undefined) {
      await updateRacket.mutateAsync(data as Racket);
    } else {
      await createRacket.mutateAsync({ ...data, id: 0n });
    }
    setShowForm(false);
    setEditingRacket(null);
  };

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    await deleteRacket.mutateAsync(id);
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  return (
    <main style={{ background: "#050505" }} className="pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
              Content Management
            </div>
            <h1 className="text-3xl font-display font-black uppercase tracking-tight text-white">
              RACKET <span style={{ color: accentColor }}>CMS</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setEditingRacket(null);
            }}
            data-ocid="admin.primary_button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #9D00FF)`,
              color: "#050505",
              cursor: "none",
            }}
          >
            <Plus size={16} />
            Add Racket
          </button>
        </div>

        {/* Form */}
        {(showForm || editingRacket) && (
          <div className="mb-8">
            <RacketForm
              initial={editingRacket ?? EMPTY_RACKET}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingRacket(null);
              }}
              isSaving={createRacket.isPending || updateRacket.isPending}
            />
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="space-y-4" data-ocid="admin.loading_state">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        ) : rackets.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              background: "rgba(18,24,38,0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            data-ocid="admin.empty_state"
          >
            <p className="text-gray-600 text-lg mb-4">No rackets yet.</p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              data-ocid="admin.secondary_button"
              className="px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest border"
              style={{
                color: accentColor,
                borderColor: accentColor,
                cursor: "none",
              }}
            >
              Add Your First Racket
            </button>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            data-ocid="admin.table"
          >
            {/* Table header */}
            <div
              className="grid grid-cols-6 gap-4 px-6 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span className="col-span-2">Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span className="text-right">Actions</span>
            </div>
            {rackets.map((racket, idx) => (
              <div key={String(racket.id)}>
                {/* Delete confirm */}
                {confirmDeleteId === racket.id && (
                  <div
                    className="px-6 py-4 flex items-center gap-4"
                    style={{
                      background: "rgba(255,0,0,0.08)",
                      borderTop: "1px solid rgba(255,0,0,0.2)",
                    }}
                    data-ocid="admin.dialog"
                  >
                    <span className="text-sm text-gray-300 flex-1">
                      Delete <strong>{racket.name}</strong>? This cannot be
                      undone.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(racket.id)}
                      disabled={deletingId === racket.id}
                      data-ocid="admin.confirm_button"
                      className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white"
                      style={{
                        background: "rgba(255,0,0,0.6)",
                        cursor: "none",
                      }}
                    >
                      {deletingId === racket.id
                        ? "Deleting..."
                        : "Confirm Delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      data-ocid="admin.cancel_button"
                      className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-gray-400 border border-gray-700"
                      style={{ cursor: "none" }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <div
                  key={String(racket.id)}
                  className="grid grid-cols-6 gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-white/[0.02]"
                  style={{
                    borderTop:
                      idx > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                  data-ocid={`admin.row.${idx + 1}`}
                >
                  <div className="col-span-2">
                    <div className="font-bold text-white text-sm">
                      {racket.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5 truncate">
                      {racket.description?.slice(0, 50)}...
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-black uppercase tracking-wider inline-block"
                    style={{
                      background: `${accentColor}10`,
                      color: accentColor,
                    }}
                  >
                    {racket.category}
                  </span>
                  <span className="text-white font-bold">${racket.price}</span>
                  <span
                    className="text-xs font-black uppercase tracking-wider"
                    style={{ color: racket.inStock ? "#39FF14" : "#FF4444" }}
                  >
                    {racket.inStock ? "In Stock" : "Sold Out"}
                  </span>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRacket(racket);
                        setShowForm(false);
                      }}
                      data-ocid="admin.edit_button"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: "rgba(0,245,255,0.1)",
                        color: "#00F5FF",
                        cursor: "none",
                      }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(racket.id)}
                      data-ocid="admin.delete_button"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: "rgba(255,0,0,0.1)",
                        color: "#FF4444",
                        cursor: "none",
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
