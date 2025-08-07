// Simulator.jsx
import React, { useState } from 'react';

export default function Simulator() {
  const [formData, setFormData] = useState({
    monto: '',
    tasa: '',
    promotor: 'Jr',
    comision_apertura: '',
    comision_finantah: '',
    pi: '',
    calificacion: 'A'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
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
      const prompt = `Simula utilidad para el siguiente crédito:\n\n- Monto del crédito: $${formData.monto}\n- Tasa al cliente (anual en %): ${formData.tasa}\n- Tipo de promotor: ${formData.promotor}\n- Comisión por apertura total cobrada al cliente (en %): ${formData.comision_apertura}\n- Porcentaje de esa comisión que se queda FINANTAH (en %): ${formData.comision_finantah}\n- P(i): Probabilidad de incumplimiento del cliente (en %): ${formData.pi}\n- Calificación del cliente: ${formData.calificacion}`;

      const response = await fetch('/api/simulador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.error || 'Error al procesar la solicitud.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Simulador de Utilidad - FINANTAH</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="number" name="monto" placeholder="Monto del crédito" className="w-full p-2 border" onChange={handleChange} required />
        <input type="number" name="tasa" placeholder="Tasa al cliente (%)" className="w-full p-2 border" onChange={handleChange} required />
        <select name="promotor" className="w-full p-2 border" onChange={handleChange}>
          <option value="Jr">Jr</option>
          <option value="Sr">Sr</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input type="number" name="comision_apertura" placeholder="Comisión por apertura (%)" className="w-full p-2 border" onChange={handleChange} required />
        <input type="number" name="comision_finantah" placeholder="% de apertura para FINANTAH" className="w-full p-2 border" onChange={handleChange} required />
        <input type="number" name="pi" placeholder="P(i) (%)" className="w-full p-2 border" onChange={handleChange} required />
        <select name="calificacion" className="w-full p-2 border" onChange={handleChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
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
