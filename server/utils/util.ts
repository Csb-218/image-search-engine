import fs from "fs/promises";
import path,{ extname } from "path";
import * as dotenv from "dotenv";

dotenv.config();

const sliceIntoChunks = <T>(arr: T[], chunkSize: number) =>
  Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  );

async function listFiles(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir);
  const filePaths: string[] = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    if (
      stats.isFile() &&
      !filePath.includes(".DS_Store") &&
      !filePath.includes("_deleted")
    ) {
      filePaths.push(filePath);
    }
  }
  return filePaths;
}

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} environment variable not set`);
  }
  return value;
};

const validateEnvironmentVariables = () => {
  getEnv("PINECONE_API_KEY");
  getEnv("PINECONE_INDEX");
  getEnv("PINECONE_CLOUD");
  getEnv("PINECONE_REGION");
};



interface File {
    originalname: string;
    mimetype: string;
}

const validateFile = (file: File) => {
    const fileTypes = /jpeg|jpg|png|gif|pdf|ppt|csv/;
    const fileExtname = fileTypes.test(extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    return fileExtname && mimetype;
};




export { listFiles, sliceIntoChunks, validateEnvironmentVariables , validateFile };
