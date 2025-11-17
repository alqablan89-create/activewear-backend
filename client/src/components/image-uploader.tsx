import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onUploadComplete?: (urls: string[]) => void;
  existingImages?: string[];
  onRemoveImage?: (url: string) => void;
}

export function ImageUploader({
  maxNumberOfFiles = 10,
  maxFileSize = 10485760,
  onUploadComplete,
  existingImages = [],
  onRemoveImage,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (files.length > maxNumberOfFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxNumberOfFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    const oversizedFiles = files.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${Math.round(maxFileSize / 1048576)}MB`,
        variant: "destructive",
      });
      return;
    }

    const nonImageFiles = files.filter(file => !file.type.startsWith('image/'));
    if (nonImageFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const response = await fetch("/api/objects/upload-public", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: file.name }),
        });

        if (!response.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { uploadURL, publicURL } = await response.json();

        const uploadResponse = await fetch(uploadURL, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        uploadedUrls.push(publicURL);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      if (onUploadComplete && uploadedUrls.length > 0) {
        onUploadComplete(uploadedUrls);
      }

      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          data-testid="input-file-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
          data-testid="button-upload-images"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Images
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          Images only, up to {maxNumberOfFiles} files, max {Math.round(maxFileSize / 1048576)}MB each
        </p>
      </div>

      {uploading && (
        <div className="space-y-2" data-testid="upload-progress">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
        </div>
      )}

      {existingImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Images ({existingImages.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group aspect-square border rounded-lg overflow-hidden"
                data-testid={`image-preview-${index}`}
              >
                <img
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {onRemoveImage && (
                  <button
                    type="button"
                    onClick={() => onRemoveImage(imageUrl)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`button-remove-image-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
