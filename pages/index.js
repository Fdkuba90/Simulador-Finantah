// pages/index.js
import Head from 'next/head';
import Simulator from '../components/Simulator';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
      <Head>
        <title>Simulador de Utilidad - FINANTAH</title>
      </Head>

      {/* Logo más pequeño y proporcional */}
      <img
        src="/finantah-logo.png"
        alt="Logo FINANTAH"
        style={{ width: '160px', height: 'auto', marginTop: '20px' }}
      />

      <h1 className="text-3xl font-bold text-center mb-8 mt-4">
        Simulador de Utilidad - FINANTAH
      </h1>

      <Simulator />
    </div>
  );
}


// components/Simulator.jsx
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(value);
  };

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

    if (tasa < 26 || tasa > 36) {
      setError('Escenario inválido: la tasa debe estar entre 26% y 36%.');
      setLoading(false);
      return;
    }

    if (comisionTotal < 1 || comisionTotal > 4) {
      setError('Escenario inválido: la comisión por apertura debe estar entre 1% y 4%.');
      setLoading(false);
      return;
    }

    if (comisionFinantah < 50) {
      setError('Escenario inválido: FINANTAH no puede quedarse con menos del 50% de la comisión por apertura.');
      setLoading(false);
      return;
    }

    const tasasMinimas = { A: 0.08, B: 0.09, C: 0.10, D: 0.11 };
    const rentabilidadMinima = tasasMinimas[calificacion] || 0.1;

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
    const margenContribucion = margenConComision - comisionPromotorInteresMonto - comisionPromotorAperturaMonto;

    const perdidaEsperada = pi / 100 * 0.45 * monto;
    const utilidadSinRiesgo = margenContribucion - perdidaEsperada;
    const utilidadCredito = utilidadSinRiesgo - (0.045 * monto);
    const utilidadSobreMonto = utilidadCredito / monto;

    let mensajeResultado = `🧮 UTILIDAD DEL CRÉDITO:\n${formatCurrency(utilidadCredito)}\n`;

    if (utilidadSobreMonto >= rentabilidadMinima) {
      mensajeResultado += `\n✅ Cumple con la rentabilidad mínima esperada (${formatPercent(rentabilidadMinima * 100)})`;
    } else {
      mensajeResultado += `\n❎ NO cumple con la rentabilidad mínima esperada (${formatPercent(rentabilidadMinima * 100)})`;
    }

    setResult(mensajeResultado);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input type="number" name="monto" placeholder="Monto del crédito" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="number" name="tasa" placeholder="Tasa (%)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <select name="promotor" className="w-full p-2 border rounded" onChange={handleChange}>
          <option value="Jr">Jr</option>
          <option value="Sr">Sr</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input type="number" name="comisionTotal" placeholder="Comisión de apertura (%)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="number" name="comisionFinantah" placeholder="% comisión que se queda FINANTAH" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="number" name="pi" placeholder="P(i) (%)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <select name="calificacion" className="w-full p-2 border rounded" onChange={handleChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={loading}>
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
