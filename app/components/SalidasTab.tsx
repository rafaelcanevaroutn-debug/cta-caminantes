"use client";

import { useState } from "react";
import { Salida } from "./types";
import SalidaForm from "./SalidaForm";

interface Props {
  salidas: Salida[];
  onAdd: (s: Salida) => void;
  onEdit: (s: Salida) => void;
  onDelete: (id: string) => void;
}

export default function SalidasTab({ salidas, onAdd, onEdit, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const editingSalida = salidas.find((s) => s.id === editingId);

  if (showForm && !editingId) {
    return (
      <div>
        <h2 style={sectionTitle}>Nueva salida</h2>
        <SalidaForm
          onSave={(s) => { onAdd(s); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (editingId && editingSalida) {
    return (
      <div>
        <h2 style={sectionTitle}>Editar salida</h2>
        <SalidaForm
          salida={editingSalida}
          onSave={(s) => { onEdit(s); setEditingId(null); }}
          onCancel={() => setEditingId(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Salidas cargadas</h2>
        <button onClick={() => setShowForm(true)} style={btnAddStyle}>
          + Nueva salida
        </button>
      </div>

      {salidas.length === 0 && (
        <div style={emptyStyle}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>⛰️</p>
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
            No hay salidas cargadas todavía.
            <br />
            Agregá tu primera salida para empezar a generar CTAs.
          </p>
          <button onClick={() => setShowForm(true)} style={{ ...btnAddStyle, marginTop: 16 }}>
            + Agregar salida
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {salidas.map((s) => (
          <div key={s.id} style={cardStyle}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: "var(--green-light)" }}>
                {s.nombre}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span>📅 {s.fecha}</span>
                {s.precio && <span>💵 USD {s.precio}</span>}
                {s.sena && <span>🤝 Seña USD {s.sena}</span>}
              </div>
              {s.descripcion && (
                <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {s.descripcion}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "flex-start" }}>
              <button onClick={() => setEditingId(s.id)} style={btnIconStyle} title="Editar">
                ✏️
              </button>
              {confirmDelete === s.id ? (
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => { onDelete(s.id); setConfirmDelete(null); }} style={{ ...btnIconStyle, color: "#ff6b6b" }} title="Confirmar borrar">
                    ✓
                  </button>
                  <button onClick={() => setConfirmDelete(null)} style={btnIconStyle} title="Cancelar">
                    ✕
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(s.id)} style={btnIconStyle} title="Borrar">
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 20,
  color: "var(--text-primary)",
};

const btnAddStyle: React.CSSProperties = {
  background: "var(--green-accent)",
  color: "var(--text-primary)",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: 16,
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
};

const btnIconStyle: React.CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 14,
  color: "var(--text-muted)",
};

const emptyStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "48px 24px",
  background: "var(--surface)",
  borderRadius: 12,
  border: "1px dashed var(--border)",
};
