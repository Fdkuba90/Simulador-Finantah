import React, { useState } from 'react';

export default function Simulador() {
  const [monto, setMonto] = useState('');
  const [tasa, setTasa] = useState('');
  const [rol, setRol] = useState('');
  const [comision, setComision] = useState('');
  const [porcentajeFinantah, setPorcentajeFinantah] = useState('');
  const [pi, setPI] = useState('');
  const [calificacion, setCalificacion] = useState('');
  const [resultado, setResultado] = useState(null);

  const calcularUtilidad = () => {
    const montoNum = parseFloat(monto);
    const tasaNum = parseFloat(tasa) / 100;
    const comisionNum = parseFloat(comision) / 100;
    const porcentajeFinantahNum = parseFloat(porcentajeFinantah) / 100;
    const piNum = parseFloat(pi) / 100;

    const comisionTotal = montoNum * comisionNum;
    const comisionFinantah = comisionTotal * porcentajeFinantahNum;
    const comisionPromotor = comisionTotal - comisionFinantah;

    const interes = montoNum * tasaNum;
    const costoFondeo = montoNum * 0.18; // 18% fijo
    const margenFinanciero = interes - costoFondeo;

    let comisionInteres = 0;
    if (rol === 'Jr') comisionInteres = montoNum * 0.005;
    else if (rol === 'Gerente') comisionInteres = montoNum * 0.01;
    else if (rol === 'Socio') comisionInteres = montoNum * 0.015;

    const margenContribucion = margenFinanciero + comisionFinantah - comisionInteres - comisionPromotor;
    const utilidadSinRiesgo = margenContribucion - (piNum * 0.45 * montoNum);
    const utilidadFinal = utilidadSinRiesgo - (0.045 * montoNum);

    let rentabilidadEsperada = 0.08;
    if (calificacion === 'B') rentabilidadEsperada = 0.09;
    else if (calificacion === 'C') rentabilidadEsperada = 0.10;
    else if (calificacion === 'D') rentabilidadEsperada = 0.11;

    const cumpleRentabilidad = utilidadFinal >= montoNum * rentabilidadEsperada;

    setResultado({
      utilidad: utilidadFinal,
      cumple: cumpleRentabilidad,
      rentabilidadEsperada,
    });
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <img
        src="/finantah-logo.png"
        alt="Logo FINANTAH"
        style={{ maxWidth: '200px', height: 'auto', marginBottom: '20px' }}
      />
      <h1 style={{ marginBottom: '30px' }}>Simulador de Utilidad - FINANTAH</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input placeholder="Monto del crédito" value={monto} onChange={(e) => setMonto(e.target.value)} />
        <input placeholder="Tasa (%)" value={tasa} onChange={(e) => setTasa(e.target.value)} />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">Selecciona Rol</option>
          <option value="Jr">Jr</option>
          <option value="Gerente">Gerente</option>
          <option value="Socio">Socio</option>
        </select>
        <input placeholder="Comisión de apertura (%)" value={comision} onChange={(e) => setComision(e.target.value)} />
        <input placeholder="% comisión que se queda FINANTAH" value={porcentajeFinantah} onChange={(e) => setPorcentajeFinantah(e.target.value)} />
        <input placeholder="P(i) (%)" value={pi} onChange={(e) => setPI(e.target.value)} />
        <select value={calificacion} onChange={(e) => setCalificacion(e.target.value)}>
          <option value="">Calificación</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button onClick={calcularUtilidad} style={{ padding: '10px', backgroundColor: '#0033cc', color: 'white', fontWeight: 'bold' }}>Simular</button>
      </div>

      {resultado && (
        <div style={{ marginTop: '30px', backgroundColor: '#f8f8f8', padding: '20px', borderRadius: '10px' }}>
          <p style={{ fontWeight: 'bold' }}>📊 UTILIDAD DEL CRÉDITO:</p>
          <p><strong>${resultado.utilidad.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></p>
          <p>
            {resultado.cumple ? '✅' : '❌'} {resultado.cumple ? 'Cumple' : 'NO cumple'} con la rentabilidad mínima esperada (
            {(resultado.rentabilidadEsperada * 100).toFixed(2)}%)
          </p>
        </div>
      )}
    </div>
  );
}
