import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getErrorMessage } from "../utils/errorHandler";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Loader2, PartyPopper, Calendar } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { generateICS, downloadICS } from "../utils/icsGenerator";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface EventData {
  _id: string;
  title: string;
  description?: string;
  eventDate?: Date | string;
  venue?: string;
  customQuestions?: string[];
}

interface GuestData {
  _id: string;
  name: string;
  email?: string;
}

export const PublicRSVP = () => {
  const { eventId, guestId } = useParams<{
    eventId: string;
    guestId: string;
  }>();

  const [event, setEvent] = useState<EventData | null>(null);
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rsvpStatus, setRsvpStatus] = useState<
    "attending" | "not_attending" | "maybe" | null
  >(null);
  const [customResponses, setCustomResponses] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_URL}/api/events/public/${eventId}/${guestId}`
        );

        if (response.data.success) {
          setEvent(response.data.event);
          setGuest(response.data.guest);
        } else {
          setError("Failed to load event");
        }
      } catch (err: unknown) {
        console.error("Error loading event:", err);
        setError(getErrorMessage(err) || "Failed to load event");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId && guestId) {
      fetchEventData();
    }
  }, [eventId, guestId]);

  const handleCustomResponseChange = (question: string, value: string) => {
    setCustomResponses((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!rsvpStatus || !eventId || !guestId) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/rsvp/${eventId}/${guestId}`, {
        status: rsvpStatus,
        customResponses,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Error submitting RSVP:", err);
      alert(getErrorMessage(err) || "Failed to submit RSVP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCalendar = () => {
    if (!event) return;

    const icsContent = generateICS({
      title: event.title,
      description: event.description,
      eventDate: event.eventDate || new Date(),
      venue: event.venue,
    });

    downloadICS(icsContent, `${event.title.replace(/\s+/g, "_")}.ics`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-sand flex flex-col items-center justify-center">
        <Logo className="mb-8" />
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <p className="mt-4 text-brand-mirage/60">Opening your invitation...</p>
      </div>
    );
  }

  if (error || !event || !guest) {
    return (
      <div className="min-h-screen bg-brand-sand flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 bg-white border-brand-sea/20 shadow-xl">
          <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-mirage mb-4">
            Event Not Found
          </h1>
          <p className="text-brand-mirage/60 mb-8">
            {error || "This invitation link is invalid or has expired."}
          </p>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-sand flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 bg-white border-brand-sea/20 shadow-xl">
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            {rsvpStatus === "attending" || rsvpStatus === "maybe" ? (
              <PartyPopper className="h-8 w-8" />
            ) : (
              <div className="h-8 w-8" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-brand-mirage mb-4">
            {rsvpStatus === "attending"
              ? "You're on the list!"
              : rsvpStatus === "maybe"
                ? "Thanks for letting us know!"
                : "We'll miss you!"}
          </h1>
          <p className="text-brand-mirage/60 mb-8">
            {rsvpStatus === "attending"
              ? "Thank you for RSVPing. We can't wait to celebrate with you."
              : rsvpStatus === "maybe"
                ? "We hope you can make it! We'll send you a reminder."
                : "Thank you for letting us know."}
          </p>

          {(rsvpStatus === "attending" || rsvpStatus === "maybe") &&
            event.eventDate && (
              <Button
                onClick={handleDownloadCalendar}
                variant="secondary"
                className="mb-6"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            )}

          <div className="text-sm text-brand-mirage/40">
            Response recorded for {guest.name}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-sand py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Logo className="mb-8 mx-auto" />

        {/* Event Details Card */}
        <Card className="mb-8 bg-white border-brand-sea/20 shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-brand-mirage mb-4">
              {event.title}
            </h1>

            {event.eventDate && (
              <div className="flex items-center text-brand-mirage/70 mb-2">
                <Calendar className="h-5 w-5 mr-2" />
                <span>
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}

            {event.venue && (
              <div className="text-brand-mirage/70 mb-4">📍 {event.venue}</div>
            )}

            {event.description && (
              <p className="text-brand-mirage/80 mt-6 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>
        </Card>

        {/* RSVP Form Card */}
        <Card className="bg-white border-brand-sea/20 shadow-xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-brand-mirage mb-6">
              Hi {guest.name}, will you be attending?
            </h2>

            {/* RSVP Status Selection */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setRsvpStatus("attending")}
                className={`w-full p-4 rounded-sm border-2 transition-all ${
                  rsvpStatus === "attending"
                    ? "border-brand-orange bg-brand-orange/10 text-brand-orange font-semibold"
                    : "border-brand-sea/20 hover:border-brand-orange/50"
                }`}
              >
                ✓ Yes, I'll be there
              </button>

              <button
                onClick={() => setRsvpStatus("maybe")}
                className={`w-full p-4 rounded-sm border-2 transition-all ${
                  rsvpStatus === "maybe"
                    ? "border-brand-orange bg-brand-orange/10 text-brand-orange font-semibold"
                    : "border-brand-sea/20 hover:border-brand-orange/50"
                }`}
              >
                ? Maybe
              </button>

              <button
                onClick={() => setRsvpStatus("not_attending")}
                className={`w-full p-4 rounded-sm border-2 transition-all ${
                  rsvpStatus === "not_attending"
                    ? "border-brand-orange bg-brand-orange/10 text-brand-orange font-semibold"
                    : "border-brand-sea/20 hover:border-brand-orange/50"
                }`}
              >
                ✗ Sorry, I can't make it
              </button>
            </div>

            {/* Custom Questions */}
            {rsvpStatus &&
              event.customQuestions &&
              event.customQuestions.length > 0 && (
                <div className="space-y-4 mb-6 pt-6 border-t border-brand-sea/10">
                  <h3 className="font-semibold text-brand-mirage">
                    A few quick questions:
                  </h3>
                  {event.customQuestions.map((question, index) => (
                    <div key={index}>
                      <Label htmlFor={`question-${index}`} className="mb-2">
                        {question}
                      </Label>
                      <Input
                        id={`question-${index}`}
                        value={customResponses[question] || ""}
                        onChange={(e) =>
                          handleCustomResponseChange(question, e.target.value)
                        }
                        placeholder="Your answer..."
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!rsvpStatus || isSubmitting}
              variant="primary"
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit RSVP"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
