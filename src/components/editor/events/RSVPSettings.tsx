import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../../ui/Button";

// Schema Definition
const rsvpSettingsSchema = z.object({
  rsvpEnabled: z.boolean(),
  rsvpDeadline: z.string().optional(),
  guestLimit: z
    .number()
    .int()
    .positive("Guest limit must be a positive number")
    .optional()
    .nullable(),
  allowGuestView: z.boolean(),
  customQuestions: z.array(
    z.object({
      question: z
        .string()
        .min(3, "Question must be at least 3 characters")
        .max(200, "Question is too long"),
    })
  ),
});

export type RSVPSettingsFormData = z.infer<typeof rsvpSettingsSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<RSVPSettingsFormData>({
    resolver: zodResolver(rsvpSettingsSchema),
    defaultValues: {
      rsvpEnabled: false,
      rsvpDeadline: "",
      guestLimit: null,
      allowGuestView: false,
      customQuestions: [],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customQuestions",
  });

  const rsvpEnabled = watch("rsvpEnabled");

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleAddQuestion = () => {
    append({ question: "" });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900">RSVP Settings</h3>
        <p className="text-sm text-gray-500">
          Configure how guests can respond to your invitation.
        </p>
      </div>

      {/* Enable RSVP Toggle */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id="rsvpEnabled"
            {...register("rsvpEnabled")}
            className="h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="rsvpEnabled" className="font-medium text-gray-700">
            Enable RSVP
          </label>
          <p className="text-gray-500">
            Allow guests to respond to your invitation
          </p>
        </div>
      </div>

      {/* RSVP Fields - Only show when RSVP is enabled */}
      {rsvpEnabled && (
        <div className="space-y-6 pl-7 border-l-2 border-brand-orange/20">
          {/* RSVP Deadline */}
          <div>
            <label
              htmlFor="rsvpDeadline"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              RSVP Deadline
            </label>
            <input
              type="datetime-local"
              id="rsvpDeadline"
              {...register("rsvpDeadline")}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm px-4 py-2"
            />
            {errors.rsvpDeadline && (
              <p className="mt-1 text-sm text-red-600">
                {errors.rsvpDeadline.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Optional. Set a deadline for guests to respond.
            </p>
          </div>

          {/* Guest Limit */}
          <div>
            <label
              htmlFor="guestLimit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Guest Limit
            </label>
            <input
              type="number"
              id="guestLimit"
              {...register("guestLimit", {
                valueAsNumber: true,
                setValueAs: (v) => (v === "" ? null : parseInt(v, 10)),
              })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm px-4 py-2"
              placeholder="e.g. 50"
              min="1"
            />
            {errors.guestLimit && (
              <p className="mt-1 text-sm text-red-600">
                {errors.guestLimit.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Optional. Maximum number of attendees.
            </p>
          </div>

          {/* Allow Guest View */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="allowGuestView"
                {...register("allowGuestView")}
                className="h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="allowGuestView"
                className="font-medium text-gray-700"
              >
                Allow guests to view other attendees
              </label>
              <p className="text-gray-500">
                Guests can see who else is attending
              </p>
            </div>
          </div>

          {/* Custom Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Custom Questions
              </label>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-colors"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Question
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="text-sm text-gray-500 italic bg-gray-50 rounded-lg p-4 text-center">
                No custom questions yet. Click "Add Question" to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        {...register(`customQuestions.${index}.question`)}
                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm px-4 py-2 ${
                          errors.customQuestions?.[index]?.question
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        placeholder="e.g. Dietary restrictions?"
                      />
                      {errors.customQuestions?.[index]?.question && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.customQuestions[index].question?.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      aria-label="Remove question"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Ask guests additional questions when they RSVP (e.g., dietary
              restrictions, song requests, etc.)
            </p>
          </div>
        </div>
      )}

      <div className="pt-6 flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
          variant="secondary"
          className="rounded-full px-10 h-12 text-base font-semibold"
        >
          Save & Continue
        </Button>
      </div>
    </form>
  );
};
