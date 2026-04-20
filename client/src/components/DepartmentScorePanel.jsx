import { Trophy } from 'lucide-react';

export default function DepartmentScorePanel({ items = [] }) {
  return (
    <div className="brutal-card bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-ink bg-butter shadow-brutalSm">
          <Trophy size={22} />
        </div>
        <div>
          <h3 className="text-2xl font-black">Department performance</h3>
          <p className="text-sm text-slate-600">Scored by resolution rate, speed, SLA compliance, and overdue backlog.</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((dept) => (
          <div key={dept.department} className="rounded-[18px] border-[3px] border-ink bg-[#FFFDF7] p-4 shadow-brutalSm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-black">#{dept.rank} {dept.department}</div>
                <div className="text-xs font-semibold text-slate-500">Resolved {dept.resolved}/{dept.total} • Overdue open {dept.overdueOpen}</div>
              </div>
              <div className="rounded-full border-[3px] border-ink bg-mint px-3 py-1 text-sm font-black">Score {dept.score}</div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm text-slate-700">
              <div className="rounded-[14px] border-[3px] border-ink bg-white p-3"><div className="text-xs font-black uppercase text-slate-500">Resolution rate</div><div className="mt-1 text-lg font-black">{dept.resolutionRate}%</div></div>
              <div className="rounded-[14px] border-[3px] border-ink bg-white p-3"><div className="text-xs font-black uppercase text-slate-500">Within SLA</div><div className="mt-1 text-lg font-black">{dept.withinSlaRate}%</div></div>
              <div className="rounded-[14px] border-[3px] border-ink bg-white p-3"><div className="text-xs font-black uppercase text-slate-500">Avg speed</div><div className="mt-1 text-lg font-black">{dept.avgResolutionTime || 0}h</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
