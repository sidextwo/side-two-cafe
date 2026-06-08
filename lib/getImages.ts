import fs from "fs";
import path from "path";

export function getImages() {
  const folderPath = path.join(process.cwd(), "public/homescreen");

  const files = fs.readdirSync(folderPath);

  return files
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map((file) => `/homescreen/${file}`);
}