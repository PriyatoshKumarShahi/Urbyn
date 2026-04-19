import Issue from '../models/Issue.js';

export const getDashboardAnalytics = async (_req, res) => {
  const issues = await Issue.find({}).lean();
  const byStatus = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {});

  const byCategory = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {});

  const hotspots = issues
    .map((issue) => ({
      _id: issue._id,
      title: issue.title,
      areaName: issue.areaName,
      category: issue.category,
      severity: issue.severity,
      hotspotWeight: issue.hotspotWeight || 1,
      location: issue.location,
      createdBy: issue.reporterName
    }))
    .sort((a, b) => b.hotspotWeight - a.hotspotWeight)
    .slice(0, 8);

  const ignored = issues
    .filter((issue) => issue.status !== 'resolved' && issue.slaDeadline && new Date(issue.slaDeadline) < new Date())
    .map((issue) => ({
      _id: issue._id,
      title: issue.title,
      areaName: issue.areaName,
      overdueByHours: Math.floor((Date.now() - new Date(issue.slaDeadline).getTime()) / (1000 * 60 * 60)),
      department: issue.department
    }))
    .sort((a, b) => b.overdueByHours - a.overdueByHours)
    .slice(0, 10);

  const deptMap = {};
  for (const issue of issues) {
    const key = issue.department;
    if (!deptMap[key]) deptMap[key] = { department: key, total: 0, resolved: 0, withinSla: 0, avgResolutionTime: 0, resolutionSamples: [] };
    deptMap[key].total += 1;
    if (issue.status === 'resolved') {
      deptMap[key].resolved += 1;
      if (issue.resolutionTimeHours) deptMap[key].resolutionSamples.push(issue.resolutionTimeHours);
      if (issue.slaDeadline && issue.resolvedAt && new Date(issue.resolvedAt) <= new Date(issue.slaDeadline)) {
        deptMap[key].withinSla += 1;
      }
    }
  }

  const departmentPerformance = Object.values(deptMap).map((item) => {
    const avgResolutionTime = item.resolutionSamples.length
      ? Math.round(item.resolutionSamples.reduce((a, b) => a + b, 0) / item.resolutionSamples.length)
      : 0;
    const withinSlaRate = item.resolved ? Math.round((item.withinSla / item.resolved) * 100) : 0;
    const score = Math.round(withinSlaRate * 0.6 + Math.min(100, Math.max(0, 100 - avgResolutionTime)) * 0.4);
    return { department: item.department, total: item.total, resolved: item.resolved, withinSlaRate, avgResolutionTime, score };
  });

  res.json({ byStatus, byCategory, hotspots, ignored, departmentPerformance });
};
