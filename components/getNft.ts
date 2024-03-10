import { PublicKey, associatedTokenProgram } from '@metaplex-foundation/js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, SystemProgram } from '@solana/web3.js';

export const getNft = async (
  connection: Connection,
  wallet: WalletContextState
) => {
  // connection.getProgramAccounts
  const accounts = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {
      filters: [
        {
          dataSize: 165, // number of bytes
        },
        {
          memcmp: {
            offset: 32, // number of bytes
            bytes: wallet.publicKey.toString(), // base58 encoded string
          },
        },
      ],
    }
  );

  accounts.forEach((account, i) => {
    //Parse the account data
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo['parsed']['info']['mint'];
    const tokenBalance: number =
      parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount'];
    //Log results
    console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${tokenBalance}`);
  });

  for (let i = 0; i < accounts.length; i++) {
    const parsedAccountInfo: any = accounts[accounts.length - 1].account.data;
    const mintAddress: string = parsedAccountInfo['parsed']['info']['mint'];
    const tokenBalance: number =
      parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount'];
    //Log results
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${tokenBalance}`);
  }
  const nftAccount = new PublicKey(
    accounts[0].account.data['parsed']['info']['mint']
  );
  //  owner = await connection.getAccountInfo(nftAccount);
  // console.log(salla.owner.toString());
  return nftAccount;
};

export const sendNft = async (
  mintPublicKey,
  wallet: WalletContextState,
  destinationTokenAddress,
  payerPublicKey
) => {
  const sourceTokenAddress = await getAssociatedTokenAddress(
    mintPublicKey,
    wallet.publicKey
  );
  const transferInstruction = createTransferInstruction(
    sourceTokenAddress,
    destinationTokenAddress,
    wallet.publicKey,
    1, // NFT'ler için miktar genellikle 1'dir
    [],
    TOKEN_PROGRAM_ID
  );
  return transferInstruction;
};

export const createDestAccount = async (
  mintPublicKey,
  destinationPublicKey,
  wallet
) => {
  const destinationTokenAddress = await getAssociatedTokenAddress(
    mintPublicKey,
    destinationPublicKey
  );

  const createAccountInstruction = createAssociatedTokenAccountInstruction(
    wallet.publicKey,
    destinationTokenAddress,
    destinationPublicKey,
    mintPublicKey,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return createAccountInstruction;
};
