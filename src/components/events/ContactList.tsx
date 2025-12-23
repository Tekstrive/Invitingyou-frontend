import { Trash2, Mail, Phone, User } from "lucide-react";

export interface Guest {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  source: "manual" | "csv" | "contacts";
  sentAt?: string;
  createdAt: string;
}

interface ContactListProps {
  guests: Guest[];
  onDelete: (guestId: string) => void;
  isDeleting?: string; // ID of guest being deleted
}

export const ContactList = ({
  guests,
  onDelete,
  isDeleting,
}: ContactListProps) => {
  if (guests.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
          <User className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No guests yet
        </h3>
        <p className="text-sm text-gray-500">
          Add guests manually or upload a CSV file to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Guest List</h3>
        <p className="text-sm text-gray-500">
          {guests.length} {guests.length === 1 ? "guest" : "guests"} added
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {guests.map((guest) => (
          <div
            key={guest._id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {guest.name}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      guest.source === "manual"
                        ? "bg-blue-100 text-blue-800"
                        : guest.source === "csv"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {guest.source}
                  </span>
                </div>

                <div className="space-y-1">
                  {guest.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{guest.email}</span>
                    </div>
                  )}
                  {guest.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{guest.phone}</span>
                    </div>
                  )}
                </div>

                {guest.sentAt && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                      ✓ Invitation sent
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => onDelete(guest._id)}
                disabled={isDeleting === guest._id}
                className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Delete guest"
              >
                {isDeleting === guest._id ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
