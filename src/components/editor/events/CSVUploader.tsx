import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../../ui/Button";

export interface ParsedGuest {
  name: string;
  email?: string;
  phone?: string;
}

interface CSVUploaderProps {
  onUpload: (guests: ParsedGuest[]) => void;
  isUploading?: boolean;
  onUploadComplete?: () => void;
}

export const CSVUploader = ({
  onUpload,
  isUploading,
  onUploadComplete,
}: CSVUploaderProps) => {
  const [parsedData, setParsedData] = useState<ParsedGuest[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [wasUploading, setWasUploading] = useState(false);

  // Clear preview after successful upload
  useEffect(() => {
    if (wasUploading && !isUploading) {
      // Upload just completed - clear the preview
      setParsedData([]);
      setParseErrors([]);
      setFileName("");
      if (onUploadComplete) {
        onUploadComplete();
      }
    }
    setWasUploading(isUploading || false);
  }, [isUploading, wasUploading, onUploadComplete]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setParseErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(), // Trim whitespace from headers
      complete: (results) => {
        console.log("CSV Parse Results:", results);
        console.log("First row data:", results.data[0]);

        const guests: ParsedGuest[] = [];
        const errors: string[] = [];

        (results.data as Record<string, unknown>[]).forEach((row, index) => {
          // Log the row to see what columns we have
          if (index === 0) {
            console.log("Available columns:", Object.keys(row));
          }

          // Try to find name field (case-insensitive)
          const name =
            row.name ||
            row.Name ||
            row.NAME ||
            row.fullname ||
            row.FullName ||
            row["Full Name"] ||
            row["full name"];

          if (!name || typeof name !== "string" || name.trim().length < 2) {
            errors.push(`Row ${index + 1}: Missing or invalid name`);
            return;
          }

          // Try to find email field (case-insensitive)
          const email =
            row.email ||
            row.Email ||
            row.EMAIL ||
            row["Email Address"] ||
            row["email address"];

          // Try to find phone field (case-insensitive)
          const phone =
            row.phone ||
            row.Phone ||
            row.PHONE ||
            row["Phone Number"] ||
            row["phone number"] ||
            row.mobile ||
            row.Mobile;

          guests.push({
            name: (name as string).trim(),
            email:
              email && typeof email === "string" ? email.trim() : undefined,
            phone:
              phone && typeof phone === "string" ? phone.trim() : undefined,
          });
        });

        if (guests.length === 0) {
          const firstRow = results.data[0] as any;
          const availableColumns = firstRow
            ? Object.keys(firstRow).join(", ")
            : "none";
          setParseErrors([
            `No valid guests found. Please ensure your CSV has a 'name' column.`,
            `Available columns found: ${availableColumns}`,
            `Make sure the first row contains column headers.`,
          ]);
        } else {
          setParsedData(guests);
          if (errors.length > 0) {
            setParseErrors(errors);
          }
        }
      },
      error: (error) => {
        console.error("CSV Parse Error:", error);
        setParseErrors([`Failed to parse CSV: ${error.message}`]);
      },
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    multiple: false,
  });

  const handleConfirmUpload = () => {
    if (parsedData.length > 0) {
      onUpload(parsedData);
    }
  };

  const handleClear = () => {
    setParsedData([]);
    setParseErrors([]);
    setFileName("");
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {parsedData.length === 0 && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-brand-orange bg-brand-orange/5"
              : "border-gray-300 hover:border-brand-orange/50 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload
            className={`w-12 h-12 mx-auto mb-4 ${
              isDragActive ? "text-brand-orange" : "text-gray-400"
            }`}
          />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {isDragActive ? "Drop CSV file here" : "Upload CSV File"}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-gray-400">
            CSV should have columns: name (required), email, phone
          </p>
        </div>
      )}

      {/* Parse Errors */}
      {parseErrors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                Parsing Warnings
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {parseErrors.slice(0, 5).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
                {parseErrors.length > 5 && (
                  <li className="text-yellow-600">
                    ... and {parseErrors.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {parsedData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-brand-sea" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Preview: {fileName}
                </h3>
                <p className="text-sm text-gray-500">
                  {parsedData.length}{" "}
                  {parsedData.length === 1 ? "guest" : "guests"} found
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parsedData.slice(0, 10).map((guest, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {guest.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {guest.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {guest.phone || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.length > 10 && (
              <div className="px-6 py-3 bg-gray-50 text-center text-sm text-gray-500">
                Showing first 10 of {parsedData.length} guests
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              Ready to import {parsedData.length} guests
            </div>
            <Button
              onClick={handleConfirmUpload}
              isLoading={isUploading}
              variant="secondary"
              className="rounded-full px-6"
            >
              Confirm & Upload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
