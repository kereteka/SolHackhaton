import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  mplBubblegum,
  createTree,
  mintV1,
} from '@metaplex-foundation/mpl-bubblegum';
import { generateSigner, none } from '@metaplex-foundation/umi';

// Initialize Umi and Bubblegum
const umi = createUmi('https://api.devnet.solana.com').use(mplBubblegum());

async function createAndMintNFT() {
  const merkleTreeSigner = generateSigner(umi);

  // Create Bubblegum Tree
  const tree = await createTree(umi, {
    merkleTree: merkleTreeSigner,
    maxDepth: 14,
    maxBufferSize: 64,
  });
  await tree.sendAndConfirm(umi);

  // Mint a cNFT
  const metadataUri = 'https://example.com/my-nft-metadata.json'; // Your NFT metadata URI
  const leafOwner = 'YourLeafOwnerPublicKeyHere'; // The new owner's public key
  const mintResult = await mintV1(umi, {
    leafOwner,
    merkleTree: merkleTreeSigner.publicKey,
    metadata: {
      name: 'My Compressed NFT',
      uri: metadataUri,
      sellerFeeBasisPoints: 500,
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  }).sendAndConfirm(umi);

  console.log(`Minted cNFT:`, mintResult);
}

createAndMintNFT();
