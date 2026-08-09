import fs from "fs";
import path from "path";
import sharp from "sharp";

const IMAGES_DIR = path.resolve("public/images");

async function convertDir(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await convertDir(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        const outputName = entry.name.slice(0, -ext.length) + ".webp";
        const outputPath = path.join(dir, outputName);

        try {
          console.log(`Converting: ${fullPath} -> ${outputPath}`);
          await sharp(fullPath)
            .webp({ quality: 85 })
            .toFile(outputPath);

          // Delete original file
          await fs.promises.unlink(fullPath);
          console.log(`Deleted original: ${fullPath}`);
        } catch (error) {
          console.error(`Failed to convert ${fullPath}:`, error);
        }
      }
    }
  }
}

async function main() {
  console.log("Starting WebP conversion...");
  if (fs.existsSync(IMAGES_DIR)) {
    await convertDir(IMAGES_DIR);
    console.log("WebP conversion completed successfully!");
  } else {
    console.error("Images directory not found:", IMAGES_DIR);
  }
}

main().catch(console.error);
