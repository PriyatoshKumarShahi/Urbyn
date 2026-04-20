import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import Timeline from './Timeline';

export default function AdminIssueDrawer({ issue, onClose, onUpdated }) {
  const [status, setStatus] = useState(issue?.status || 'pending');
  const [note, setNote] = useState('');
  const [resolvedImage, setResolvedImage] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!issue) return null;

  const uploadToCloudinary = async () => {
    if (!file) return resolvedImage;
    const data = new FormData();
    data.append('image', file);
    const response = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data.url;
  };

  const updateStatus = async () => {
    try {
      setSaving(true);
      const proofUrl = status === 'resolved' ? await uploadToCloudinary() : '';
      await api.patch(`/issues/${issue._id}/status`, {
        status,
        note: note || `Admin moved issue to ${status}`,
        resolvedImage: proofUrl || undefined
      });
      toast.success('Status updated');
      onUpdated?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setSaving(false);
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

        <div className="mt-5 rounded-[20px] border-[3px] border-ink bg-[#FFF8FE] p-4 shadow-brutalSm">
          <h4 className="text-xl font-black">Update workflow</h4>
          <div className="mt-3 space-y-3">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-brutal w-full">
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} className="input-brutal w-full" placeholder="Add an admin note for the timeline and the email update" />
            {status === 'resolved' && (
              <div className="grid gap-3">
                <input value={resolvedImage} onChange={(e) => setResolvedImage(e.target.value)} className="input-brutal w-full" placeholder="Resolved image URL (optional if uploading file)" />
                <label className="input-brutal flex cursor-pointer items-center justify-between gap-3 font-semibold">
                  Upload proof of fix image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <span className="text-xs text-slate-500">{file?.name || 'No file selected'}</span>
                </label>
                <p className="text-xs font-semibold text-slate-500">When marking an issue as resolved, proof-of-fix image is required.</p>
              </div>
            )}
            <button onClick={updateStatus} disabled={saving} className="brutal-btn bg-mint px-4 py-3 font-black disabled:opacity-50">{saving ? 'Saving...' : 'Save status update'}</button>
          </div>
        </div>

        {issue.resolvedImage && (
          <div className="mt-6 rounded-[20px] border-[3px] border-ink bg-[#F7FFF7] p-4 shadow-brutalSm">
            <h4 className="text-xl font-black">Current proof of fix</h4>
            <img src={issue.resolvedImage} alt="Resolved issue proof" className="mt-3 h-52 w-full rounded-[18px] border-[3px] border-ink object-cover" />
          </div>
        )}

        <div className="mt-6">
          <h4 className="mb-3 text-xl font-black">Status history</h4>
          <Timeline items={issue.statusHistory || []} deadline={issue.slaDeadline} />
        </div>
      </div>
    </div>
  );
}
