import { useRef } from "react";
import { Upload } from "lucide-react";

export interface ParsedGuest {
  name: string;
  email: string;
  phone?: string;
}

interface CSVUploaderProps {
  onUpload: (guests: ParsedGuest[]) => void;
  isUploading?: boolean;
}

export const CSVUploader = ({ onUpload, isUploading }: CSVUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());

      // Skip header row
      const guests: ParsedGuest[] = lines.slice(1).map((line) => {
        const [name, email, phone] = line.split(",").map((s) => s.trim());
        return { name, email, phone };
      });

      onUpload(guests);
    };
    reader.readAsText(file);
  };

  return (
    <div className="border-2 border-dashed border-brand-cream rounded-lg p-6 text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <Upload className="w-8 h-8 mx-auto mb-2 text-brand-black/40" />
      <p className="text-sm text-brand-black/60 mb-2">
        Upload a CSV file with guest list
      </p>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="px-4 py-2 bg-brand-black text-white rounded-md hover:bg-brand-black/90 disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Choose File"}
      </button>
      <p className="text-xs text-brand-black/40 mt-2">
        Format: Name, Email, Phone (optional)
      </p>
    </div>
  );
};
