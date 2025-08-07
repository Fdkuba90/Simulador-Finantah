import React, { useState } from 'react';

export default function Simulator() {
  const [form, setForm] = useState({
    monto: '',
    tasa: '',
    tipoPromotor: 'Jr',
    comisionApertura: '',
    porcentajeFinantah: '',
    pi: '',
    calificacion: 'A',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  const calcular = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const monto = parseFloat(form.monto);
    const tasa = parseFloat(form.tasa) / 100;
    const tipoPromotor = form.tipoPromotor;
    const comisionApertura = parseFloat(form.comisionApertura) / 100;
    const porcentajeFinantah = parseFloat(form.porcentajeFinantah) / 100;
    const pi = parseFloat(form.pi) / 100;
    const calificacion = form.calificacion;

    const tasasPermitidas = [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
    const comisionesPermitidas = [1, 1.5, 2, 2.5, 3, 3.5, 4];

    if (!tasasPermitidas.includes(form.tasa * 1)) {
      setError('Tasa inválida. Debe estar entre 26% y 36% en saltos de 1%.');
      return;
    }

    if (!comisionesPermitidas.includes(form.comisionApertura * 1)) {
      setError('Comisión por apertura inválida. Debe estar entre 1% y 4% en saltos de 0.5%.');
      return;
    }

    if (porcentajeFinantah < 0.5) {
      setError('Escenario inválido: FINANTAH no puede quedarse con menos del 50% de la comisión por apertura.');
      return;
    }

    const tasasRentabilidad = {
      A: 0.08,
      B: 0.09,
      C: 0.10,
      D: 0.11,
    };

    const rentabilidadMinima = tasasRentabilidad[calificacion];
    const tasaFondeo = 0.1788;
    const margenFinanciero = monto * (tasa - tasaFondeo);
    const comisionFinantah = monto * comisionApertura * porcentajeFinantah;

    const comisionPorInteres = tipoPromotor === 'Jr' ? 0.05 : tipoPromotor === 'Sr' ? 0.08 : 0.10;
    const comisionInteres = margenFinanciero * comisionPorInteres;
    const comisionSobreApertura = monto * comisionApertura * (1 - porcentajeFinantah);

    const margenConComision = margenFinanciero + comisionFinantah;
    const margenContribucion = margenConComision - comisionInteres - comisionSobreApertura;
    const utilidadSinRiesgo = margenContribucion - (pi * 0.45 * monto);
    const utilidadFinal = utilidadSinRiesgo - (0.045 * monto);

    const cumple = utilidadFinal >= (monto * rentabilidadMinima);

    setResult(`
🧮 UTILIDAD DEL CRÉDITO:
${formatter.format(utilidadFinal)}

✅ ${cumple ? 'Cumple' : 'NO cumple'} con la rentabilidad mínima esperada (${(rentabilidadMinima * 100).toFixed(2)}%)
    `);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <img src="/finantah-logo.png" alt="Logo FINANTAH" style={{ width: '150px', marginBottom: '10px' }} />
        <h1 style={{ marginBottom: '30px' }}>Simulador de Utilidad - FINANTAH</h1>
      </div>

      <form onSubmit={calcular} style={{ display: 'grid', gap: '10px' }}>
        <input name="monto" placeholder="Monto del crédito" onChange={handleChange} required />
        <input name="tasa" placeholder="Tasa anual (%)" onChange={handleChange} required />
        <select name="tipoPromotor" onChange={handleChange}>
          <option value="Jr">Jr</option>
          <option value="Sr">Sr</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input name="comisionApertura" placeholder="% Comisión apertura" onChange={handleChange} required />
        <input name="porcentajeFinantah" placeholder="% Comisión que se queda FINANTAH" onChange={handleChange} required />
        <input name="pi" placeholder="P(i) (%)" onChange={handleChange} required />
        <select name="calificacion" onChange={handleChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button type="submit" style={{ backgroundColor: '#1E40AF', color: '#fff', padding: '10px', borderRadius: '6px' }}>
          Simular
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {result && (
        <pre style={{ backgroundColor: '#f4f4f4', padding: '15px', marginTop: '20px', borderRadius: '8px' }}>{result}</pre>
      )}
    </div>
  );
}
