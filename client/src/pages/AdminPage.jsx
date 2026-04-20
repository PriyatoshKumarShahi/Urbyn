import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import AdminIssueDrawer from '../components/AdminIssueDrawer';
import DepartmentScorePanel from '../components/DepartmentScorePanel';
import IgnoredIssuesPanel from '../components/IgnoredIssuesPanel';

export default function AdminPage() {
  const [issues, setIssues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const load = async () => {
    const [{ data: issueData }, { data: analyticsData }] = await Promise.all([
      api.get('/issues'),
      api.get('/analytics/dashboard')
    ]);
    setIssues(issueData);
    setAnalytics(analyticsData);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      <div className="brutal-card bg-white p-5">
        <h2 className="text-4xl font-black">Super Admin Dashboard</h2>
        <p className="mt-2 text-slate-600">Admin email: priytoshshahi90@gmail.com</p>
      </div>

      {analytics && (
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <DepartmentScorePanel items={analytics.departmentPerformance} />
          <IgnoredIssuesPanel items={analytics.ignored || []} />
        </div>
      )}

      <div className="brutal-card overflow-x-auto bg-white p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b-[3px] border-ink text-xs uppercase tracking-wide text-slate-500">
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Reporter</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3">Card</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id} className="cursor-pointer border-b border-slate-200 hover:bg-slate-50" onClick={() => setSelected(issue)}>
                <td className="p-3"><img src={issue.image} alt={issue.title} className="h-16 w-20 rounded-xl border-[2px] border-ink object-cover" /></td>
                <td className="p-3 font-black">{issue.title}<div className="text-xs text-slate-500">{issue.areaName}</div></td>
                <td className="p-3">{issue.createdBy?.name || issue.reporterName}<div className="text-xs text-slate-500">{issue.createdBy?.email}</div></td>
                <td className="p-3">{issue.department}</td>
                <td className="p-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${issue.isOverdue ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{issue.status}</span>
                </td>
                <td className="p-3"><Link to={`/issues/${issue._id}`} className="font-black underline" onClick={(e) => e.stopPropagation()}>Open card</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminIssueDrawer issue={selected} onClose={() => setSelected(null)} onUpdated={() => { setSelected(null); load(); }} />
    </div>
  );
}
