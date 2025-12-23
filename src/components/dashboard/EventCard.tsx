import { Calendar, MapPin, Users, CheckCircle2, Trash2 } from "lucide-react";
import { Card } from "../ui/Card";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    eventDate?: string;
    venue?: string;
    status: string;
    guestCount?: number;
    rsvpCount?: number;
  };
  onClick: () => void;
  onDelete?: (eventId: string) => void;
}

export const EventCard = ({ event, onClick, onDelete }: EventCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
    sent: { label: "Sent", className: "bg-blue-100 text-blue-700" },
    active: { label: "Active", className: "bg-green-100 text-green-700" },
    completed: {
      label: "Completed",
      className: "bg-purple-100 text-purple-700",
    },
  };

  const status = statusConfig[event.status] || statusConfig.draft;
  const guestCount = event.guestCount || 0;
  const rsvpCount = event.rsvpCount || 0;
  const rsvpPercentage =
    guestCount > 0 ? Math.round((rsvpCount / guestCount) * 100) : 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onDelete) {
      onDelete(event._id);
    }
  };

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-brand-sea/10 hover:border-brand-orange/50"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold text-brand-mirage line-clamp-2 flex-1">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 ml-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${status.className}`}
            >
              {status.label}
            </span>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-sm hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete event"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {event.eventDate && (
            <div className="flex items-center text-brand-mirage/70">
              <Calendar className="h-4 w-4 mr-2 text-brand-orange" />
              <span className="text-sm">{formatDate(event.eventDate)}</span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center text-brand-mirage/70">
              <MapPin className="h-4 w-4 mr-2 text-brand-orange" />
              <span className="text-sm line-clamp-1">{event.venue}</span>
            </div>
          )}
        </div>

        {/* RSVP Stats */}
        <div className="border-t border-brand-sea/10 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-brand-mirage/70">
              <Users className="h-4 w-4 mr-2 text-brand-sea" />
              <span className="text-sm font-medium">{guestCount} Guests</span>
            </div>
            <div className="flex items-center text-brand-mirage/70">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm font-medium">{rsvpCount} RSVPs</span>
            </div>
          </div>

          {/* Progress Bar */}
          {guestCount > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-brand-mirage/60">
                  Response Rate
                </span>
                <span className="text-xs font-semibold text-brand-orange">
                  {rsvpPercentage}%
                </span>
              </div>
              <div className="w-full bg-brand-sand rounded-full h-2">
                <div
                  className="bg-brand-orange rounded-full h-2 transition-all duration-300"
                  style={{ width: `${rsvpPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
