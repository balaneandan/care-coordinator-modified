"use client";

import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="file-upload text-12-regular">
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={300}
          height={300}
          alt="uploaded file"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image src="/icons/upload.svg" width={40} height={40} alt="upload" />
          <div className="file-upload_label">
            {isDragActive ? (
              <p className="text-14-regular transition-all">
                Drop the files here ...
              </p>
            ) : (
              <>
                <p className="text-14-regular transition-all">
                  <span className="text-green-500">Click to upload</span> or
                  drag and drop
                </p>
                <p>SVG, PNG, JPG, or PDF (max 800x400; 20MB)</p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
