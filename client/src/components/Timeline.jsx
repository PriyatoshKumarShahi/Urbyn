import { CheckCheck, CircleDot, Clock3, FileClock, Wrench } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const metaByStatus = {
  pending: { label: 'Reported', icon: CircleDot, chip: 'bg-blush' },
  assigned: { label: 'Assigned', icon: FileClock, chip: 'bg-skybubble' },
  'in-progress': { label: 'In Progress', icon: Wrench, chip: 'bg-butter' },
  resolved: { label: 'Resolved', icon: CheckCheck, chip: 'bg-mint' }
};

export default function Timeline({ items = [], deadline }) {
  return (
    <div className="space-y-4">
      {deadline && (
        <div className="rounded-[18px] border-[3px] border-ink bg-white p-4 shadow-brutalSm">
          <div className="flex items-center gap-2 font-black"><Clock3 size={18} /> SLA deadline</div>
          <div className="mt-1 text-sm text-slate-600">Expected resolution by {formatDate(deadline)}</div>
        </div>
      )}
      {items.map((item, index) => {
        const meta = metaByStatus[item.to] || metaByStatus.pending;
        const Icon = meta.icon;
        return (
          <div key={`${item.to}-${index}`} className="relative flex gap-4">
            <div className="flex w-10 shrink-0 flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink ${meta.chip} shadow-brutalSm`}>
                <Icon size={18} />
              </div>
              {index !== items.length - 1 && <div className="mt-2 h-full min-h-10 w-[3px] rounded-full bg-ink/70" />}
            </div>
            <div className="flex-1 rounded-[20px] border-[3px] border-ink bg-white p-4 shadow-brutalSm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-black">{meta.label}</div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.actorName || 'System update'}</div>
                </div>
                <div className={`rounded-full border-[3px] border-ink px-3 py-1 text-xs font-black ${meta.chip}`}>{item.to}</div>
              </div>
              <div className="mt-2 text-sm text-slate-700">{item.note || 'Status updated in workflow'}</div>
              <div className="mt-3 text-xs font-semibold text-slate-500">{formatDate(item.at)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
