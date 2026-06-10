import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { globalConfirm } from '@/lib/confirm-dialog';
import { useTranslation } from '@/lib/i18nContext';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: any;
}

const unavailableMessage = 'File manager upload routes are not available in the Laravel backend yet.';

export function useFileManager() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(unavailableMessage);
  const { t, dir } = useTranslation();

  const uploadFile = async (_file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(unavailableMessage);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const handleDelete = async (_file: UploadedFile) => {
    const confirmed = await globalConfirm.confirm({
      title: 'Delete file?',
      message: t('files.delete_confirm'),
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });
    if (!confirmed) return;
    setError(unavailableMessage);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const isImage = (type: string) => type.startsWith('image/');

  return {
    router,
    t,
    dir,
    fileInputRef,
    files,
    isUploading,
    uploadProgress,
    error,
    handleFileSelect,
    handleDelete,
    formatSize,
    isImage,
  };
}
