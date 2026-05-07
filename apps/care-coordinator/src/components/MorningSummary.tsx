import type { QueueEntry } from '../data/queue';

interface MorningSummaryProps {
  urgent: QueueEntry[];
  attention: QueueEntry[];
  info: QueueEntry[];
  onItemClick: (id: string) => void;
}

const URGENT_PREVIEW_MAX = 5;

const SCHEDULED_FIXTURE = [
  { time: '10:00am', label: 'RDN visit — Maria Rivera' },
  { time: '2:00pm', label: 'Partner call — UConn Health check-in' },
  { time: '4:00pm', label: 'Report review — Q1 outcomes (Cedars)' },
];

export function MorningSummary({
  urgent,
  attention,
  info,
  onItemClick,
}: MorningSummaryProps) {
  const urgentPreview = urgent.slice(0, URGENT_PREVIEW_MAX);
  const remainingUrgent = Math.max(0, urgent.length - URGENT_PREVIEW_MAX);
  const noUrgent = urgent.length === 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title text-lg">Good morning, Sarah</h1>
          <p className="card-subtitle">Thursday, March 27</p>
        </div>

        <div className="card-body space-y-6">
          <div
            className="grid grid-cols-3 gap-4"
            role="group"
            aria-label="Queue summary"
          >
            <div
              className="card-stat"
              aria-label={`${urgent.length} urgent items`}
            >
              <div
                className={`text-2xl font-bold font-serif leading-none ${
                  noUrgent
                    ? 'text-sand-300 dark:text-sand-600'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {urgent.length}
              </div>
              <div className="stat-label">Urgent</div>
            </div>
            <div
              className="card-stat"
              aria-label={`${attention.length} needs-attention items`}
            >
              <div className="text-2xl font-bold font-serif leading-none text-amber-600 dark:text-amber-400">
                {attention.length}
              </div>
              <div className="stat-label">Needs attention</div>
            </div>
            <div
              className="card-stat"
              aria-label={`${info.length} informational items`}
            >
              <div className="text-2xl font-bold font-serif leading-none text-sand-400 dark:text-sand-500">
                {info.length}
              </div>
              <div className="stat-label">Informational</div>
            </div>
          </div>

          {noUrgent ? (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
              <i
                className="fa-regular fa-circle-check"
                aria-hidden="true"
              />
              Nothing urgent overnight.
            </p>
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400 mb-2">
                Urgent items
              </p>
              <ul className="list-group list-group-flush" role="list">
                {urgentPreview.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="list-group-item list-group-item-action w-full text-left"
                      onClick={() => onItemClick(item.id)}
                    >
                      <div className="list-group-item-content">
                        <div className="list-group-item-title">
                          {item.name} — {item.category}
                        </div>
                        <div className="list-group-item-description">
                          {item.summary}
                        </div>
                      </div>
                      {item.sla && (
                        <div className="list-group-item-trailing">
                          <span
                            className={`text-xs font-medium ${
                              item.sla.status === 'breached'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {item.sla.text}
                          </span>
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              {remainingUrgent > 0 && (
                <p className="text-xs mt-2">
                  <button
                    type="button"
                    className="text-teal-600 dark:text-teal-400 hover:underline"
                    onClick={() => {
                      const next = urgent[URGENT_PREVIEW_MAX];
                      if (next) onItemClick(next.id);
                    }}
                  >
                    and {remainingUrgent} more…
                  </button>
                </p>
              )}
            </div>
          )}

          <div className="divider-compact" />

          <div>
            <h3 className="section-title">Today</h3>
            {SCHEDULED_FIXTURE.length > 0 ? (
              <ul className="space-y-2 mt-2" role="list">
                {SCHEDULED_FIXTURE.map((item) => (
                  <li
                    key={item.time + item.label}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm font-medium text-sand-500 dark:text-sand-400 w-16 shrink-0">
                      {item.time}
                    </span>
                    <span className="text-sm text-sand-900 dark:text-sand-100">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-sand-500 dark:text-sand-400 mt-2">
                No scheduled items today.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
