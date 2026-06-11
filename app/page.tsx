"use client";

import { useState, useEffect } from "react";
import { Salida } from "./components/types";
import SalidasTab from "./components/SalidasTab";
import GeneradorTab from "./components/GeneradorTab";

type Tab = "generar" | "salidas";

export default function Home() {
  const [tab, setTab] = useState<Tab>("generar");
  const [salidas, setSalidas] = useState<Salida[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("caminantes_salidas");
    if (stored) {
      try {
        setSalidas(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const persist = (updated: Salida[]) => {
    setSalidas(updated);
    localStorage.setItem("caminantes_salidas", JSON.stringify(updated));
  };

  const handleAdd = (s: Salida) => persist([...salidas, s]);
  const handleEdit = (s: Salida) => persist(salidas.map((x) => (x.id === s.id ? s : x)));
  const handleDelete = (id: string) => persist(salidas.filter((x) => x.id !== id));

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--green-bright)", letterSpacing: "-0.02em" }}>
          ⛰️ CTA Generator
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
          Caminantes de Montaña
        </div>
      </header>

      {/* Tabs */}
      <div style={tabBarStyle}>
        <button
          onClick={() => setTab("generar")}
          style={{ ...tabStyle, ...(tab === "generar" ? tabActiveStyle : {}) }}
        >
          ⚡ Generar
        </button>
        <button
          onClick={() => setTab("salidas")}
          style={{ ...tabStyle, ...(tab === "salidas" ? tabActiveStyle : {}) }}
        >
          📋 Salidas
          {salidas.length > 0 && (
            <span style={badgeStyle}>{salidas.length}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {tab === "generar" ? (
          <GeneradorTab salidas={salidas} onGoToSalidas={() => setTab("salidas")} />
        ) : (
          <SalidasTab
            salidas={salidas}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
}

const headerStyle: React.CSSProperties = {
  padding: "16px 20px 12px",
  borderBottom: "1px solid var(--border)",
  background: "var(--surface)",
};

const tabBarStyle: React.CSSProperties = {
  display: "flex",
  borderBottom: "1px solid var(--border)",
  background: "var(--surface)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const tabStyle: React.CSSProperties = {
  flex: 1,
  padding: "14px 16px",
  background: "transparent",
  border: "none",
  borderBottom: "3px solid transparent",
  color: "var(--text-muted)",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  transition: "all 0.15s",
};

const tabActiveStyle: React.CSSProperties = {
  color: "var(--green-bright)",
  borderBottom: "3px solid var(--green-bright)",
};

const badgeStyle: React.CSSProperties = {
  background: "var(--green-accent)",
  color: "var(--text-primary)",
  borderRadius: 10,
  fontSize: 11,
  fontWeight: 700,
  padding: "1px 6px",
  minWidth: 18,
  textAlign: "center",
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: 20,
  maxWidth: 600,
  margin: "0 auto",
  width: "100%",
};
