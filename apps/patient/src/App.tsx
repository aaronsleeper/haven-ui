import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { MobileShell } from '@haven/ui-react';
import { Gad7Routes } from './screens/gad-7';

// Patient app root — mobile-shell envelope + BrowserRouter. Slice 1 routes
// only cover the GAD-7 check-in flow; a proper Health hub lives in slice 2.
// The landing page at `/` is a placeholder that links into the assessment.

function Landing() {
  return (
    <div className="flex flex-col min-h-dvh px-6 pt-8 pb-8">
      <h1 className="text-2xl font-serif font-semibold text-sand-900">Welcome, Maria.</h1>
      <p className="text-sm text-sand-600 mt-2">
        Your care team shared a quick check-in with you.
      </p>

      <div className="mt-8 space-y-3">
        <Link
          to="/assessment/gad-7"
          className="card card-body no-underline block"
        >
          <div className="flex items-center gap-3">
            <span className="avatar avatar-primary">
              <i className="fa-solid fa-brain avatar-icon" aria-hidden="true"></i>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sand-900">Anxiety check-in</p>
              <p className="text-xs text-sand-600">7 questions · about 2 minutes</p>
            </div>
            <i className="fa-solid fa-chevron-right text-sand-400 text-xs" aria-hidden="true"></i>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <MobileShell>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/assessment/gad-7/*" element={<Gad7Routes />} />
        </Routes>
      </MobileShell>
    </BrowserRouter>
  );
}
