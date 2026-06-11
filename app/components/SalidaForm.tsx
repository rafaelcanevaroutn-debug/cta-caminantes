"use client";

import { useState } from "react";
import { Salida } from "./types";

interface Props {
  salida?: Salida;
  onSave: (salida: Salida) => void;
  onCancel: () => void;
}

const emptyForm = (): Omit<Salida, "id"> => ({
  nombre: "",
  fecha: "",
  precio: "",
  sena: "",
  link: "",
  descripcion: "",
});

export default function SalidaForm({ salida, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Omit<Salida, "id">>(
    salida ? { nombre: salida.nombre, fecha: salida.fecha, precio: salida.precio, sena: salida.sena, link: salida.link, descripcion: salida.descripcion }
    : emptyForm()
  );

  const set = (field: keyof Omit<Salida, "id">) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.fecha) return;
    onSave({
      ...form,
      id: salida?.id ?? crypto.randomUUID(),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={labelStyle}>Destino *</label>
        <input
          type="text"
          value={form.nombre}
          onChange={set("nombre")}
          placeholder="Ej: Cerro Muñano, Parque Aconquija"
          required
        />
      </div>

      <div>
        <label style={labelStyle}>Fecha de salida *</label>
        <input
          type="text"
          value={form.fecha}
          onChange={set("fecha")}
          placeholder="Ej: 15 de junio 2025 / Sábado 14 jun"
          required
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Precio (USD)</label>
          <input
            type="text"
            value={form.precio}
            onChange={set("precio")}
            placeholder="Ej: 45"
          />
        </div>
        <div>
          <label style={labelStyle}>Seña (USD)</label>
          <input
            type="text"
            value={form.sena}
            onChange={set("sena")}
            placeholder="Ej: 20"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Link de inscripción</label>
        <input
          type="text"
          value={form.link}
          onChange={set("link")}
          placeholder="https://forms.gle/..."
        />
      </div>

      <div>
        <label style={labelStyle}>Descripción completa</label>
        <textarea
          value={form.descripcion}
          onChange={set("descripcion")}
          placeholder="Pegá toda la info: descripción, itinerario, qué incluye, qué llevar, nivel de dificultad, FAQs... Cuanto más info, mejores CTAs."
          rows={8}
          style={{ resize: "vertical" }}
        />
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>
          La IA usa toda esta info para generar CTAs específicos y ricos en contexto.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
        <button type="submit" style={btnPrimaryStyle}>
          {salida ? "Guardar cambios" : "Agregar salida"}
        </button>
        <button type="button" onClick={onCancel} style={btnSecondaryStyle}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const btnPrimaryStyle: React.CSSProperties = {
  background: "var(--green-accent)",
  color: "var(--text-primary)",
  border: "none",
  borderRadius: 8,
  padding: "10px 20px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  flex: 1,
};

const btnSecondaryStyle: React.CSSProperties = {
  background: "transparent",
  color: "var(--text-muted)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "10px 20px",
  fontSize: 15,
  cursor: "pointer",
};
