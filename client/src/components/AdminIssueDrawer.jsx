import toast from 'react-hot-toast';
import api from '../api/client';
import Timeline from './Timeline';

export default function AdminIssueDrawer({ issue, onClose, onUpdated }) {
  if (!issue) return null;

  const updateStatus = async (status) => {
    try {
      await api.patch(`/issues/${issue._id}/status`, { status, note: `Admin moved issue to ${status}` });
      toast.success('Status updated');
      onUpdated?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 p-4">
      <div className="h-full w-full max-w-xl overflow-y-auto brutal-card bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-3xl font-black">{issue.title}</h3>
            <p className="text-slate-600">{issue.areaName || issue.addressText}</p>
          </div>
          <button onClick={onClose} className="brutal-btn bg-blush px-3 py-2">Close</button>
        </div>
        <img src={issue.image} alt={issue.title} className="mt-4 h-60 w-full rounded-[20px] border-[3px] border-ink object-cover" />
        <div className="mt-4 grid gap-2 text-sm">
          <div><b>Reporter:</b> {issue.createdBy?.name || issue.reporterName}</div>
          <div><b>Email:</b> {issue.createdBy?.email || 'n/a'}</div>
          <div><b>Department:</b> {issue.department}</div>
          <div><b>Status:</b> {issue.status}</div>
          <div><b>SLA Deadline:</b> {issue.slaDeadline ? new Date(issue.slaDeadline).toLocaleString() : 'n/a'}</div>
        </div>
        <p className="mt-4 text-slate-700">{issue.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {['assigned', 'in-progress', 'resolved'].map((status) => (
            <button key={status} onClick={() => updateStatus(status)} className="brutal-btn bg-mint px-4 py-2 capitalize">Mark {status}</button>
          ))}
        </div>
        <div className="mt-6">
          <h4 className="mb-3 text-xl font-black">Status history</h4>
          <Timeline items={issue.statusHistory || []} />
        </div>
      </div>
    </div>
  );
}
