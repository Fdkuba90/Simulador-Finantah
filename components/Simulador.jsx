import { useState } from 'react';

export default function Simulator() {
  const [formData, setFormData] = useState({
    monto: '',
    tasa: '',
    promotor: 'Jr',
    comisionTotal: '',
    comisionFinantah: '',
    pi: '',
    calificacion: 'A'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(value);

  const formatPercent = (value) => `${parseFloat(value).toFixed(2)}%`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const monto = parseFloat(formData.monto);
    const tasa = parseFloat(formData.tasa);
    const comisionTotal = parseFloat(formData.comisionTotal);
    const comisionFinantah = parseFloat(formData.comisionFinantah);
    const pi = parseFloat(formData.pi);
    const { promotor, calificacion } = formData;

    // Validaciones
    if (tasa < 26 || tasa > 36) {
      setError('❌ La tasa debe estar entre 26% y 36%.');
      setLoading(false);
      return;
    }

    if (comisionTotal < 1 || comisionTotal > 4) {
      setError('❌ La comisión por apertura debe estar entre 1% y 4%.');
      setLoading(false);
      return;
    }

    if (comisionFinantah < 50) {
      setError('❌ FINANTAH debe quedarse con al menos el 50% de la comisión por apertura.');
      setLoading(false);
      return;
    }

    const rentabilidadMinima = {
      A: 0.08,
      B: 0.09,
      C: 0.10,
      D: 0.11
    }[calificacion] || 0.1;

    // Cálculos
    const interesCredito = monto * (tasa / 100);
    const costoFinanciero = monto * 0.1788;
    const margenFinanciero = interesCredito - costoFinanciero;

    const comisionMonto = monto * (comisionTotal / 100);
    const comisionFinantahMonto = comisionMonto * (comisionFinantah / 100);

    const comisionPromotorInteres = promotor === 'Jr' ? 0.05 : promotor === 'Sr' ? 0.08 : 0.10;
    const comisionPromotorApertura = 1 - comisionFinantah / 100;

    const comisionPromotorInteresMonto = margenFinanciero * comisionPromotorInteres;
    const comisionPromotorAperturaMonto = comisionMonto * comisionPromotorApertura;

    const margenConComision = margenFinanciero + comisionFinantahMonto;
    const margenContribucion =
      margenConComision - comisionPromotorInteresMonto - comisionPromotorAperturaMonto;

    const perdidaEsperada = pi / 100 * 0.45 * monto;
    const utilidadSinRiesgo = margenContribucion - perdidaEsperada;
    const utilidadCredito = utilidadSinRiesgo - 0.045 * monto;

    const utilidadSobreMonto = utilidadCredito / monto;

    let mensaje = `🧮 Utilidad del crédito: ${formatCurrency(utilidadCredito)}\n`;

    if (utilidadSobreMonto >= rentabilidadMinima) {
      mensaje += `✅ Cumple con la rentabilidad mínima esperada (${formatPercent(
        rentabilidadMinima * 100
      )})`;
    } else {
      mensaje += `❌ NO cumple con la rentabilidad mínima esperada (${formatPercent(
        rentabilidadMinima * 100
      )})`;
    }

    setResult(mensaje);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="number"
          name="monto"
          placeholder="Monto del crédito"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="tasa"
          placeholder="Tasa anual (%)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <select
          name="promotor"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        >
          <option value="Jr">Promotor Jr</option>
          <option value="Sr">Promotor Sr</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input
          type="number"
          name="comisionTotal"
          placeholder="Comisión apertura total (%)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="comisionFinantah"
          placeholder="% comisión que se queda FINANTAH"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="pi"
          placeholder="P(i) Probabilidad de incumplimiento (%)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <select
          name="calificacion"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        >
          <option value="A">Calificación A</option>
          <option value="B">Calificación B</option>
          <option value="C">Calificación C</option>
          <option value="D">Calificación D</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Calculando...' : 'Simular'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded w-full max-w-md">
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
