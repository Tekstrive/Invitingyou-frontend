import { useState, useEffect, useCallback, useRef } from "react";

interface UseAutoSaveOptions<T> {
  eventId: string;
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export const useAutoSave = <T>({
  eventId,
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>("");

  // Trigger save function
  const triggerSave = useCallback(async () => {
    if (!enabled) return;

    try {
      setSaveStatus("saving");
      await onSave(data);
      setSaveStatus("saved");
      setLastSaved(new Date());

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Auto-save failed:", error);
      setSaveStatus("error");

      // Reset to idle after showing error
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    }
  }, [data, onSave, enabled]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled) return;

    const dataString = JSON.stringify(data);

    // Skip if data hasn't changed
    if (dataString === previousDataRef.current) {
      return;
    }

    previousDataRef.current = dataString;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      triggerSave();
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, enabled, triggerSave]);

  // Save to localStorage as backup
  useEffect(() => {
    if (!enabled) return;

    try {
      localStorage.setItem(
        `event_draft_${eventId}`,
        JSON.stringify({
          data,
          savedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [data, eventId, enabled]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await triggerSave();
  }, [triggerSave]);

  // Load from localStorage
  const loadDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem(`event_draft_${eventId}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        return parsed.data;
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
    return null;
  }, [eventId]);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`event_draft_${eventId}`);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  }, [eventId]);

  return {
    saveStatus,
    lastSaved,
    saveNow,
    loadDraft,
    clearDraft,
  };
};
