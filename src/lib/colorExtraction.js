export function extractPalette(imageFile, count) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = async () => {
      try {
        const { getPalette } = await import('colorthief');
        const palette = await getPalette(img, { colorCount: count });
        resolve(palette.map((color) => color.hex()));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image'));
    };
    img.src = objectUrl;
  });
}
