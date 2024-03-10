import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplBubblegum, create } from '@metaplex-foundation/mpl-bubblegum';

// Use the RPC endpoint of your choice.
const umi = createUmi('http://127.0.0.1:8899').use(mplBubblegum());

import { generateSigner } from '@metaplex-foundation/umi';
import { createTree } from '@metaplex-foundation/mpl-bubblegum';

const merkleTree = generateSigner(umi);
const builder = await createTree(umi, {
  merkleTree,
  maxDepth: 14,
  maxBufferSize: 64,
});
await builder.sendAndConfirm(umi);
