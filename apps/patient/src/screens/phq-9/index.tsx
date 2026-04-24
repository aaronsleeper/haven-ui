import { Navigate, Route, Routes } from 'react-router-dom';
import { Phq9Start } from './start';
import { Phq9Question } from './question';
import { Phq9Complete } from './complete';

// PHQ-9 flow router — mounted at /assessment/phq-9/* by the app root.
// Start → question/:qid (x9) → complete.
// Bare /assessment/phq-9 redirects to /start so the flow always has a
// deterministic entry point.

export function Phq9Routes() {
  return (
    <Routes>
      <Route index element={<Navigate to="start" replace />} />
      <Route path="start" element={<Phq9Start />} />
      <Route path="question/:qid" element={<Phq9Question />} />
      <Route path="complete" element={<Phq9Complete />} />
    </Routes>
  );
}
