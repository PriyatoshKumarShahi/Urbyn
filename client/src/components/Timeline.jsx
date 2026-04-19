import { formatDate } from '../utils/formatters';

export default function Timeline({ items = [] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-4 w-4 rounded-full border-[3px] border-ink bg-butter" />
            {index !== items.length - 1 && <div className="mt-1 h-full w-[3px] bg-ink" />}
          </div>
          <div className="pb-4">
            <div className="font-black">{item.to}</div>
            <div className="text-sm text-slate-600">{item.note || 'Status updated'}</div>
            <div className="text-xs text-slate-500">{item.actorName || 'System'} • {formatDate(item.at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
