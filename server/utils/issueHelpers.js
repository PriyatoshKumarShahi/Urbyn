import { categoryDepartmentMap, slaHoursMap } from './constants.js';

export const getDepartmentForCategory = (category) => categoryDepartmentMap[category] || categoryDepartmentMap.other;

export const getSlaDeadline = ({ category, severity, createdAt = new Date() }) => {
  const hours = slaHoursMap[category]?.[severity] || 48;
  return new Date(new Date(createdAt).getTime() + hours * 60 * 60 * 1000);
};

export const computeOverdueMeta = (issue) => {
  if (!issue.slaDeadline) return { isOverdue: false, overdueByHours: 0 };
  if (issue.status === 'resolved') return { isOverdue: false, overdueByHours: 0 };
  const diffMs = Date.now() - new Date(issue.slaDeadline).getTime();
  const overdueByHours = diffMs > 0 ? Math.floor(diffMs / (1000 * 60 * 60)) : 0;
  return { isOverdue: overdueByHours > 0, overdueByHours };
};

export const buildStatusEvent = ({ from, to, actorName, note }) => ({ from, to, actorName, note, at: new Date() });
