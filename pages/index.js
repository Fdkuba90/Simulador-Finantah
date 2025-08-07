import Head from 'next/head';
import Simulador from '../components/Simulador';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Simulador de Utilidad - FINANTAH</title>
      </Head>
      <Simulador />
    </div>
  );
}