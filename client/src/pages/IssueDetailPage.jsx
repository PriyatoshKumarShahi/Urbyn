import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import Timeline from '../components/Timeline';
import { formatDate, timeLeftLabel } from '../utils/formatters';

export default function IssueDetailPage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    api.get(`/issues/${id}`).then((res) => setIssue(res.data));
  }, [id]);

  if (!issue) return <div className="p-6">Loading issue...</div>;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="brutal-card overflow-hidden bg-white">
        <img src={issue.image} alt={issue.title} className="h-[360px] w-full border-b-[3px] border-ink object-cover" />
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap gap-2 text-sm font-black">
            <span className="rounded-full bg-mint px-3 py-1">{issue.status}</span>
            <span className="rounded-full bg-butter px-3 py-1">{issue.category}</span>
            <span className="rounded-full bg-sky-100 px-3 py-1">{issue.department}</span>
          </div>
          <h2 className="text-5xl font-black">{issue.title}</h2>
          <p className="text-lg text-slate-700">{issue.description}</p>
          <div className="grid gap-2 text-sm text-slate-600">
            <div><b>Reported by:</b> {issue.createdBy?.name || issue.reporterName}</div>
            <div><b>Area:</b> {issue.areaName || issue.addressText}</div>
            <div><b>Created:</b> {formatDate(issue.createdAt)}</div>
            <div><b>SLA:</b> {timeLeftLabel(issue.slaDeadline, issue.isOverdue, issue.overdueByHours)}</div>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <div className="brutal-card bg-[#F8FDFF] p-5">
          <h3 className="text-2xl font-black">Issue timeline</h3>
          <div className="mt-4"><Timeline items={issue.statusHistory || []} /></div>
        </div>
        {issue.resolvedImage && (
          <div className="brutal-card bg-white p-4">
            <h3 className="text-2xl font-black">Proof of fix</h3>
            <img src={issue.resolvedImage} alt="Resolved proof" className="mt-4 h-56 w-full rounded-[18px] border-[3px] border-ink object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
