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

    if (isNaN(montoNum) || isNaN(tasaNum) || isNaN(comisionNum) || isNaN(porcentajeFinantahNum) || isNaN(piNum)) {
      setResultado({ error: 'Por favor completa todos los campos correctamente.' });
      return;
    }

    if (porcentajeFinantahNum < 0.5) {
      setResultado({ error: 'Escenario inválido: FINANTAH no puede quedarse con menos del 50% de la comisión por apertura.' });
      return;
    }

    if (tasaNum < 0.26 || tasaNum > 0.36) {
      setResultado({ error: 'Escenario inválido: la tasa ofrecida está fuera del rango permitido (26% - 36%).' });
      return;
    }

    if (comisionNum < 0.01 || comisionNum > 0.04) {
      setResultado({ error: 'Escenario inválido: la comisión por apertura debe estar entre 1% y 4%.' });
      return;
    }

    const costoFondeo = montoNum * 0.1788; // 17.88% fijo
    const interes = montoNum * tasaNum;
    const margenFinanciero = interes - costoFondeo;

    // Comisión por interés sobre margen financiero
    let porcentajeComisionInteres = 0;
    if (rol === 'Jr') porcentajeComisionInteres = 0.05;
    else if (rol === 'Sr') porcentajeComisionInteres = 0.08;
    else if (rol === 'Gerente') porcentajeComisionInteres = 0.10;

    const comisionInteres = margenFinanciero * porcentajeComisionInteres;
    const comisionTotal = montoNum * comisionNum;
    const comisionFinantah = comisionTotal * porcentajeFinantahNum;
    const comisionPromotor = comisionTotal - comisionFinantah;

    const margenContribucion = margenFinanciero + comisionFinantah - comisionInteres - comisionPromotor;
    const utilidadSinRiesgo = margenContribucion - (piNum * 0.45 * montoNum);
    const utilidadFinal = utilidadSinRiesgo - (0.045 * montoNum); // 4.5% gastos operativos

    let rentabilidadEsperada = 0.08;
    if (calificacion === 'B') rentabilidadEsperada = 0.09;
    else if (calificacion === 'C') rentabilidadEsperada = 0.10;
    else if (calificacion === 'D') rentabilidadEsperada = 0.11;

    const cumpleRentabilidad = utilidadFinal >= montoNum * rentabilidadEsperada;

    setResultado({ utilidad: utilidadFinal, cumple: cumpleRentabilidad, rentabilidadEsperada });
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <img
        src="/finantah-logo.png"
        alt="Logo FINANTAH"
        style={{ maxWidth: '120px', height: 'auto', marginBottom: '20px' }}
      />
      <h1>Simulador de Utilidad - FINANTAH</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input placeholder="Monto del crédito" value={monto} onChange={(e) => setMonto(e.target.value)} />
        <input placeholder="Tasa (%)" value={tasa} onChange={(e) => setTasa(e.target.value)} />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">Selecciona Rol</option>
          <option value="Jr">Jr</option>
          <option value="Sr">Sr</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input placeholder="Comisión apertura (%)" value={comision} onChange={(e) => setComision(e.target.value)} />
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
        <div style={{ marginTop: '30px', backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '10px' }}>
          {resultado.error ? (
            <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ {resultado.error}</p>
          ) : (
            <>
              <p style={{ fontWeight: 'bold' }}>📊 Utilidad del crédito:</p>
              <p><strong>${resultado.utilidad.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></p>
              <p>
                {resultado.cumple ? '✅' : '❌'} {resultado.cumple ? 'Cumple' : 'NO cumple'} con la rentabilidad mínima esperada ({(resultado.rentabilidadEsperada * 100).toFixed(2)}%)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
