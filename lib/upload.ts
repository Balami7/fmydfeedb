import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { put } from "@vercel/blob";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "5242880"); // 5MB

function randomName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = originalName.split(".").pop() || "bin";
  return `${timestamp}-${random}.${extension}`;
}

async function saveToBlob(file: File, subdirectory: string): Promise<string> {
  const key = subdirectory
    ? `${subdirectory}/${randomName(file.name)}`
    : randomName(file.name);
  const blob = await put(key, file, {
    access: "public",
    contentType: file.type || undefined,
  });
  return blob.url;
}

async function saveToDisk(file: File, subdirectory: string): Promise<string> {
  const uploadPath = join(UPLOAD_DIR, subdirectory);
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }
  const filename = randomName(file.name);
  const filepath = join(uploadPath, filename);
  await writeFile(filepath, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${subdirectory}${subdirectory ? "/" : ""}${filename}`;
}

export async function saveFile(
  file: File,
  subdirectory: string = ""
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return saveToBlob(file, subdirectory);
  }
  return saveToDisk(file, subdirectory);
}

export async function handleFileUpload(
  formData: FormData,
  fieldName: string,
  subdirectory: string = ""
): Promise<string> {
  const file = formData.get(fieldName) as File;
  if (!file) {
    throw new Error(`No file found for field: ${fieldName}`);
  }
  return saveFile(file, subdirectory);
}
