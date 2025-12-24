import { useState } from "react";
import { Plus, X } from "lucide-react";

export interface RSVPSettingsFormData {
  rsvpEnabled: boolean;
  rsvpDeadline: string;
  guestLimit: number | null;
  allowGuestView: boolean;
  customQuestions: { question: string }[];
}

interface RSVPSettingsProps {
  initialData?: Partial<RSVPSettingsFormData>;
  onSubmit: (data: RSVPSettingsFormData) => void;
  isLoading?: boolean;
}

export const RSVPSettings = ({
  initialData,
  onSubmit,
  isLoading,
}: RSVPSettingsProps) => {
  const [formData, setFormData] = useState<RSVPSettingsFormData>({
    rsvpEnabled: initialData?.rsvpEnabled ?? true,
    rsvpDeadline: initialData?.rsvpDeadline || "",
    guestLimit: initialData?.guestLimit || null,
    allowGuestView: initialData?.allowGuestView ?? false,
    customQuestions: initialData?.customQuestions || [],
  });

  const [newQuestion, setNewQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setFormData({
        ...formData,
        customQuestions: [
          ...formData.customQuestions,
          { question: newQuestion.trim() },
        ],
      });
      setNewQuestion("");
    }
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      customQuestions: formData.customQuestions.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* RSVP Enabled Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="rsvpEnabled"
          checked={formData.rsvpEnabled}
          onChange={(e) =>
            setFormData({ ...formData, rsvpEnabled: e.target.checked })
          }
          className="w-4 h-4 rounded"
        />
        <label
          htmlFor="rsvpEnabled"
          className="text-sm font-medium text-gray-700"
        >
          Enable RSVP for this event
        </label>
      </div>

      {/* Only show the rest of the form if RSVP is enabled */}
      {formData.rsvpEnabled && (
        <>
          {/* RSVP Deadline */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">
              RSVP Deadline
            </label>
            <input
              type="datetime-local"
              value={formData.rsvpDeadline}
              onChange={(e) =>
                setFormData({ ...formData, rsvpDeadline: e.target.value })
              }
              className="w-full px-3 py-2 border border-brand-cream rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cream-dark"
            />
            <p className="text-xs text-brand-black/60 mt-1">
              Optional: Set a deadline for guests to RSVP
            </p>
          </div>

          {/* Guest Limit */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">
              Guest Limit
            </label>
            <input
              type="number"
              min="1"
              value={formData.guestLimit || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guestLimit: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder="No limit"
              className="w-full px-3 py-2 border border-brand-cream rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cream-dark"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Maximum number of guests that can attend
            </p>
          </div>

          {/* Allow Guest View */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="allowGuestView"
              checked={formData.allowGuestView}
              onChange={(e) =>
                setFormData({ ...formData, allowGuestView: e.target.checked })
              }
              className="w-4 h-4 rounded"
            />
            <label
              htmlFor="allowGuestView"
              className="text-sm text-brand-black"
            >
              Allow guests to view other attendees
            </label>
          </div>

          {/* Custom Questions */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-brand-black">
              Custom Questions for RSVP
            </label>

            {/* Existing questions */}
            {formData.customQuestions.length > 0 && (
              <div className="space-y-2">
                {formData.customQuestions.map((q, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-brand-cream-light rounded-md"
                  >
                    <span className="flex-1 text-sm">{q.question}</span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new question */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addQuestion();
                  }
                }}
                placeholder="e.g., Dietary restrictions?"
                className="flex-1 px-3 py-2 border border-brand-cream rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cream-dark"
              />
              <button
                type="button"
                onClick={addQuestion}
                className="px-3 py-2 bg-brand-cream-light text-brand-black rounded-md hover:bg-brand-cream flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <p className="text-xs text-brand-black/60">
              Optional: Add questions for guests when they RSVP
            </p>
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-brand-black text-white rounded-md hover:bg-brand-black/90 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Continue"}
      </button>
    </form>
  );
};
