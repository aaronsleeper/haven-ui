import { Navigate, Route, Routes } from 'react-router-dom';
import { Gad7Start } from './start';
import { Gad7Question } from './question';
import { Gad7Complete } from './complete';

// GAD-7 flow router — mounted at /assessment/gad-7/* by the app root.
// Start → question/:qid (x7) → complete.
// Bare /assessment/gad-7 redirects to /start so the flow always has a
// deterministic entry point.

export function Gad7Routes() {
  return (
    <Routes>
      <Route index element={<Navigate to="start" replace />} />
      <Route path="start" element={<Gad7Start />} />
      <Route path="question/:qid" element={<Gad7Question />} />
      <Route path="complete" element={<Gad7Complete />} />
    </Routes>
  );
}
