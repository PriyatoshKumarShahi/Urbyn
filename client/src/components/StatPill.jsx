export default function StatPill({ children, color = 'bg-white' }) {
  return <span className={`inline-flex items-center rounded-full border-[3px] border-ink px-3 py-1 text-xs font-black shadow-brutalSm ${color}`}>{children}</span>;
}
