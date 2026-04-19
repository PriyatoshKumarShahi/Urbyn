import { useEffect, useState } from 'react';
import api from '../api/client';
import IssueCard from '../components/IssueCard';

export default function ProfilePage() {
  const [data, setData] = useState({ user: null, issues: [] });

  const load = async () => {
    const res = await api.get('/users/me');
    setData(res.data);
  };

  useEffect(() => { load(); }, []);

  if (!data.user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="space-y-5">
      <div className="brutal-card bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-ink bg-butter text-4xl font-black shadow-brutalSm">{data.user.initial}</div>
          <div>
            <h2 className="text-4xl font-black">{data.user.name}</h2>
            <p className="text-slate-600">{data.user.email}</p>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{data.user.role}</p>
          </div>
        </div>
      </div>
      <section className="space-y-4">
        <h3 className="text-3xl font-black">My reported issues</h3>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.issues.map((issue) => <IssueCard key={issue._id} issue={issue} onRefresh={load} />)}
        </div>
      </section>
    </div>
  );
}
