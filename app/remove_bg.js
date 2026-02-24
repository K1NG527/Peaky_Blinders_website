import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const IMG_DIR = 'public/assets/ledger';

async function processImage(filename) {
    const filepath = path.join(IMG_DIR, filename);
    if (!fs.existsSync(filepath)) return;

    console.log(`Processing ${filename}...`);
    try {
        const image = await Jimp.read(filepath);

        // Convert near-white pixels to transparent
        image.scan((x, y, idx) => {
            const r = image.bitmap.data[idx + 0];
            const g = image.bitmap.data[idx + 1];
            const b = image.bitmap.data[idx + 2];

            // If it's a very light pixel (near white background)
            if (r > 235 && g > 235 && b > 235) {
                image.bitmap.data[idx + 3] = 0; // set alpha to 0
            } else {
                // slightly smooth the edge by adding some transparency to anti-aliased pixels
                if (r > 200 && g > 200 && b > 200) {
                    image.bitmap.data[idx + 3] = Math.max(0, 255 - ((r + g + b) / 3 - 200) * 4);
                }
            }
        });

        await image.write(filepath);
        console.log(`Done processing ${filename}`);
    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

async function main() {
    await processImage('vintage_leather_cover_whiskey_cutout.png');
}

main();
