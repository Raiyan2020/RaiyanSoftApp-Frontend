'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import NextImage from 'next/image';
import { ImagePlus, RotateCcw, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translateMessage } from '@/lib/i18n-utils';

type CropPosition = {
  x: number;
  y: number;
  zoom: number;
};

type ImageUploadValue = {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  originalName: string;
};

type ImageUploadProps = {
  label?: string;
  value?: ImageUploadValue | null;
  onChange: (value: ImageUploadValue | null) => void;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  previewClassName?: string;
  disabled?: boolean;
};

const DEFAULT_CROP: CropPosition = { x: 50, y: 50, zoom: 1 };

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to load image'));
    };
    image.src = objectUrl;
  });
}

function getOutputSize(image: HTMLImageElement, maxWidth: number, maxHeight: number, aspectRatio: number) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (aspectRatio > 0) {
    if (imageRatio > aspectRatio) {
      height = image.naturalHeight;
      width = height * aspectRatio;
    } else {
      width = image.naturalWidth;
      height = width / aspectRatio;
    }
  }

  const scale = Math.min(1, maxWidth / width, maxHeight / height);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function optimizeImage(
  file: File,
  crop: CropPosition,
  options: Required<Pick<ImageUploadProps, 'aspectRatio' | 'maxWidth' | 'maxHeight' | 'quality'>>,
): Promise<Omit<ImageUploadValue, 'previewUrl'>> {
  const image = await loadImage(file);
  const output = getOutputSize(image, options.maxWidth, options.maxHeight, options.aspectRatio);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not supported in this browser');
  }

  canvas.width = output.width;
  canvas.height = output.height;

  const zoom = Math.max(1, crop.zoom);
  const sourceRatio = output.width / output.height;
  let sourceWidth = image.naturalWidth / zoom;
  let sourceHeight = sourceWidth / sourceRatio;

  if (sourceHeight > image.naturalHeight / zoom) {
    sourceHeight = image.naturalHeight / zoom;
    sourceWidth = sourceHeight * sourceRatio;
  }

  const maxSourceX = Math.max(0, image.naturalWidth - sourceWidth);
  const maxSourceY = Math.max(0, image.naturalHeight - sourceHeight);
  const sourceX = (maxSourceX * crop.x) / 100;
  const sourceY = (maxSourceY * crop.y) / 100;

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, output.width, output.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((nextBlob) => {
      if (nextBlob) resolve(nextBlob);
      else reject(new Error('Unable to optimize image'));
    }, 'image/webp', options.quality);
  });

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  const optimizedFile = new File([blob], `${baseName}.webp`, {
    type: 'image/webp',
    lastModified: Date.now(),
  });

  return {
    file: optimizedFile,
    width: output.width,
    height: output.height,
    originalName: file.name,
  };
}

export type { ImageUploadValue };

export default function ImageUpload({
  label,
  value,
  onChange,
  aspectRatio = 16 / 9,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.86,
  previewClassName,
  disabled = false,
}: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<CropPosition>(DEFAULT_CROP);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!sourceFile) return;

    const objectUrl = URL.createObjectURL(sourceFile);
    setSourcePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [sourceFile]);

  useEffect(() => {
    if (!sourceFile) return;

    let cancelled = false;
    setIsProcessing(true);
    setError('');

    optimizeImage(sourceFile, crop, { aspectRatio, maxWidth, maxHeight, quality })
      .then((optimized) => {
        if (cancelled) return;
        const previewUrl = URL.createObjectURL(optimized.file);
        onChangeRef.current({ ...optimized, previewUrl });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(translateMessage(err instanceof Error ? err.message : 'Unable to optimize image'));
      })
      .finally(() => {
        if (!cancelled) setIsProcessing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [aspectRatio, crop, maxHeight, maxWidth, quality, sourceFile]);

  useEffect(() => {
    return () => {
      if (value?.previewUrl) URL.revokeObjectURL(value.previewUrl);
    };
  }, [value?.previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    if (!nextFile) return;

    if (!nextFile.type.startsWith('image/')) {
      setError(translateMessage('Please choose an image file.'));
      return;
    }

    setCrop(DEFAULT_CROP);
    setSourceFile(nextFile);
  }

  function clearImage() {
    setSourceFile(null);
    setSourcePreviewUrl('');
    setCrop(DEFAULT_CROP);
    setError('');
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  const previewUrl = sourcePreviewUrl || value?.previewUrl || '';
  const hasImage = Boolean(previewUrl);

  return (
    <div className="space-y-3">
      {label ? <label className="block text-sm font-semibold text-[var(--text)]">{translateMessage(label)}</label> : null}

      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)]',
          previewClassName || 'aspect-video',
        )}
      >
        {hasImage ? (
          <img
            src={previewUrl}
            alt={translateMessage('Image preview')}
            className="h-full w-full object-cover"
            style={{ objectPosition: `${crop.x}% ${crop.y}%`, transform: `scale(${crop.zoom})` }}
          />
        ) : (
          <label htmlFor={inputId} className="grid h-full min-h-40 cursor-pointer place-items-center p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <span className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <NextImage src="/logo.webp" alt={translateMessage('Website logo')} fill className="object-contain p-2" sizes="64px" />
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                <ImagePlus size={24} />
              </span>
              <span className="text-sm font-semibold text-[var(--text)]">{translateMessage('Upload Image')}</span>
              <span className="mt-1 text-xs text-[var(--text-muted)]">
                {translateMessage('Optimized to WebP up to 1920 x 1080')}
              </span>
            </div>
          </label>
        )}

        {hasImage ? (
          <div className="absolute end-2 top-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isProcessing}
              className="grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 disabled:opacity-50"
              aria-label={translateMessage('Replace image')}
            >
              <Upload size={16} />
            </button>
            <button
              type="button"
              onClick={clearImage}
              disabled={disabled || isProcessing}
              className="grid h-9 w-9 place-items-center rounded-full bg-red-500/90 text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              aria-label={translateMessage('Remove image')}
            >
              <X size={16} />
            </button>
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isProcessing}
        className="hidden"
      />

      {hasImage ? (
        <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
            <span>
              {isProcessing
                ? translateMessage('Optimizing image...')
                : `${translateMessage('WebP ready')}${value ? `: ${value.width} x ${value.height}` : ''}`}
            </span>
            <button
              type="button"
              onClick={() => setCrop(DEFAULT_CROP)}
              disabled={disabled || isProcessing}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)] disabled:opacity-50"
            >
              <RotateCcw size={14} />
              {translateMessage('Reset crop')}
            </button>
          </div>

          <label className="block text-xs font-medium text-[var(--text-muted)]">
            {translateMessage('Horizontal center')}
            <input
              type="range"
              min="0"
              max="100"
              value={crop.x}
              onChange={(event) => setCrop((current) => ({ ...current, x: Number(event.target.value) }))}
              disabled={disabled || isProcessing}
              className="mt-2 w-full accent-primary"
            />
          </label>
          <label className="block text-xs font-medium text-[var(--text-muted)]">
            {translateMessage('Vertical center')}
            <input
              type="range"
              min="0"
              max="100"
              value={crop.y}
              onChange={(event) => setCrop((current) => ({ ...current, y: Number(event.target.value) }))}
              disabled={disabled || isProcessing}
              className="mt-2 w-full accent-primary"
            />
          </label>
          <label className="block text-xs font-medium text-[var(--text-muted)]">
            {translateMessage('Zoom')}
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={crop.zoom}
              onChange={(event) => setCrop((current) => ({ ...current, zoom: Number(event.target.value) }))}
              disabled={disabled || isProcessing}
              className="mt-2 w-full accent-primary"
            />
          </label>
        </div>
      ) : null}

      {error ? <p className="text-xs font-medium text-red-400">{error}</p> : null}
    </div>
  );
}
