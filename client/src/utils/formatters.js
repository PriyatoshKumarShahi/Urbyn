export const formatDate = (value) =>
  new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

export const timeLeftLabel = (deadline, isOverdue, overdueByHours = 0) => {
  if (!deadline) return 'No SLA';
  if (isOverdue) {
    const days = Math.max(1, Math.floor(overdueByHours / 24));
    return `Overdue by ${days}d`;
  }
  const diff = new Date(deadline).getTime() - Date.now();
  const hours = Math.max(1, Math.floor(diff / (1000 * 60 * 60)));
  if (hours >= 24) return `${Math.floor(hours / 24)}d left`;
  return `${hours}h left`;
};

export const severityColor = (severity) => ({ low: 'bg-green-400', medium: 'bg-yellow-300', high: 'bg-red-400' }[severity] || 'bg-gray-300');
export const statusColor = (status) => ({ pending: 'bg-orange-200', assigned: 'bg-skybubble', 'in-progress': 'bg-butter', resolved: 'bg-mint' }[status] || 'bg-gray-200');
