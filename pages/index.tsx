import { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import WalletContextProvider from '../components/WalletContextProvider';
import { AppBar } from '../components/AppBar';
import { BalanceDisplay } from '../components/BalanceDisplay';
import { MintToForm } from '../components/MintToForm';
import { CreateTokenAccountForm } from '../components/CreateTokenAccount';
import { CreateMintForm } from '../components/CreateMint';
import Head from 'next/head';
import CreateAndSendNft from '../components/CreateAndSendNft';
import { toMetaplexFile } from '@metaplex-foundation/js';

const Home: NextPage = (imageSrc) => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Loyana</title>
        <meta name="description" content="Loyana" />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          <BalanceDisplay />
          <CreateAndSendNft imageSrc={imageSrc} />
          {/* <CreateMintForm />
          <CreateTokenAccountForm />
          <MintToForm /> */}
        </div>
      </WalletContextProvider>
    </div>
  );
};

export async function getStaticProps() {
  const fs = require('fs').promises;
  const path = require('path');

  // Görüntü dosyasını oku
  const filePath = path.join(process.cwd(), 'public', 'soltr.png');

  const imageBuffer = await fs.readFile(filePath);
  // const file = toMetaplexFile(imageBuffer, 'solanaLogo.png');

  const imageSrc = imageBuffer.toString('base64');

  // console.log(imageSrc, 'imgsrc');

  // const image = await promises.readFile(
  //   join(process.cwd(), 'public', 'solanaLogo.png')
  // );

  return {
    props: {
      imageSrc,
    },
  };
}

export default Home;
