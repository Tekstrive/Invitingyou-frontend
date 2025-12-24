import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { getErrorMessage } from "../../../utils/errorHandler";

interface SendInvitesButtonProps {
  eventId: string;
  guestCount: number;
  onSuccess?: () => void;
}

interface PublishResult {
  total: number;
  sent: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}

export const SendInvitesButton = ({
  eventId,
  guestCount,
  onSuccess,
}: SendInvitesButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<PublishResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (guestCount === 0) {
      alert("Please add guests before sending invitations.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError(null);
    setResult(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to send invitations.");
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/events/${eventId}/publish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send invitations");
      }

      setResult(data.results);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error("Error sending invitations:", err);
      setError(getErrorMessage(err) || "Failed to send invitations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleCloseResult = () => {
    setResult(null);
    setError(null);
  };

  return (
    <>
      {/* Send Button */}
      <button
        onClick={handleClick}
        disabled={isLoading || guestCount === 0}
        className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-brand-orange hover:bg-brand-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Sending Invitations...
          </>
        ) : (
          <>
            <Send className="-ml-1 mr-2 h-5 w-5" />
            Send Invitations ({guestCount})
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Send Invitations?
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              You're about to send email invitations to{" "}
              <strong>{guestCount}</strong>{" "}
              {guestCount === 1 ? "guest" : "guests"}. This action cannot be
              undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-brand-black text-white rounded-full hover:bg-brand-black/90 transition-colors"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center mb-4">
              <div
                className={`rounded-full p-3 mr-4 ${
                  result.failed === 0 ? "bg-green-100" : "bg-yellow-100"
                }`}
              >
                {result.failed === 0 ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {result.failed === 0
                  ? "Invitations Sent!"
                  : "Invitations Sent with Errors"}
              </h3>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Guests:</span>
                <span className="font-medium text-gray-900">
                  {result.total}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Successfully Sent:</span>
                <span className="font-medium text-green-600">
                  {result.sent}
                </span>
              </div>
              {result.failed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Failed:</span>
                  <span className="font-medium text-red-600">
                    {result.failed}
                  </span>
                </div>
              )}
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Errors:
                </h4>
                <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                  {result.errors.slice(0, 5).map((err, index) => (
                    <li key={index}>
                      • {err.email}: {err.error}
                    </li>
                  ))}
                  {result.errors.length > 5 && (
                    <li className="text-red-600">
                      ... and {result.errors.length - 5} more errors
                    </li>
                  )}
                </ul>
              </div>
            )}

            <button
              onClick={handleCloseResult}
              className="w-full px-4 py-2 bg-brand-mirage text-white rounded-full hover:bg-brand-mirage/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Error Sending Invitations
              </h3>
            </div>

            <p className="text-gray-600 mb-6">{error}</p>

            <button
              onClick={handleCloseResult}
              className="w-full px-4 py-2 bg-brand-mirage text-white rounded-full hover:bg-brand-mirage/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
