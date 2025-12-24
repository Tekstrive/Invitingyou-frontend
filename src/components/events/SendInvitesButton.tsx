import { useState } from "react";
import { Send } from "lucide-react";

interface SendInvitesButtonProps {
  eventId: string;
  guestCount: number;
  onSuccess?: () => void;
}

export const SendInvitesButton = ({
  eventId,
  guestCount,
  onSuccess,
}: SendInvitesButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (guestCount === 0) return;

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${apiUrl}/api/events/${eventId}/send-invites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to send invites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSend}
      disabled={isLoading || guestCount === 0}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-black text-white rounded-md hover:bg-brand-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Send className="w-4 h-4" />
      {isLoading
        ? "Sending..."
        : `Send Invites${guestCount > 0 ? ` (${guestCount})` : ""}`}
    </button>
  );
};
