import { useState } from 'react';

export default function Simulator() {
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
    maximumFractionDigits: 2,
  });

  const formatInputValue = (name, value) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return '';
    if (name === 'monto') return formatterMoney.format(num);
    if (['tasa', 'comApertura', 'comFinantah', 'pi'].includes(name)) return `${num}%`;
    return value;
  };

  const parseRawValue = (value) => {
    return value.replace(/[$,%\s]/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const rawValue = parseRawValue(value);
    if (!/^\d*\.?\d*$/.test(rawValue)) return;
    setForm({
      ...form,
      [name]: rawValue,
    });
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

      const costoFondeo = 0.1788;
      const gastosOperativos = 0.045;
      const interes = monto * (tasa / 100);
      const margenFinanciero = interes - (monto * costoFondeo);
      const comisionTotal = monto * (comApertura / 100);
      const comisionFinantah = comisionTotal * (comFinantah / 100);
      const comisionPromotor = comisionTotal - comisionFinantah;

      const rolTasa = {
        'Jr': 0.05,
        'Sr': 0.08,
        'Gerente': 0.10
      };

      const comInteresPromotor = margenFinanciero * rolTasa[rol];

      const margenConComision = margenFinanciero + comisionFinantah;
      const margenContribucion = margenConComision - comisionPromotor - comInteresPromotor;
      const perdidaEsperada = (pi / 100) * 0.45 * monto;
      const utilidadSinRiesgo = margenContribucion - perdidaEsperada;
      const utilidad = utilidadSinRiesgo - (monto * gastosOperativos);

      const minUtilidades = { A: 0.08, B: 0.09, C: 0.10, D: 0.11 };
      const cumple = utilidad >= (minUtilidades[calificacion] * monto);

      setResult(`
📊 UTILIDAD DEL CRÉDITO: \n${formatterMoney.format(utilidad)}
\n${cumple ? '✅ Cumple' : '❌ No cumple'} con la rentabilidad mínima esperada (${formatterPercent.format(minUtilidades[calificacion])})
      `);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <img src="/finantah-logo.png" alt="Logo FINANTAH" className="w-32 mb-4" />
      <h1 className="text-3xl font-bold mb-6 text-center">Simulador de Utilidad - FINANTAH</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
        <input name="monto" value={formatInputValue('monto', form.monto)} onChange={handleChange} placeholder="Monto del crédito" required />
        <input name="tasa" value={formatInputValue('tasa', form.tasa)} onChange={handleChange} placeholder="Tasa anual (%)" required />
        <select name="rol" value={form.rol} onChange={handleChange} required>
          <option value="">Tipo de promotor</option>
          <option value="Jr">Jr</option>
          <option value="Sr">Sr</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input name="comApertura" value={formatInputValue('comApertura', form.comApertura)} onChange={handleChange} placeholder="Comisión por apertura (%)" required />
        <input name="comFinantah" value={formatInputValue('comFinantah', form.comFinantah)} onChange={handleChange} placeholder="% que se queda FINANTAH" required />
        <input name="pi" value={formatInputValue('pi', form.pi)} onChange={handleChange} placeholder="Probabilidad de Incumplimiento (P(i))" required />
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
