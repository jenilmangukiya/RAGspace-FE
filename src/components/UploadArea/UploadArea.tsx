import React, { useRef, useState } from 'react';
import { UploadCloud, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface UploadAreaProps {
  onUpload: (file: File) => Promise<any>;
  isUploading: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setDragError('Only PDF files are supported.');
      return;
    }
    setDragError(null);
    try {
      await onUpload(file);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
      // Reset input value to allow uploading same file again if deleted
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={clsx(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 min-h-[160px]',
          isDragActive
            ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10'
            : 'border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 hover:bg-zinc-900/30',
          isUploading && 'pointer-events-none opacity-60'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
            <p className="text-sm font-medium text-zinc-300">Uploading PDF document...</p>
            <p className="text-xs text-zinc-500">Parsing structure and vectorizing chunks</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 mb-4 shadow-inner">
              <UploadCloud className="h-6 w-6 text-zinc-500" />
            </div>
            <p className="text-sm font-medium text-zinc-300">
              <span className="gradient-text font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="mt-1 text-xs text-zinc-500">PDF documents only (max 10MB)</p>
          </div>
        )}

        {dragError && (
          <div className="absolute bottom-4 flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-950/20 border border-red-500/10 px-3 py-1 rounded-full">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{dragError}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadArea;
