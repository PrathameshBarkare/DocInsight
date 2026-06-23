import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters';

export const createChunks = async (text) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  });
  
  return await textSplitter.splitText(text);
};