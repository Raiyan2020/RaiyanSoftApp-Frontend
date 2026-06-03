import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFileManager } from '../hooks/use-file-manager';
import FileUploadButton from './file-upload-button';
import FileList from './file-list';

export default function FileManagerPage() {
  const {
    router,
    t,
    dir,
    fileInputRef,
    files,
    isUploading,
    error,
    handleFileSelect,
    handleDelete,
    formatSize,
    isImage,
  } = useFileManager();

  return (
    <div className="app-page app-page-wide">
      <header className="app-header">
        <div>
          <button
            type="button"
            onClick={() => router.push('/more')}
            className="text-[var(--text-muted)] hover:text-[var(--text)] mb-4 flex items-center gap-1"
          >
            {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            <span className="text-sm">{t('auth.back')}</span>
          </button>
          <h1 className="app-title">{t('files.title')}</h1>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <FileUploadButton
          fileInputRef={fileInputRef}
          isUploading={isUploading}
          onFileSelect={handleFileSelect}
          error={error}
          t={t}
        />

        <div>
          <FileList
            files={files}
            isUploading={isUploading}
            dir={dir}
            t={t}
            isImage={isImage}
            formatSize={formatSize}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
