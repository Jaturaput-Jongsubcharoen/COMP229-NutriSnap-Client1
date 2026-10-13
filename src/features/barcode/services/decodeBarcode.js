export async function decodeBarcode(image) {
  const { default: Quagga } = await import('quagga');
  const decode = (locate) =>
    new Promise((resolve, reject) => {
      Quagga.decodeSingle(
        {
          src: image,
          locate,
          numOfWorkers: 0,
          inputStream: { size: 800 },
          decoder: { readers: ['ean_reader', 'upc_reader'] },
        },
        (result) => {
          if (result?.codeResult?.code) resolve(result.codeResult.code);
          else
            reject(
              new Error(
                'Barcode not detected. Try a sharp, well-lit UPC or EAN image.'
              )
            );
        }
      );
    });
  // Flat, tightly cropped labels may have no locator features; try their center scanline.
  try {
    return await decode(true);
  } catch {
    return decode(false);
  }
}
