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

  // Utilidades de formato para inputs
  const formatearMoneda = (valor) => {
    const num = valor.replace(/\D/g, '');
    return num ? parseInt(num).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }) : '';
  };

  const formatearPorcentaje = (valor) => {
    const num = valor.replace(/[^\d.]/g, '');
    if (!num) return '';
    const parsed = parseFloat(num);
    return isNaN(parsed) ? '' : `${parsed}%`;
  };

  const desformatearNumero = (valor) => parseFloat(valor.replace(/[^0-9.]/g, '')) || 0;

  const calcularUtilidad = () => {
    const montoNum = desformatearNumero(monto);
    const tasaNum = desformatearNumero(tasa) / 100;
    const comisionNum = desformatearNumero(comision) / 100;
    const porcentajeFinantahNum = desformatearNumero(porcentajeFinantah) / 100;
    const piNum = desformatearNumero(pi) / 100;

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

    // Cálculos financieros
    const costoFondeo = montoNum * 0.1788; // 17.88% fijo
    const interes = montoNum * tasaNum;
    const margenFinanciero = interes - costoFondeo;

    // Comisión sobre interés para promotor, según rol
    let porcentajeComisionInteres = 0;
    if (rol === 'Jr') porcentajeComisionInteres = 0.05;
    else if (rol === 'Sr') porcentajeComisionInteres = 0.08;
    else if (rol === 'Gerente') porcentajeComisionInteres = 0.10;

    const comisionInteres = margenFinanciero * porcentajeComisionInteres;

    // Comisión por apertura (total y parte para FINANTAH)
    const comisionTotal = montoNum * comisionNum;
    const comisionFinantah = comisionTotal * porcentajeFinantahNum;
    // const comisionPromotor = comisionTotal - comisionFinantah; ← ya no se usa

    // ✅ Margen de contribución solo considera utilidad neta para FINANTAH
    const margenContribucion = margenFinanciero + comisionFinantah - comisionInteres;

    // Riesgo crediticio y gastos operativos
    const utilidadSinRiesgo = margenContribucion - (piNum * 0.45 * montoNum);
    const utilidadFinal = utilidadSinRiesgo - (0.045 * montoNum); // 4.5% gastos operativos

    // Rentabilidad mínima esperada según calificación
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
        style={{ maxWidth: '300px', height: 'auto', marginBottom: '20px' }}
      />
      <h1>Simulador de Utilidad - FINANTAH</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '200px', margin: '0 auto' }}>
        <input
          placeholder="Monto del crédito"
          value={monto}
          onChange={(e) => setMonto(formatearMoneda(e.target.value))}
        />
        <input
          placeholder="Tasa (%)"
          value={tasa}
          onChange={(e) => setTasa(formatearPorcentaje(e.target.value))}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">Selecciona Rol</option>
          <option value="Jr">Jr</option>
          <option value="Sr">Sr</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input
          placeholder="Comisión apertura (%)"
          value={comision}
          onChange={(e) => setComision(formatearPorcentaje(e.target.value))}
        />
        <input
          placeholder="% comisión que se queda FINANTAH"
          value={porcentajeFinantah}
          onChange={(e) => setPorcentajeFinantah(formatearPorcentaje(e.target.value))}
        />
        <input
          placeholder="P(i) (%)"
          value={pi}
          onChange={(e) => setPI(formatearPorcentaje(e.target.value))}
        />
        <select value={calificacion} onChange={(e) => setCalificacion(e.target.value)}>
          <option value="">Calificación</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button
          onClick={calcularUtilidad}
          style={{ padding: '10px', backgroundColor: '#0033cc', color: 'white', fontWeight: 'bold' }}
        >
          Simular
        </button>
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
