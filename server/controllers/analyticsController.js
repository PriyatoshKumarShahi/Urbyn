import Issue from '../models/Issue.js';
import { computeOverdueMeta } from '../utils/issueHelpers.js';

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

  const hotspotMap = {};
  for (const issue of issues) {
    const key = issue.areaName || issue.addressText || 'Unknown area';
    if (!hotspotMap[key]) {
      hotspotMap[key] = {
        areaName: key,
        hotspotWeight: 0,
        issueCount: 0,
        titles: [],
        categories: new Set(),
        createdBy: new Set(),
        center: { lng: 0, lat: 0 }
      };
    }
    hotspotMap[key].issueCount += 1;
    hotspotMap[key].hotspotWeight += 1;
    hotspotMap[key].titles.push(issue.title);
    hotspotMap[key].categories.add(issue.category);
    hotspotMap[key].createdBy.add(issue.reporterName);
    hotspotMap[key].center.lng += issue.location?.coordinates?.[0] || 0;
    hotspotMap[key].center.lat += issue.location?.coordinates?.[1] || 0;
  }

  const hotspots = Object.values(hotspotMap)
    .map((item, index) => ({
      _id: `${item.areaName}-${index}`,
      title: item.titles[0],
      areaName: item.areaName,
      category: Array.from(item.categories).slice(0, 2).join(', '),
      hotspotWeight: item.hotspotWeight,
      issueCount: item.issueCount,
      previewTitles: item.titles.slice(0, 3),
      createdBy: Array.from(item.createdBy).slice(0, 2).join(', '),
      location: {
        type: 'Point',
        coordinates: [item.center.lng / item.issueCount, item.center.lat / item.issueCount]
      }
    }))
    .sort((a, b) => b.issueCount - a.issueCount)
    .slice(0, 8);

  const ignored = issues
    .map((issue) => ({ ...issue, ...computeOverdueMeta(issue) }))
    .filter((issue) => issue.status !== 'resolved' && issue.isOverdue)
    .map((issue) => ({
      _id: issue._id,
      title: issue.title,
      areaName: issue.areaName,
      overdueByHours: issue.overdueByHours,
      department: issue.department,
      reporterName: issue.reporterName,
      status: issue.status,
      slaDeadline: issue.slaDeadline
    }))
    .sort((a, b) => b.overdueByHours - a.overdueByHours)
    .slice(0, 10);

  const deptMap = {};
  for (const issue of issues) {
    const key = issue.department;
    if (!deptMap[key]) {
      deptMap[key] = {
        department: key,
        total: 0,
        resolved: 0,
        overdueOpen: 0,
        withinSla: 0,
        resolutionSamples: []
      };
    }
    const overdue = computeOverdueMeta(issue);
    deptMap[key].total += 1;
    if (overdue.isOverdue && issue.status !== 'resolved') deptMap[key].overdueOpen += 1;
    if (issue.status === 'resolved') {
      deptMap[key].resolved += 1;
      if (issue.resolutionTimeHours) deptMap[key].resolutionSamples.push(issue.resolutionTimeHours);
      if (issue.slaDeadline && issue.resolvedAt && new Date(issue.resolvedAt) <= new Date(issue.slaDeadline)) {
        deptMap[key].withinSla += 1;
      }
    }
  }

  const departmentPerformance = Object.values(deptMap)
    .map((item) => {
      const avgResolutionTime = item.resolutionSamples.length
        ? Math.round(item.resolutionSamples.reduce((a, b) => a + b, 0) / item.resolutionSamples.length)
        : 0;
      const resolutionRate = item.total ? Math.round((item.resolved / item.total) * 100) : 0;
      const withinSlaRate = item.resolved ? Math.round((item.withinSla / item.resolved) * 100) : 0;
      const speedScore = avgResolutionTime ? Math.max(0, 100 - Math.min(100, avgResolutionTime)) : 50;
      const overduePenalty = Math.min(35, item.overdueOpen * 6);
      const score = Math.max(0, Math.round(resolutionRate * 0.35 + withinSlaRate * 0.45 + speedScore * 0.2 - overduePenalty));
      return {
        department: item.department,
        total: item.total,
        resolved: item.resolved,
        resolutionRate,
        withinSlaRate,
        avgResolutionTime,
        overdueOpen: item.overdueOpen,
        score
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  res.json({ byStatus, byCategory, hotspots, ignored, departmentPerformance });
};
