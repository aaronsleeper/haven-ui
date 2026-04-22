// State hook for the GAD-7 flow. Responses persist to localStorage keyed by
// the instrument id so refresh mid-assessment survives. Reset on completion
// (the Complete screen calls clearResponses() after showing results).

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'haven:assessment:gad-7';

export type Gad7Responses = Record<string, number>;

function readFromStorage(): Gad7Responses {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as Gad7Responses;
    return {};
  } catch {
    return {};
  }
}

function writeToStorage(responses: Gad7Responses): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  } catch {
    // localStorage full / disabled — ignore; in-memory state still works.
  }
}

export function useGad7Responses() {
  const [responses, setResponses] = useState<Gad7Responses>(() => readFromStorage());

  useEffect(() => {
    writeToStorage(responses);
  }, [responses]);

  const setAnswer = useCallback((questionId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const clear = useCallback(() => {
    setResponses({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { responses, setAnswer, clear };
}
