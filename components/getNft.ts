import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

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
    const parsedAccountInfo: any = accounts[i].account.data;
    const mintAddress: string = parsedAccountInfo['parsed']['info']['mint'];
    const tokenBalance: number =
      parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount'];
    //Log results
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${tokenBalance}`);
  }
};
