// Generic state hook for per-question-id assessment instruments.
// Parameterized by instrumentId so parallel flows (GAD-7, PHQ-9, DAST-10, …)
// share the same persistence + cleanup semantics without duplicating logic.
//
// Storage key is namespaced `haven:assessment:${instrumentId}` so concurrent
// in-progress flows can't collide. Responses shape is
// `Record<questionId, optionIndex>`; scoring lives in each instrument's
// question bank (it's per-instrument, not shared).
//
// StrictMode note: clearing happens on the Start-screen onClick, not on
// Complete-screen unmount, so React 18's synthetic mount/unmount/remount
// cycle can't empty responses mid-render and trip a redirect guard.
// (See GAD-7 Patch 70 for the case that forced this pattern.)

import { useCallback, useEffect, useState } from 'react';

export type AssessmentResponses = Record<string, number>;

function storageKey(instrumentId: string): string {
  return `haven:assessment:${instrumentId}`;
}

function readFromStorage(instrumentId: string): AssessmentResponses {
  try {
    const raw = window.localStorage.getItem(storageKey(instrumentId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as AssessmentResponses;
    return {};
  } catch {
    return {};
  }
}

function writeToStorage(instrumentId: string, responses: AssessmentResponses): void {
  try {
    window.localStorage.setItem(storageKey(instrumentId), JSON.stringify(responses));
  } catch {
    // localStorage full / disabled — ignore; in-memory state still works.
  }
}

export function useAssessmentResponses(instrumentId: string) {
  const [responses, setResponses] = useState<AssessmentResponses>(() =>
    readFromStorage(instrumentId),
  );

  useEffect(() => {
    writeToStorage(instrumentId, responses);
  }, [instrumentId, responses]);

  const setAnswer = useCallback((questionId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const clear = useCallback(() => {
    setResponses({});
    try {
      window.localStorage.removeItem(storageKey(instrumentId));
    } catch {
      // ignore
    }
  }, [instrumentId]);

  return { responses, setAnswer, clear };
}
