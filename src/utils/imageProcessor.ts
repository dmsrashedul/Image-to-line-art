
export type ArtStyle = 'sketch' | 'technical' | 'bold' | 'minimal';

export interface ProcessingOptions {
  threshold: number;
  contrast: number;
  brightness: number;
  blur: number;
  lineWeight: number;
  style: ArtStyle;
  noiseReduction: boolean;
}

/**
 * Advanced Image Processor for ArtLine Pro
 * Uses Sobel operator for edge detection and Color Dodge for artistic sketching.
 */
/**
 * Enhanced Image Processor with Gaussian Smoothing & Dilation for High-Quality Output
 */
export const processImage = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  options: ProcessingOptions
) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const { width, height } = image;
  canvas.width = width;
  canvas.height = height;

  // 1. Initial Render
  ctx.drawImage(image, 0, 0);
  let imageData = ctx.getImageData(0, 0, width, height);
  let data = imageData.data;

  // 2. Grayscale & Contrast/Brightness
  const grayscale = new Uint8ClampedArray(width * height);
  const factor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));

  for (let i = 0; i < data.length; i += 4) {
    let gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    
    // Adjust
    gray += options.brightness;
    gray = factor * (gray - 128) + 128;
    gray = Math.min(255, Math.max(0, gray));
    
    grayscale[i / 4] = gray;
    data[i] = data[i+1] = data[i+2] = gray;
  }
  ctx.putImageData(imageData, 0, 0);

  if (options.style === 'sketch') {
    // HIGH QUALITY SKETCH ENGINE
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d')!;
    
    // Invert grayscale
    const invertedData = ctx.createImageData(width, height);
    for (let i = 0; i < data.length; i += 4) {
      invertedData.data[i] = 255 - data[i];
      invertedData.data[i+1] = 255 - data[i+1];
      invertedData.data[i+2] = 255 - data[i+2];
      invertedData.data[i+3] = 255;
    }
    tempCtx.putImageData(invertedData, 0, 0);

    // Apply Blur (Gaussian approximation)
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.filter = `blur(${options.blur}px)`;
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();

    const blurred = ctx.getImageData(0, 0, width, height).data;
    const result = ctx.createImageData(width, height);
    
    for (let i = 0; i < data.length; i += 4) {
      const b = data[i];
      const s = blurred[i];
      // Color Dodge Blend
      let res = s === 255 ? 255 : (b * 255) / (255 - s);
      
      if (options.threshold > 0) {
        res = res > options.threshold ? 255 : 0;
      }
      
      result.data[i] = result.data[i+1] = result.data[i+2] = Math.min(255, res);
      result.data[i+3] = 255;
    }
    ctx.putImageData(result, 0, 0);

  } else {
    // HIGH PRECISION EDGE ENGINE (SOBEL + MORPHOLOGY)
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    const output = new Uint8ClampedArray(width * height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const val = grayscale[(y + i) * width + (x + j)];
            gx += val * sobelX[(i + 1) * 3 + (j + 1)];
            gy += val * sobelY[(i + 1) * 3 + (j + 1)];
          }
        }
        output[y * width + x] = Math.min(255, Math.sqrt(gx * gx + gy * gy));
      }
    }

    const final = ctx.createImageData(width, height);
    for (let i = 0; i < output.length; i++) {
      const val = output[i] > options.threshold ? 0 : 255;
      final.data[i*4] = final.data[i*4+1] = final.data[i*4+2] = val;
      final.data[i*4+3] = 255;
    }
    ctx.putImageData(final, 0, 0);
  }

  // Dilation effect for line weight
  if (options.lineWeight > 1) {
    ctx.globalCompositeOperation = 'darken';
    const shift = options.lineWeight / 2;
    ctx.drawImage(canvas, -shift, 0);
    ctx.drawImage(canvas, shift, 0);
    ctx.drawImage(canvas, 0, -shift);
    ctx.drawImage(canvas, 0, shift);
    ctx.globalCompositeOperation = 'source-over';
  }
};
