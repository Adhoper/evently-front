import { useEffect, useState } from "react";
import { Check, Edit3, LoaderCircle, Plus, Tags, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { createAdminCategory, getAdminCategories, updateAdminCategory, updateAdminCategoryStatus } from "../../services/adminService";
import type { Category } from "../../types/category";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) toast.error("No fue posible cargar las categorías.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const createCategory = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      setCreating(true);
      const created = await createAdminCategory(name);
      setCategories((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
      toast.success("Categoría creada.");
    } catch (error) {
      showError(error, "No fue posible crear la categoría.");
    } finally {
      setCreating(false);
    }
  };

  const saveEdit = async (category: Category) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      setProcessingId(category.id);
      const updated = await updateAdminCategory(category.id, name);
      setCategories((current) => current.map((item) => (item.id === updated.id ? updated : item)).sort((a, b) => a.name.localeCompare(b.name)));
      setEditingId(null);
      setEditingName("");
      toast.success("Categoría actualizada.");
    } catch (error) {
      showError(error, "No fue posible editar la categoría.");
    } finally {
      setProcessingId(null);
    }
  };

  const toggleStatus = async (category: Category) => {
    try {
      setProcessingId(category.id);
      const updated = await updateAdminCategoryStatus(category.id, !category.isActive);
      setCategories((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(updated.isActive ? "Categoría activada." : "Categoría desactivada.");
    } catch (error) {
      showError(error, "No fue posible actualizar la categoría.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Administración</span>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">Categorías</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Controla las categorías disponibles para los organizadores.</p>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <label htmlFor="new-category" className="text-sm font-black text-slate-700 dark:text-slate-300">Nueva categoría</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="new-category"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void createCategory();
              }}
              placeholder="Ej. Negocios"
              maxLength={100}
              className="h-12 flex-1 rounded-xl border border-slate-300 bg-slate-100 px-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button type="button" disabled={creating || !newName.trim()} onClick={() => void createCategory()} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-black text-white transition hover:bg-brand-700 disabled:opacity-50"><Plus size={17} />Agregar</button>
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><LoaderCircle className="animate-spin text-brand-600" /></div>
        ) : categories.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-900"><Tags className="mx-auto text-slate-400" /><p className="mt-4 font-black text-slate-900 dark:text-slate-100">No hay categorías registradas.</p></div>
        ) : (
          <div className="mt-5 space-y-3">
            {categories.map((category) => {
              const editing = editingId === category.id;
              return (
                <article key={category.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    {editing ? (
                      <input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        maxLength={100}
                        autoFocus
                        className="h-11 w-full max-w-md rounded-xl border border-brand-400 bg-slate-100 px-4 text-sm font-bold text-slate-900 outline-none ring-4 ring-brand-500/10 dark:bg-slate-800 dark:text-slate-100"
                      />
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-black text-slate-900 dark:text-slate-100">{category.name}</h2>
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${category.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>{category.isActive ? "Activa" : "Inactiva"}</span>
                      </div>
                    )}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ID #{category.id}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editing ? (
                      <>
                        <button type="button" disabled={processingId === category.id || !editingName.trim()} onClick={() => void saveEdit(category)} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3.5 py-2.5 text-xs font-black text-white disabled:opacity-50"><Check size={15} />Guardar</button>
                        <button type="button" onClick={() => { setEditingId(null); setEditingName(""); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2.5 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><X size={15} />Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => { setEditingId(category.id); setEditingName(category.name); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"><Edit3 size={15} />Editar</button>
                        <button type="button" disabled={processingId === category.id} onClick={() => void toggleStatus(category)} className={`rounded-xl px-3.5 py-2.5 text-xs font-black transition disabled:opacity-50 ${category.isActive ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"}`}>{category.isActive ? "Desactivar" : "Activar"}</button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function showError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    toast.error(fallback, { description: error.response?.data?.message });
  } else {
    toast.error(fallback);
  }
}

export default AdminCategoriesPage;
