import React, { useState } from 'react';
import {
  Metaplex,
  walletAdapterIdentity,
  irysStorage,
  toMetaplexFile,
} from '@metaplex-foundation/js';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { getNft, sendNft } from './getNft';
import { createDestAccount } from './getNft';
import styles from '../styles/Home.module.css';

// createDestAccount;

const CreateAndSendNft = ({ imageSrc }) => {
  const [imgUrl, setImgUrl] = useState('');
  const [destination, setDestination] = useState('');
  const { connection } = useConnection();
  const wallet = useWallet();
  // const { publicKey, sendTransaction } = useWallet();

  // Hardcoded destination address for the example
  // const destinationAddress = new PublicKey(
  //   '3hzUtAJQMZXXKf8VegaGBt3SHoVmRD3qPwnYS9Ys6qvk'
  // );

  const METAPLEX = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(
      irysStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com/',
        timeout: 60000,
      })
    );

  // getNft(connection, wallet);

  const createNft = async () => {
    // const file = toMetaplexFile(imageSrc.imageSrc, 'solanaLogo.png');
    const { uri } = await METAPLEX.nfts().uploadMetadata({
      name: 'My First NFT',
      symbol: 'First',
      description: 'This is my first NFT',
      image: imgUrl,
      // image:
      //   'https://ipfs.io/ipfs/QmYiH3aho3inWtQMkXz29dhKkFi1g8pCxjTmt8XvNUYexn',
    });

    const { nft } = await METAPLEX.nfts().create({
      uri: uri,
      name: 'My First NFT',
      sellerFeeBasisPoints: 500, // Represents 5.00%.
    });

    console.log(nft.address, 'nftttt');
    console.log(
      `Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
    );
  };
  const handleSendNft = async () => {
    console.log(destination, typeof destination);
    const destinationAddress = new PublicKey(destination);
    const nftMint = await getNft(connection, wallet);
    const ix1 = await createDestAccount(nftMint, destinationAddress, wallet);
    const destinationTokenAddress = await getAssociatedTokenAddress(
      nftMint,
      destinationAddress
    );
    const ix2 = await sendNft(
      nftMint,
      wallet,
      destinationTokenAddress,
      wallet.publicKey
    );

    const tx = new Transaction();
    tx.add(ix1).add(ix2).feePayer = wallet.publicKey;

    try {
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'processed');
      console.log(`Transfer başarılı: ${signature}`);
    } catch (error) {
      console.error('Transfer sırasında hata oluştu:', error);
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input
        type="text"
        className={styles.formField}
        placeholder="Enter the Image Url"
        onChange={(e) => setImgUrl(e.target.value)}
      />
      <button onClick={createNft} className={styles.formButton}>
        Create NFT
      </button>
      <input
        type="text"
        className={styles.formField}
        placeholder="Enter the Destination adress"
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={handleSendNft} className={styles.formButton}>
        Send NFT
      </button>
    </div>
  );
};

export default CreateAndSendNft;
