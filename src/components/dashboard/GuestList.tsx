import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Download,
} from "lucide-react";

interface Guest {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus?: "attending" | "not_attending" | "maybe" | null;
  respondedAt?: string;
}

interface GuestListProps {
  guests: Guest[];
  onExportCSV: () => void;
}

type FilterType = "all" | "attending" | "not_attending" | "maybe" | "pending";

export const GuestList = ({ guests, onExportCSV }: GuestListProps) => {
  const [filter, setFilter] = useState<FilterType>("all");

  const getFilteredGuests = () => {
    if (filter === "all") return guests;
    if (filter === "pending") return guests.filter((g) => !g.rsvpStatus);
    return guests.filter((g) => g.rsvpStatus === filter);
  };

  const filteredGuests = getFilteredGuests();

  const getStatusIcon = (
    status?: "attending" | "not_attending" | "maybe" | null
  ) => {
    switch (status) {
      case "attending":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "not_attending":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "maybe":
        return <HelpCircle className="h-5 w-5 text-amber-600" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusText = (
    status?: "attending" | "not_attending" | "maybe" | null
  ) => {
    switch (status) {
      case "attending":
        return "Attending";
      case "not_attending":
        return "Not Attending";
      case "maybe":
        return "Maybe";
      default:
        return "Pending";
    }
  };

  const getStatusBadgeClass = (
    status?: "attending" | "not_attending" | "maybe" | null
  ) => {
    switch (status) {
      case "attending":
        return "bg-green-100 text-green-700";
      case "not_attending":
        return "bg-red-100 text-red-700";
      case "maybe":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filters: { type: FilterType; label: string; count: number }[] = [
    { type: "all", label: "All", count: guests.length },
    {
      type: "attending",
      label: "Attending",
      count: guests.filter((g) => g.rsvpStatus === "attending").length,
    },
    {
      type: "not_attending",
      label: "Not Attending",
      count: guests.filter((g) => g.rsvpStatus === "not_attending").length,
    },
    {
      type: "maybe",
      label: "Maybe",
      count: guests.filter((g) => g.rsvpStatus === "maybe").length,
    },
    {
      type: "pending",
      label: "Pending",
      count: guests.filter((g) => !g.rsvpStatus).length,
    },
  ];

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-brand-mirage">Guest List</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={onExportCSV}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.type}
            onClick={() => setFilter(f.type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.type
                ? "bg-brand-orange text-white shadow-md"
                : "bg-brand-sand text-brand-mirage hover:bg-brand-orange/10"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Guest Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-sea/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-brand-mirage">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-brand-mirage">
                Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-brand-mirage">
                Phone
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-brand-mirage">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-brand-mirage">
                Responded
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-brand-mirage/60"
                >
                  No guests found
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr
                  key={guest._id}
                  className="border-b border-brand-sea/5 hover:bg-brand-sand/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium text-brand-mirage">
                    {guest.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-brand-mirage/70">
                    {guest.email || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-brand-mirage/70">
                    {guest.phone || "-"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(guest.rsvpStatus)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          guest.rsvpStatus
                        )}`}
                      >
                        {getStatusText(guest.rsvpStatus)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-brand-mirage/70">
                    {guest.respondedAt
                      ? new Date(guest.respondedAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-brand-mirage/60">
        Showing {filteredGuests.length} of {guests.length} guests
      </div>
    </Card>
  );
};
