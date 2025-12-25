import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image as ImageIcon, Camera, Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  onUpload: (files: File[]) => Promise<void>;
  onRemove?: (fileId: string) => void;
  allowCamera?: boolean;
  showPreview?: boolean;
  className?: string;
  label?: string;
  hint?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  maxSize = 5,
  maxFiles = 5,
  onUpload,
  onRemove,
  allowCamera = true,
  showPreview = true,
  className = '',
  label = 'Upload Files',
  hint = `Drag & drop files here, or click to browse (Max ${maxSize}MB per file)`,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB`;
    }
    return null;
  };

  const processFiles = useCallback(async (newFiles: FileList | File[]) => {
    const filesArray = Array.from(newFiles);
    
    if (files.length + filesArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: UploadedFile[] = [];

    for (const file of filesArray) {
      const error = validateFile(file);
      const id = `${Date.now()}-${Math.random()}`;

      let preview: string | undefined;
      if (file.type.startsWith('image/') && showPreview) {
        preview = URL.createObjectURL(file);
      }

      validFiles.push({
        id,
        file,
        preview,
        progress: 0,
        status: error ? 'error' : 'uploading',
        error: error || undefined,
      });
    }

    setFiles(prev => [...prev, ...validFiles]);

    // Simulate upload with progress
    const filesToUpload = validFiles.filter(f => !f.error);
    
    for (const uploadFile of filesToUpload) {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id ? { ...f, progress } : f
          )
        );
      }

      // Mark as success
      setFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id ? { ...f, status: 'success', progress: 100 } : f
        )
      );
    }

    // Call the actual upload handler
    try {
      await onUpload(filesToUpload.map(f => f.file));
    } catch (error) {
      // Mark failed uploads
      setFiles(prev =>
        prev.map(f =>
          filesToUpload.some(uf => uf.id === f.id)
            ? { ...f, status: 'error', error: 'Upload failed' }
            : f
        )
      );
    }
  }, [files, maxFiles, onUpload, showPreview, maxSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  }, [processFiles]);

  const handleRemove = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
    onRemove?.(fileId);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center
          transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-[#1CE479] bg-[#1CE479]/10 scale-[1.02]'
            : 'border-[#2A2A30] hover:border-[#1CE479]/50 hover:bg-[#1A1A20]'
          }
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-[#1CE479]/20' : 'bg-[#2A2A30]'} transition-colors`}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-[#1CE479]' : 'text-gray-400'}`} />
          </div>

          <div>
            <h3 className="text-white mb-1">{label}</h3>
            <p className="text-sm text-gray-400">{hint}</p>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[#2A2A30] hover:border-[#1CE479] hover:bg-[#1CE479]/10"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Browse Files
            </Button>

            {allowCamera && (
              <>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-[#2A2A30] hover:border-[#1CE479] hover:bg-[#1CE479]/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm text-gray-400">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          
          <div className="space-y-2">
            {files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="bg-[#1A1A20] border border-[#2A2A30] rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  {/* Preview or Icon */}
                  <div className="flex-shrink-0">
                    {uploadedFile.preview ? (
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.file.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#2A2A30] rounded-lg flex items-center justify-center text-gray-400">
                        {getFileIcon(uploadedFile.file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm text-white truncate">
                        {uploadedFile.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {uploadedFile.status === 'success' && (
                          <Check className="w-4 h-4 text-[#1CE479]" />
                        )}
                        {uploadedFile.status === 'error' && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(uploadedFile.id)}
                          className="h-6 w-6 p-0 hover:bg-[#2A2A30]"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{(uploadedFile.file.size / 1024).toFixed(1)} KB</span>
                      {uploadedFile.status === 'uploading' && (
                        <span>• Uploading {uploadedFile.progress}%</span>
                      )}
                      {uploadedFile.error && (
                        <span className="text-red-500">• {uploadedFile.error}</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {uploadedFile.status === 'uploading' && (
                      <Progress
                        value={uploadedFile.progress}
                        className="h-1 mt-2 bg-[#2A2A30]"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
