import { Trash2 } from "lucide-react";

export interface Guest {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
}

interface ContactListProps {
  guests: Guest[];
  onDelete: (id: string) => void;
  isDeleting?: string;
}

export const ContactList = ({
  guests,
  onDelete,
  isDeleting,
}: ContactListProps) => {
  if (guests.length === 0) {
    return (
      <div className="text-center py-8 text-brand-black/60">
        No guests added yet. Add guests manually or upload a CSV.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {guests.map((guest, index) => {
        // Handle both id and _id (MongoDB)
        const guestId = guest.id || guest._id || `guest-${index}`;

        return (
          <div
            key={guestId}
            className="flex items-center justify-between p-3 bg-brand-cream-light rounded-md"
          >
            <div>
              <p className="font-medium text-brand-black">{guest.name}</p>
              <p className="text-sm text-brand-black/60">{guest.email}</p>
            </div>
            <button
              onClick={() => onDelete(guestId)}
              disabled={isDeleting === guestId}
              className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {isDeleting === guestId ? (
                <span className="text-xs">...</span>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
