import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const colors = ['#fca5a5', '#86efac', '#7dd3fc', '#fde68a', '#f9a8d4', '#c4b5fd'];

export default function ChartsPanel({ analytics }) {
  const statusData = Object.entries(analytics.byStatus || {}).map(([name, value]) => ({ name, value }));
  const categoryData = Object.entries(analytics.byCategory || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="brutal-card bg-white p-4">
        <h3 className="text-xl font-black">Status mix</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {statusData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="brutal-card bg-white p-4">
        <h3 className="text-xl font-black">Category mix</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} label>
                {categoryData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
