// Client-side image compression utility
export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  stripMetadata?: boolean;
}

export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  metadataStripped: boolean;
}

export class FileCompressor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async compressImage(
    file: File, 
    options: CompressionOptions = {},
    onProgress?: (progress: number) => void
  ): Promise<CompressionResult> {
    const {
      maxWidth = 2048,
      maxHeight = 2048,
      quality = 0.8,
      format = 'jpeg',
      stripMetadata = true
    } = options;

    onProgress?.(10);

    // Load image
    const img = await this.loadImage(file);
    onProgress?.(30);

    // Calculate new dimensions
    const { width, height } = this.calculateDimensions(
      img.width, 
      img.height, 
      maxWidth, 
      maxHeight
    );
    onProgress?.(50);

    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;

    // Draw and compress
    this.ctx.drawImage(img, 0, 0, width, height);
    onProgress?.(80);

    // Convert to blob
    const blob = await this.canvasToBlob(quality, format);
    onProgress?.(90);

    // Create compressed file
    const compressedFile = new File(
      [blob], 
      this.generateFileName(file.name, format),
      { type: blob.type }
    );

    onProgress?.(100);

    return {
      compressedFile,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      compressionRatio: ((file.size - compressedFile.size) / file.size) * 100,
      metadataStripped: stripMetadata
    };
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private calculateDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth: number, 
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Calculate scaling factor
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio, 1);

    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    return { width, height };
  }

  private canvasToBlob(quality: number, format: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to blob conversion failed'));
          }
        },
        `image/${format}`,
        quality
      );
    });
  }

  private generateFileName(originalName: string, format: string): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}_compressed.${format}`;
  }

  // Extract and remove EXIF data
  async stripMetadata(file: File): Promise<{ cleanFile: File; metadataFound: boolean }> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Check for EXIF data (JPEG files)
    let metadataFound = false;
    let cleanData = uint8Array;

    if (file.type === 'image/jpeg') {
      const result = this.removeJpegExif(uint8Array);
      cleanData = result.data;
      metadataFound = result.hadExif;
    }

    const cleanFile = new File([cleanData], file.name, { type: file.type });
    return { cleanFile, metadataFound };
  }

  private removeJpegExif(data: Uint8Array): { data: Uint8Array; hadExif: boolean } {
    // JPEG files start with 0xFFD8
    if (data[0] !== 0xFF || data[1] !== 0xD8) {
      return { data, hadExif: false };
    }

    let hadExif = false;
    const result: number[] = [0xFF, 0xD8]; // Start with JPEG header
    let i = 2;

    while (i < data.length - 1) {
      // Look for segment markers
      if (data[i] === 0xFF) {
        const marker = data[i + 1];
        
        // Skip EXIF segments (0xE1) and other metadata segments
        if (marker === 0xE1 || marker === 0xE0 || marker === 0xE2) {
          hadExif = true;
          // Get segment length
          const segmentLength = (data[i + 2] << 8) | data[i + 3];
          i += 2 + segmentLength; // Skip entire segment
          continue;
        }
        
        // Copy other segments
        result.push(data[i], data[i + 1]);
        i += 2;
        
        // If this is the start of scan data (0xFFDA), copy the rest
        if (marker === 0xDA) {
          // Get segment length
          const segmentLength = (data[i] << 8) | data[i + 1];
          // Copy segment header
          for (let j = 0; j < segmentLength; j++) {
            result.push(data[i + j]);
          }
          i += segmentLength;
          // Copy remaining scan data
          while (i < data.length) {
            result.push(data[i]);
            i++;
          }
          break;
        }
      } else {
        result.push(data[i]);
        i++;
      }
    }

    return { data: new Uint8Array(result), hadExif };
  }

  // Get image metadata information
  async getImageInfo(file: File): Promise<{
    dimensions: { width: number; height: number };
    hasExif: boolean;
    fileSize: number;
    format: string;
  }> {
    const img = await this.loadImage(file);
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let hasExif = false;
    if (file.type === 'image/jpeg') {
      hasExif = this.detectJpegExif(uint8Array);
    }

    return {
      dimensions: { width: img.width, height: img.height },
      hasExif,
      fileSize: file.size,
      format: file.type
    };
  }

  private detectJpegExif(data: Uint8Array): boolean {
    // Look for EXIF marker (0xFFE1)
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i] === 0xFF && data[i + 1] === 0xE1) {
        return true;
      }
    }
    return false;
  }
}

export const fileCompressor = new FileCompressor();