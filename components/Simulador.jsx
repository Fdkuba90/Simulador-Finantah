import { useState } from 'react';

export default function Simulador() {
  const [form, setForm] = useState({
    monto: '',
    tasa: '',
    rol: '',
    comApertura: '',
    comFinantah: '',
    pi: '',
    calificacion: ''
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatterMoney = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  });

  const formatterPercent = new Intl.NumberFormat('es-MX', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let cleanValue = value.replace(/[$,%\s]/g, ''); // quitar $ , % espacios

    if (!/^\d*\.?\d*$/.test(cleanValue)) return; // evitar letras

    setForm({
      ...form,
      [name]: cleanValue
    });
  };

  const displayFormattedValue = (name) => {
    const value = form[name];
    if (value === '') return '';

    const num = parseFloat(value);

    if (name === 'monto') return formatterMoney.format(num);
    if (['tasa', 'comApertura', 'comFinantah', 'pi'].includes(name)) return `${num}%`;

    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const tasa = parseFloat(form.tasa);
      const monto = parseFloat(form.monto);
      const comApertura = parseFloat(form.comApertura);
      const comFinantah = parseFloat(form.comFinantah);
      const pi = parseFloat(form.pi);
      const rol = form.rol;
      const calificacion = form.calificacion;

      if (tasa < 26 || tasa > 36) throw new Error('Tasa fuera del rango permitido (26% - 36%)');
      if (comApertura < 1 || comApertura > 4) throw new Error('Comisión por apertura fuera del rango (1% - 4%)');
      if (comFinantah < 50) throw new Error('FINANTAH debe quedarse al menos con el 50% de la comisión');

      const costoFinanciero = 0.13;
      const interes = monto * (tasa / 100);
      const margenFinanciero = interes - (monto * costoFinanciero);
      const comisionTotal = monto * (comApertura / 100);
      const comisionFinantah = comisionTotal * (comFinantah / 100);
      const comisionPromotor = comisionTotal - comisionFinantah;

      const rolTasa = {
        'Jr': 0.01,
        'Gerente': 0.015,
        'Director': 0.02
      };

      const comInteresPromotor = interes * rolTasa[rol];

      const margenConComision = margenFinanciero + comisionFinantah;
      const margenContribucion = margenConComision - comisionPromotor - comInteresPromotor;
      const perdidaEsperada = (pi / 100) * 0.45 * monto;
      const utilidadSinRiesgo = margenContribucion - perdidaEsperada;
      const utilidad = utilidadSinRiesgo - (monto * 0.045);

      const minUtilidades = { A: 0.08, B: 0.09, C: 0.10, D: 0.11 };
      const cumple = utilidad >= (minUtilidades[calificacion] * monto);

      setResult(`
💰 UTILIDAD DEL CRÉDITO: 
${formatterMoney.format(utilidad)}

${cumple ? '✅ CUMPLE' : '❌ NO cumple'} con la rentabilidad mínima esperada (${(minUtilidades[calificacion] * 100).toFixed(2)}%)
      `);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <img src="/finantah-logo.png" alt="Logo FINANTAH" className="w-40 mb-4" />
      <h1 className="text-3xl font-bold mb-6 text-center">Simulador de Utilidad - FINANTAH</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
        <input type="text" name="monto" placeholder="Monto del crédito" value={displayFormattedValue('monto')} onChange={handleChange} required />
        <input type="text" name="tasa" placeholder="Tasa (%)" value={displayFormattedValue('tasa')} onChange={handleChange} required />
        <select name="rol" value={form.rol} onChange={handleChange} required>
          <option value="">Selecciona Rol</option>
          <option value="Jr">Jr</option>
          <option value="Gerente">Gerente</option>
          <option value="Director">Director</option>
        </select>
        <input type="text" name="comApertura" placeholder="Comisión de apertura (%)" value={displayFormattedValue('comApertura')} onChange={handleChange} required />
        <input type="text" name="comFinantah" placeholder="% comisión que se queda FINANTAH" value={displayFormattedValue('comFinantah')} onChange={handleChange} required />
        <input type="text" name="pi" placeholder="P(i) (%)" value={displayFormattedValue('pi')} onChange={handleChange} required />
        <select name="calificacion" value={form.calificacion} onChange={handleChange} required>
          <option value="">Calificación</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <button type="submit" className="bg-blue-700 text-white py-2 rounded" disabled={loading}>
          {loading ? 'Calculando...' : 'Simular'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded w-full max-w-sm">
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
