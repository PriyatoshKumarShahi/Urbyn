export default function HotspotPanel({ hotspots = [] }) {
  return (
    <div className="brutal-card bg-[#F0FBFF] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-black">Hotspot Areas</h3>
          <p className="text-sm text-slate-600">Ranked by the number of issues reported from each area.</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {hotspots.map((item, index) => (
          <div key={item._id || index} className="rounded-[18px] border-[3px] border-ink bg-white p-3 shadow-brutalSm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-black">#{index + 1} {item.areaName || 'Unknown area'}</div>
                <div className="text-sm text-slate-600">{item.issueCount} issues • {item.category || 'mixed categories'}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Examples: {(item.previewTitles || []).join(' • ')}</div>
              </div>
              <div className="rounded-full border-[3px] border-ink bg-butter px-3 py-1 text-sm font-black">{item.issueCount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
