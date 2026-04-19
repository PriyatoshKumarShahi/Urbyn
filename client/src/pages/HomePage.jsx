import { useEffect, useState } from 'react';
import api from '../api/client';
import ReportForm from '../components/ReportForm';
import IssueMap from '../components/IssueMap';
import IssueCard from '../components/IssueCard';
import HotspotPanel from '../components/HotspotPanel';
import ChartsPanel from '../components/ChartsPanel';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const { user } = useAuth();

  const loadIssues = async () => {
    const { data } = await api.get('/issues');
    setIssues(data);
  };

  const loadAnalytics = async () => {
    if (!user || user.role !== 'admin') return;
    try {
      const { data } = await api.get('/analytics/dashboard');
      setAnalytics(data);
    } catch {
      setAnalytics({});
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
        <ReportForm onCreated={() => { loadIssues(); loadAnalytics(); }} />
        <div className="space-y-5">
          <div className="brutal-card flex min-h-[250px] items-center justify-center bg-[#F5FDFF] p-5">
            <div className="max-w-md text-center">
              <h3 className="text-5xl font-black">No report should disappear.</h3>
              <p className="mt-4 text-lg text-slate-600">Every issue is public, mapped, and measured by deadlines, hotness, and fix verification.</p>
            </div>
          </div>
          <IssueMap issues={issues} />
        </div>
      </div>

      {user?.role === 'admin' && analytics.hotspots && (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <HotspotPanel hotspots={analytics.hotspots} />
          <ChartsPanel analytics={analytics} />
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black">Live issue feed</h2>
          <div className="text-sm font-semibold text-slate-600">{issues.length} reports</div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {issues.map((issue) => <IssueCard key={issue._id} issue={issue} onRefresh={() => { loadIssues(); loadAnalytics(); }} />)}
        </div>
      </section>
    </div>
  );
}
