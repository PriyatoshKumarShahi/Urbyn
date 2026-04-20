import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatHours } from '../utils/formatters';

export default function IgnoredIssuesPanel({ items = [] }) {
  return (
    <div className="brutal-card bg-[#FFF6F6] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-ink bg-red-100 shadow-brutalSm">
          <AlertTriangle className="text-red-600" size={22} />
        </div>
        <div>
          <h3 className="text-2xl font-black">Ignored issues</h3>
          <p className="text-sm text-slate-600">Issues that crossed their SLA deadline and are still unresolved.</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {!items.length && <div className="rounded-[18px] border-[3px] border-ink bg-white p-4 font-semibold">No ignored issues right now.</div>}
        {items.map((item) => (
          <div key={item._id} className="rounded-[18px] border-[3px] border-ink bg-white p-4 shadow-brutalSm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-lg font-black">{item.title}</div>
                <div className="text-sm text-slate-600">{item.areaName || 'Area unavailable'} • {item.department}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Reported by {item.reporterName || 'Unknown'} • Deadline {item.slaDeadline ? formatDate(item.slaDeadline) : 'n/a'}</div>
              </div>
              <div className="rounded-full border-[3px] border-ink bg-red-100 px-3 py-1 text-xs font-black text-red-700">Ignored for {formatHours(item.overdueByHours)}</div>
            </div>
            <div className="mt-3">
              <Link to={`/issues/${item._id}`} className="font-black underline">Open issue card</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
