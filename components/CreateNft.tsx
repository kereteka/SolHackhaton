import React from 'react';
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

createDestAccount;

const CreateNft = ({ imageSrc }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  // const { publicKey, sendTransaction } = useWallet();

  // Hardcoded destination address for the example
  const destinationAddress = new PublicKey(
    '3hzUtAJQMZXXKf8VegaGBt3SHoVmRD3qPwnYS9Ys6qvk'
  );

  const METAPLEX = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(
      irysStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com/',
        timeout: 60000,
      })
    );

  getNft(connection, wallet);

  const createNft = async () => {
    const file = toMetaplexFile(imageSrc.imageSrc, 'solanaLogo.png');
    const { uri } = await METAPLEX.nfts().uploadMetadata({
      name: 'My First NFT',
      symbol: 'First',
      description: 'This is my first NFT',
      image:
        'https://ipfs.io/ipfs/QmYiH3aho3inWtQMkXz29dhKkFi1g8pCxjTmt8XvNUYexn',
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

    // Transfer NFT to a hardcoded destination address
    // await createAndTransferNft(
    //   connection,
    //   wallet,
    //   nft.address,
    //   destinationAddress
    // );
  };

  // const createAndTransferNft = async (
  //   connection,
  //   wallet,
  //   mintAddress, // NFT'nin mint adresi
  //   destinationWalletAddress // Alıcı cüzdan adresi
  // ) => {
  //   if (!wallet.publicKey) return;

  //   const mintPublicKey = new PublicKey(mintAddress);
  //   const destinationPublicKey = new PublicKey(destinationWalletAddress);
  //   const payerPublicKey = wallet.publicKey;

  //   // Alıcı için ilişkili token hesabı adresini hesapla
  //   const destinationTokenAddress = await getAssociatedTokenAddress(
  //     mintPublicKey,
  //     destinationPublicKey
  //   );

  //   // İşlemi oluştur
  //   let transaction = new Transaction();

  //   // Alıcı adresinde token hesabı yoksa, oluştur
  //   const destinationAccountInfo = await connection.getAccountInfo(
  //     destinationTokenAddress
  //   );
  //   if (!destinationAccountInfo) {
  //     const createAccountInstruction = createAssociatedTokenAccountInstruction(
  //       payerPublicKey,
  //       destinationTokenAddress,
  //       destinationPublicKey,
  //       mintPublicKey,
  //       TOKEN_PROGRAM_ID,
  //       SystemProgram.programId
  //     );
  //     transaction.add(createAccountInstruction);
  //   }

  //   // Kaynak token hesabı adresini hesapla
  //   const sourceTokenAddress = await getAssociatedTokenAddress(
  //     mintPublicKey,
  //     payerPublicKey
  //   );

  //   // Transfer talimatı ekle
  //   const transferInstruction = createTransferInstruction(
  //     sourceTokenAddress,
  //     destinationTokenAddress,
  //     payerPublicKey,
  //     1, // NFT'ler için miktar genellikle 1'dir
  //     [],
  //     TOKEN_PROGRAM_ID
  //   );
  //   transaction.add(transferInstruction);

  //   // İşlemi imzala ve gönder
  //   try {
  //     const signature = await wallet.sendAndConfirmTransaction(
  //       connection,
  //       transaction,
  //       [wallet]
  //     );
  //     await connection.confirmTransaction(signature, 'processed');
  //     console.log(`Transfer başarılı: ${signature}`);
  //   } catch (error) {
  //     console.error('Transfer sırasında hata oluştu:', error);
  //   }
  //   getNft(connection, wallet);
  // };
  const sendHandleNFT = async () => {
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
    // mintPublicKey,
    // wallet: WalletContextState,
    // destinationTokenAddress,
    // payerPublicKey
  };
  return (
    <div>
      <button onClick={createNft}>Create and Send NFT</button>
      <button onClick={sendHandleNFT}>Send NFT</button>
    </div>
  );
};

export default CreateNft;
