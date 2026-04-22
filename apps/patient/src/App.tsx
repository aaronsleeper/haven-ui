import { Link, Route, Routes } from 'react-router-dom';
import { MobileShell, TaskCard } from '@haven/ui-react';
import { Gad7Routes } from './screens/gad-7';

// Patient app root — MobileShell envelope is the registered app-shell tag
// (conform:app-shell gate). BrowserRouter is hoisted into main.tsx so the
// app-shell stays at the JSX root here. Slice 1 routes only cover the GAD-7
// check-in flow; a proper Health hub lives in slice 2. The landing page at `/`
// is a placeholder that links into the assessment.

function Landing() {
  return (
    <div className="flex flex-col min-h-dvh px-6 pt-8 pb-8">
      <h1 className="text-2xl font-serif font-semibold text-sand-900">Welcome, Maria.</h1>
      <p className="text-sm text-sand-600 mt-2">
        Your care team shared a quick check-in with you.
      </p>

      <div className="mt-8 space-y-3">
        <TaskCard
          name="Anxiety check-in"
          meta="7 questions · about 2 minutes"
          iconClass="fa-solid fa-brain"
          asComponent={Link}
          linkProps={{ to: '/assessment/gad-7' }}
        />
      </div>
    </div>
  );
}

export function App() {
  return (
    <MobileShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assessment/gad-7/*" element={<Gad7Routes />} />
      </Routes>
    </MobileShell>
  );
}
