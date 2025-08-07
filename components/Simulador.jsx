const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value) => {
  return `${parseFloat(value).toFixed(2)}%`;
};
import { useState } from 'react';

export default function Simulador() {
  const [formData, setFormData] = useState({
    monto: '',
    tasa: '',
    promotor: 'Jr',
    comision: '',
    porcentajeFinantah: '',
    pi: '',
    calificacion: 'A',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/simular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error desconocido');
      setResult(data.resultado);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Logo de FINANTAH */}
      <div className="flex justify-center mb-4">
        <img src="/finantah-logo.png" alt="Logo FINANTAH" className="w-48" />
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">
        Simulador de Utilidad - FINANTAH
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="monto"
          placeholder="Monto del crédito"
          className="w-full p-2 border"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="tasa"
          placeholder="Tasa (%)"
          className="w-full p-2 border"
          onChange={handleChange}
          required
        />
        <select
          name="promotor"
          className="w-full p-2 border"
          onChange={handleChange}
        >
          <option value="Jr">Jr</option>
          <option value="Sr">Sr</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input
          type="number"
          name="comision"
          placeholder="Comisión de apertura (%)"
          className="w-full p-2 border"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="porcentajeFinantah"
          placeholder="% comisión que se queda FINANTAH"
          className="w-full p-2 border"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="pi"
          placeholder="P(i) (%)"
          className="w-full p-2 border"
          onChange={handleChange}
          required
        />
        <select
          name="calificacion"
          className="w-full p-2 border"
          onChange={handleChange}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Calculando...' : 'Simular'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
