import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const initialState = { title: '', description: '', category: '', severity: '', image: '', lat: '', lng: '', areaName: '', addressText: '' };

export default function ReportForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async ({ coords }) => {
        const lat = coords.latitude.toFixed(6);
        const lng = coords.longitude.toFixed(6);
        setForm((prev) => ({ ...prev, lat, lng }));
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            areaName: data.address?.city || data.address?.town || data.address?.suburb || 'Detected area',
            addressText: data.display_name || ''
          }));
        } catch {
          // ignore
        }
      },
      () => {}
    );
  }, []);

  const canSubmit = useMemo(() => Boolean(form.title && form.description && (form.image || file) && form.lat && form.lng), [form, file]);

  const uploadToCloudinary = async () => {
    if (!file) return form.image;
    const data = new FormData();
    data.append('image', file);
    const response = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data.url;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Login required to report an issue');
      navigate('/login');
      return;
    }
    if (!canSubmit) return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary();
      await api.post('/issues', { ...form, image: imageUrl });
      toast.success('Issue reported successfully');
      setForm(initialState);
      setFile(null);
      onCreated?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="brutal-card space-y-4 bg-[#FFF8FE] p-5">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border-[3px] border-ink bg-blush px-3 py-1 text-sm font-black">Cute Neubrutalism</span>
        <span className="rounded-full border-[3px] border-ink bg-butter px-3 py-1 text-sm font-black">Cloudinary Uploads</span>
        <span className="rounded-full border-[3px] border-ink bg-skybubble px-3 py-1 text-sm font-black">Gemini Ready</span>
      </div>
      <div>
        <h2 className="text-5xl font-black leading-none">Report a city issue.<br />Push it to action.</h2>
        <p className="mt-3 max-w-2xl text-lg text-slate-700">Login is required before reporting. Urbyn captures location, area name, department routing, heat significance, and SLA instantly.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="input-brutal" placeholder="Issue title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        <input className="input-brutal" placeholder="Detected area name" value={form.areaName} onChange={(e) => setForm((p) => ({ ...p, areaName: e.target.value }))} />
      </div>
      <textarea rows="5" className="input-brutal w-full" placeholder="Describe the problem" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <select className="input-brutal" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
          <option value="">AI / Auto category</option>
          <option value="pothole">Pothole</option>
          <option value="garbage">Garbage</option>
          <option value="streetlight">Streetlight</option>
          <option value="water">Water</option>
          <option value="drainage">Drainage</option>
          <option value="other">Other</option>
        </select>
        <select className="input-brutal" value={form.severity} onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))}>
          <option value="">AI / Auto severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input className="input-brutal" placeholder="Latitude" value={form.lat} onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))} />
        <input className="input-brutal" placeholder="Longitude" value={form.lng} onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))} />
      </div>
      <input className="input-brutal w-full" placeholder="Detailed address / landmark" value={form.addressText} onChange={(e) => setForm((p) => ({ ...p, addressText: e.target.value }))} />
      <div className="grid gap-3 md:grid-cols-2">
        <input className="input-brutal" placeholder="Image URL (optional if uploading file)" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
        <label className="input-brutal flex cursor-pointer items-center gap-3 font-semibold">
          <ImagePlus /> Upload image
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <span className="ml-auto text-xs text-slate-500">{file?.name || 'No file selected'}</span>
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button disabled={loading} className="brutal-btn flex items-center gap-2 bg-mint px-5 py-3 text-lg disabled:opacity-50">
          <ShieldCheck /> {loading ? 'Submitting...' : 'Report Issue'}
        </button>
        {!user && <button type="button" onClick={() => navigate('/login')} className="brutal-btn bg-white px-5 py-3">Login to report</button>}
      </div>
    </form>
  );
}
