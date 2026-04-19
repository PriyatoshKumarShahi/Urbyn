import { Link } from 'react-router-dom';
import { ArrowBigUp, CheckCircle2, Clock3, MapPin, Trash2 } from 'lucide-react';
import { formatDate, severityColor, statusColor, timeLeftLabel } from '../utils/formatters';
import api from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function IssueCard({ issue, onRefresh }) {
  const { user } = useAuth();

  const handleAction = async (path, success) => {
    if (!user) return toast.error('Please login first');
    try {
      await api.post(path);
      toast.success(success);
      onRefresh?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/issues/${issue._id}`);
      toast.success('Issue deleted');
      onRefresh?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const canDelete = user && (user.role === 'admin' || user._id === issue.createdBy?._id || user._id === issue.createdBy);

  return (
    <article className="brutal-card overflow-hidden bg-white">
      <div className="relative h-52 overflow-hidden border-b-[3px] border-ink bg-slate-100">
        <img src={issue.image} alt={issue.title} className="h-full w-full object-cover" />
        <span className={`absolute right-3 top-3 rounded-full border-[3px] border-ink px-3 py-1 text-xs font-black ${severityColor(issue.severity)}`}>{issue.severity.toUpperCase()}</span>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black ${statusColor(issue.status)}`}>{issue.status}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{issue.category}</span>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">{issue.department}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-black ${issue.isOverdue ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{timeLeftLabel(issue.slaDeadline, issue.isOverdue, issue.overdueByHours)}</span>
        </div>
        <div>
          <Link to={`/issues/${issue._id}`} className="text-3xl font-black leading-tight hover:underline">{issue.title}</Link>
          <p className="mt-2 text-slate-600">{issue.description}</p>
        </div>
        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2"><MapPin size={16} /> {issue.areaName || issue.addressText || 'Area unavailable'}</div>
          <div className="flex items-center gap-2"><Clock3 size={16} /> {formatDate(issue.createdAt)}</div>
          <div>Reported by <span className="font-black text-slate-700">{issue.createdBy?.name || issue.reporterName}</span></div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => handleAction(`/issues/${issue._id}/upvote`, 'Vote updated')} className="brutal-btn flex items-center gap-2 bg-slate-900 px-4 py-3 text-white"><ArrowBigUp size={18} /> Upvote ({issue.upvotes})</button>
          <button onClick={() => handleAction(`/issues/${issue._id}/verify`, 'Verification updated')} className="brutal-btn flex items-center gap-2 bg-mint px-4 py-3 text-emerald-900"><CheckCircle2 size={18} /> Verify fix ({issue.verifiedFixCount})</button>
          {canDelete && <button onClick={handleDelete} className="brutal-btn flex items-center gap-2 bg-red-100 px-4 py-3 text-red-700"><Trash2 size={18} /> Delete</button>}
        </div>
      </div>
    </article>
  );
}
