import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "5242880"); // 5MB default

export async function saveFile(
  file: File,
  subdirectory: string = ""
): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  // Validate file type (image files only)
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  // Create upload directory if it doesn't exist
  const uploadPath = join(UPLOAD_DIR, subdirectory);
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = file.name.split(".").pop();
  const filename = `${timestamp}-${random}.${extension}`;

  // Save file
  const filepath = join(uploadPath, filename);
  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  // Return relative path for storage
  return `/uploads/${subdirectory}${subdirectory ? "/" : ""}${filename}`;
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
