/* eslint-disable import/no-extraneous-dependencies */
import { unlink } from 'fs/promises';
import { Pinecone } from '@pinecone-database/pinecone';
import { embedder } from "./embeddings.ts";
import { getEnv } from "./utils/util.ts";


export type Metadata = {
  imagePath: string;
}

const indexName = getEnv("PINECONE_INDEX");
const pinecone = new Pinecone();
const index = pinecone.index<Metadata>(indexName);

await embedder.init("Xenova/clip-vit-base-patch32");

const queryImages = async (imagePath: string) => {
  const queryEmbedding = await embedder.embed(imagePath);
  const queryResult = await index.namespace('default').query({
      vector: queryEmbedding.values,
      includeMetadata: true,
      includeValues: true,
      topK: 6
  });

  let localPath = imagePath;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    const match = imagePath.match(/\/data\/(.+)$/);
    if (match) {
      localPath = `data/${match[1]}`;
    }
  }
  // Delete the image after querying
  try {
    await unlink(localPath);
  } catch (err) {
    // Optionally handle error (e.g., log it), but don't block the response
    console.error(`Failed to delete image at ${imagePath}:`, err);
  }
  return queryResult.matches?.map(match => {
    const { metadata } = match;
    return {
      src: metadata ? metadata.imagePath : '',
      score: match.score
    };  
  });
};

export {
  queryImages
};