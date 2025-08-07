import { useState } from "react";
import Image from "next/image";

export default function Simulator() {
  const [monto, setMonto] = useState("");
  const [tasa, setTasa] = useState("");
  const [rol, setRol] = useState("");
  const [comision, setComision] = useState("");
  const [comisionFinantah, setComisionFinantah] = useState("");
  const [pi, setPi] = useState("");
  const [calificacion, setCalificacion] = useState("");
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const rentabilidadMinima = {
    A: 0.08,
    B: 0.09,
    C: 0.1,
    D: 0.11,
  };

  const formatterPeso = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const formatterPorcentaje = new Intl.NumberFormat("es-MX", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const limpiarNumero = (valor) => {
    return parseFloat(valor.toString().replace(/[$,%\s]/g, "").replace(",", ""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const montoNum = limpiarNumero(monto);
    const tasaNum = limpiarNumero(tasa) / 100;
    const comisionNum = limpiarNumero(comision) / 100;
    const comisionFinantahNum = limpiarNumero(comisionFinantah) / 100;
    const piNum = limpiarNumero(pi) / 100;

    if (tasaNum < 0.26 || tasaNum > 0.36) {
      setResultado(null);
      setMensaje("❌ La tasa debe estar entre 26% y 36%");
      return;
    }

    if (comisionNum < 0.01 || comisionNum > 0.04) {
      setResultado(null);
      setMensaje("❌ La comisión de apertura debe estar entre 1% y 4%");
      return;
    }

    if (comisionFinantahNum < 0.5) {
      setResultado(null);
      setMensaje("❌ FINANTAH debe quedarse al menos con el 50% de la comisión");
      return;
    }

    const interesCredito = montoNum * tasaNum;
    const costoFinanciero = montoNum * 0.18;
    const margenFinanciero = interesCredito - costoFinanciero;
    const comisionAperturaFinantah = montoNum * comisionNum * comisionFinantahNum;
    const comisionAperturaPromotor = montoNum * comisionNum * (1 - comisionFinantahNum);
    const comisionInteresPromotor = rol === "Jr" ? 0 : montoNum * tasaNum * 0.1;
    const margenContribucion =
      margenFinanciero + comisionAperturaFinantah - comisionAperturaPromotor - comisionInteresPromotor;
    const utilidadSinRiesgo = margenContribucion - piNum * 0.45 * montoNum;
    const utilidad = utilidadSinRiesgo - 0.045 * montoNum;

    setResultado(utilidad);
    const rentabilidad = utilidad / montoNum;
    const cumple = rentabilidad >= rentabilidadMinima[calificacion];
    const simbolo = cumple ? "✅" : "❌";
    const texto = cumple
      ? `Cumple con la rentabilidad mínima esperada (${(rentabilidadMinima[calificacion] * 100).toFixed(2)}%)`
      : `NO cumple con la rentabilidad mínima esperada (${(rentabilidadMinima[calificacion] * 100).toFixed(2)}%)`;

    setMensaje(`${simbolo} ${texto}`);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ marginBottom: "20px" }}>
        <Image src="/logo-finantah.png" alt="FINANTAH Logo" width={120} height={120} />
      </div>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Simulador de Utilidad - FINANTAH</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
        <input placeholder="Monto del crédito" value={monto} onChange={(e) => setMonto(e.target.value)} />
        <input placeholder="Tasa (%)" value={tasa} onChange={(e) => setTasa(e.target.value)} />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">Selecciona Rol</option>
          <option value="Jr">Jr</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input placeholder="Comisión de apertura (%)" value={comision} onChange={(e) => setComision(e.target.value)} />
        <input placeholder="% comisión que se queda FINANTAH" value={comisionFinantah} onChange={(e) => setComisionFinantah(e.target.value)} />
        <input placeholder="P(i) (%)" value={pi} onChange={(e) => setPi(e.target.value)} />
        <select value={calificacion} onChange={(e) => setCalificacion(e.target.value)}>
          <option value="">Calificación</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button type="submit" style={{ background: "#1739B9", color: "white", padding: "10px", fontWeight: "bold", border: "none" }}>
          Simular
        </button>
      </form>

      {resultado !== null && (
        <div style={{ marginTop: "30px", backgroundColor: "#f4f4f4", padding: "20px", borderRadius: "12px" }}>
          <h3 style={{ fontSize: "20px" }}>📊 UTILIDAD DEL CRÉDITO:</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>{formatterPeso.format(resultado)}</p>
          <p style={{ fontSize: "16px" }}>{mensaje}</p>
        </div>
      )}
    </div>
  );
}
