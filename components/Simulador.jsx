import React, { useState } from 'react';

const Simulador = () => {
  const [monto, setMonto] = useState(0);
  const [tasa, setTasa] = useState(28);
  const [promotor, setPromotor] = useState('Jr');
  const [comisionAperturaTotal, setComisionAperturaTotal] = useState(1);
  const [comisionFinantah, setComisionFinantah] = useState(50);
  const [pi, setPi] = useState(1);
  const [calificacion, setCalificacion] = useState('A');
  const [resultado, setResultado] = useState('');

  const calcular = () => {
    if (tasa < 26 || tasa > 36) return setResultado('❌ Tasa fuera de rango permitido (26%-36%)');
    if (comisionAperturaTotal < 1 || comisionAperturaTotal > 4) return setResultado('❌ Comisión por apertura fuera de rango (1%-4%)');
    if (comisionFinantah < 50) return setResultado('❌ Escenario inválido: FINANTAH no puede quedarse con menos del 50% de la comisión por apertura');

    const tasaFondeo = 17.88 / 100;
    const tasaCredito = tasa / 100;
    const aperturaTotal = comisionAperturaTotal / 100;
    const porcentajeFinantah = comisionFinantah / 100;

    const interesesCredito = monto * tasaCredito;
    const costoFinanciero = monto * tasaFondeo;
    const margenFinanciero = interesesCredito - costoFinanciero;

    const comisionFinantahPesos = monto * aperturaTotal * porcentajeFinantah;
    const margenMasComision = margenFinanciero + comisionFinantahPesos;

    const porcentajeInteresPromotor = promotor === 'Jr' ? 0.05 : promotor === 'Sr' ? 0.08 : 0.10;
    const comisionPorInteres = margenFinanciero * porcentajeInteresPromotor;
    const comisionPorAperturaPromotor = monto * aperturaTotal * (1 - porcentajeFinantah);

    const margenContribucion = margenMasComision - comisionPorInteres - comisionPorAperturaPromotor;
    const utilidadSinRiesgo = margenContribucion - (pi / 100 * 0.45 * monto);
    const utilidad = utilidadSinRiesgo - (0.045 * monto);

    const minEsperada = calificacion === 'A' ? 0.08 : calificacion === 'B' ? 0.09 : calificacion === 'C' ? 0.10 : 0.11;
    const utilidadMinima = monto * minEsperada;

    if (utilidad < utilidadMinima) {
      setResultado(`❌ Utilidad de $${utilidad.toFixed(2)} insuficiente. Mínimo esperado: $${utilidadMinima.toFixed(2)}`);
    } else {
      setResultado(`✅ Utilidad esperada: $${utilidad.toFixed(2)} (mínimo requerido: $${utilidadMinima.toFixed(2)})`);
    }
  };

  return (
    <div>
      <h1>Simulador de Utilidad - FINANTAH</h1>
      <input type="number" placeholder="Monto del crédito" onChange={(e) => setMonto(Number(e.target.value))} />
      <input type="number" placeholder="Tasa (%)" onChange={(e) => setTasa(Number(e.target.value))} />
      <select onChange={(e) => setPromotor(e.target.value)}>
        <option>Jr</option>
        <option>Sr</option>
        <option>Gerente</option>
      </select>
      <input type="number" placeholder="% Comisión Apertura" onChange={(e) => setComisionAperturaTotal(Number(e.target.value))} />
      <input type="number" placeholder="% Comisión FINANTAH" onChange={(e) => setComisionFinantah(Number(e.target.value))} />
      <input type="number" placeholder="P(i) %" onChange={(e) => setPi(Number(e.target.value))} />
      <select onChange={(e) => setCalificacion(e.target.value)}>
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>
      <button onClick={calcular}>Simular</button>
      <p>{resultado}</p>
    </div>
  );
};

export default Simulador;