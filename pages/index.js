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
