"use client";

import { useState } from "react";
import { Salida } from "./types";

interface Props {
  salidas: Salida[];
  onGoToSalidas: () => void;
}

type Formato = "comenta_info" | "link_bio" | "whatsapp" | "pregunta";
type Tono = "aventura" | "urgencia" | "inspiracion";

const FORMATOS: { value: Formato; label: string; emoji: string }[] = [
  { value: "comenta_info", label: "Comenta INFO", emoji: "💬" },
  { value: "link_bio", label: "Link en bio", emoji: "🔗" },
  { value: "whatsapp", label: "WhatsApp", emoji: "📱" },
  { value: "pregunta", label: "Pregunta interactiva", emoji: "❓" },
];

const TONOS: { value: Tono; label: string; desc: string }[] = [
  { value: "aventura", label: "Aventura", desc: "Energético y épico" },
  { value: "urgencia", label: "Urgencia", desc: "Últimos cupos" },
  { value: "inspiracion", label: "Inspiración", desc: "Naturaleza y bienestar" },
];

export default function GeneradorTab({ salidas, onGoToSalidas }: Props) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [formato, setFormato] = useState<Formato>("comenta_info");
  const [tono, setTono] = useState<Tono>("aventura");
  const [cantidad, setCantidad] = useState(2);
  const [loading, setLoading] = useState(false);
  const [variantes, setVariantes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const salida = salidas.find((s) => s.id === selectedId);

  const handleGenerar = async () => {
    if (!salida) return;
    setLoading(true);
    setError("");
    setVariantes([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salida, formato, tono, cantidad }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      setVariantes(data.variantes);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al generar");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  if (salidas.length === 0) {
    return (
      <div style={emptyStyle}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>⛰️</p>
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: 20 }}>
          Primero cargá una salida para poder generar CTAs.
        </p>
        <button onClick={onGoToSalidas} style={btnPrimaryStyle}>
          Ir a Salidas →
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Selector de salida */}
      <div style={cardStyle}>
        <label style={labelStyle}>⛰️ Salida</label>
        <select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setVariantes([]); }}>
          <option value="">Elegí una salida...</option>
          {salidas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre} — {s.fecha}
            </option>
          ))}
        </select>
        {salida && (
          <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)" }}>
            {salida.precio && <span>💵 USD {salida.precio}</span>}
            {salida.sena && <span style={{ marginLeft: 12 }}>🤝 Seña USD {salida.sena}</span>}
            {salida.descripcion && (
              <div style={{ marginTop: 6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {salida.descripcion.substring(0, 150)}{salida.descripcion.length > 150 ? "..." : ""}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Formato */}
      <div style={cardStyle}>
        <label style={labelStyle}>📣 Formato de CTA</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {FORMATOS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormato(f.value)}
              style={{
                ...chipStyle,
                ...(formato === f.value ? chipActiveStyle : {}),
              }}
            >
              <span style={{ fontSize: 18 }}>{f.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tono */}
      <div style={cardStyle}>
        <label style={labelStyle}>🎭 Tono</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TONOS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTono(t.value)}
              style={{
                ...toneChipStyle,
                ...(tono === t.value ? chipActiveStyle : {}),
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</span>
              <span style={{ fontSize: 12, color: tono === t.value ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>
                {t.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cantidad */}
      <div style={cardStyle}>
        <label style={labelStyle}>🔢 Variantes</label>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setCantidad(n)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 8,
                border: `2px solid ${cantidad === n ? "var(--green-bright)" : "var(--border)"}`,
                background: cantidad === n ? "var(--green-accent)" : "var(--surface-2)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Botón generar */}
      <button
        onClick={handleGenerar}
        disabled={!selectedId || loading}
        style={{
          ...btnPrimaryStyle,
          opacity: !selectedId || loading ? 0.6 : 1,
          cursor: !selectedId || loading ? "not-allowed" : "pointer",
          fontSize: 16,
          padding: "14px 24px",
          position: "relative",
        }}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
            Generando CTAs...
          </span>
        ) : (
          "⚡ Generar CTAs"
        )}
      </button>

      {/* Error */}
      {error && (
        <div style={{ background: "#3d1515", border: "1px solid #7a2d2d", borderRadius: 10, padding: "12px 16px", color: "#ff8a8a", fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Resultados */}
      {variantes.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--green-light)", margin: 0 }}>
            ✅ {variantes.length} CTA{variantes.length > 1 ? "s" : ""} generado{variantes.length > 1 ? "s" : ""}
          </h3>
          {variantes.map((v, idx) => (
            <div key={idx} style={ctaCardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Variante {idx + 1}
                </span>
                <button
                  onClick={() => handleCopy(v, idx)}
                  style={{
                    background: copied === idx ? "var(--green-accent)" : "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {copied === idx ? "✓ Copiado" : "📋 Copiar"}
                </button>
              </div>
              <pre style={ctaTextStyle}>{v}</pre>
            </div>
          ))}

          <button
            onClick={handleGenerar}
            style={{ ...btnPrimaryStyle, background: "transparent", border: "1px solid var(--green-accent)", color: "var(--green-bright)" }}
          >
            🔄 Regenerar nuevas variantes
          </button>
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 10,
  fontSize: 12,
  fontWeight: 700,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const chipStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  padding: "12px 8px",
  borderRadius: 10,
  border: "2px solid var(--border)",
  background: "var(--surface-2)",
  color: "var(--text-primary)",
  cursor: "pointer",
  transition: "all 0.15s",
};

const toneChipStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 14px",
  borderRadius: 10,
  border: "2px solid var(--border)",
  background: "var(--surface-2)",
  color: "var(--text-primary)",
  cursor: "pointer",
  transition: "all 0.15s",
  textAlign: "left",
};

const chipActiveStyle: React.CSSProperties = {
  border: "2px solid var(--green-bright)",
  background: "var(--green-accent)",
};

const btnPrimaryStyle: React.CSSProperties = {
  background: "var(--green-accent)",
  color: "var(--text-primary)",
  border: "none",
  borderRadius: 10,
  padding: "12px 20px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  width: "100%",
  textAlign: "center",
};

const ctaCardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: 16,
};

const ctaTextStyle: React.CSSProperties = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: 14,
  lineHeight: 1.7,
  color: "var(--text-primary)",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  margin: 0,
};

const emptyStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "60px 24px",
  background: "var(--surface)",
  borderRadius: 12,
  border: "1px dashed var(--border)",
};
