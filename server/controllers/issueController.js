import Issue from '../models/Issue.js';
import { buildStatusEvent, computeOverdueMeta, getDepartmentForCategory, getSlaDeadline } from '../utils/issueHelpers.js';
import { inferIssueMeta } from '../services/geminiService.js';
import { sendIssueCreatedEmails, sendIssueStatusEmails } from '../services/mailService.js';

const decorateIssue = (issueDoc) => {
  const issue = issueDoc.toObject ? issueDoc.toObject() : issueDoc;
  const overdue = computeOverdueMeta(issue);
  return { ...issue, ...overdue };
};

export const getIssues = async (req, res) => {
  const { status, category, sort = 'latest', ignored } = req.query;
  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;

  let sortObj = { createdAt: -1 };
  if (sort === 'upvotes') sortObj = { upvotes: -1, createdAt: -1 };
  if (sort === 'hot') sortObj = { hotspotWeight: -1, upvotes: -1, createdAt: -1 };

  const issues = await Issue.find(query)
    .populate('createdBy', 'name email avatar')
    .sort(sortObj)
    .lean();

  let results = issues.map(decorateIssue);
  if (ignored === 'true') {
    results = results.filter((issue) => issue.status !== 'resolved' && issue.isOverdue);
  }
  res.json(results);
};

export const getIssueById = async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate('createdBy', 'name email avatar').lean();
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  res.json(decorateIssue(issue));
};

export const createIssue = async (req, res) => {
  const { title, description, image, category, severity, lat, lng, areaName, addressText } = req.body;
  if (!title || !description || !image || lat === undefined || lng === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let finalCategory = category;
  let finalSeverity = severity;
  if (!finalCategory || !finalSeverity) {
    const inferred = await inferIssueMeta(`${title}. ${description}`);
    finalCategory = finalCategory || inferred.category;
    finalSeverity = finalSeverity || inferred.severity;
  }

  const department = getDepartmentForCategory(finalCategory);
  const createdAt = new Date();
  const slaDeadline = getSlaDeadline({ category: finalCategory, severity: finalSeverity, createdAt });

  const issue = await Issue.create({
    title,
    description,
    image,
    category: finalCategory || 'other',
    severity: finalSeverity || 'medium',
    department,
    areaName: areaName || '',
    addressText: addressText || '',
    location: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
    createdBy: req.user._id,
    reporterName: req.user.name,
    hotspotWeight: 1,
    slaDeadline,
    statusHistory: [buildStatusEvent({ from: 'none', to: 'pending', actorName: req.user.name, note: 'Issue reported and sent for review' })]
  });

  const populated = await Issue.findById(issue._id).populate('createdBy', 'name email avatar');
  const decorated = decorateIssue(populated);
  sendIssueCreatedEmails(decorated, req.user).catch((error) => console.error('Issue created email failed:', error.message));
  res.status(201).json(decorated);
};

export const deleteIssue = async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  const canDelete = req.user.role === 'admin' || issue.createdBy.toString() === req.user._id.toString();
  if (!canDelete) return res.status(403).json({ message: 'Not allowed to delete this issue' });
  await issue.deleteOne();
  res.json({ message: 'Issue deleted' });
};

export const updateIssueStatus = async (req, res) => {
  const { status, resolvedImage, note } = req.body;
  const allowedStatuses = ['pending', 'assigned', 'in-progress', 'resolved'];
  if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const issue = await Issue.findById(req.params.id).populate('createdBy', 'name email avatar');
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  if (status === 'resolved' && !resolvedImage && !issue.resolvedImage) {
    return res.status(400).json({ message: 'Resolved issue proof image is required' });
  }

  const prevStatus = issue.status;
  issue.status = status;
  if (resolvedImage) issue.resolvedImage = resolvedImage;
  if (status === 'resolved') {
    issue.resolvedAt = new Date();
    issue.resolutionTimeHours = Math.max(1, Math.floor((issue.resolvedAt - issue.createdAt) / (1000 * 60 * 60)));
    issue.isOverdue = false;
    issue.overdueByHours = 0;
  } else {
    const overdueMeta = computeOverdueMeta(issue);
    issue.isOverdue = overdueMeta.isOverdue;
    issue.overdueByHours = overdueMeta.overdueByHours;
  }
  issue.statusHistory.push(
    buildStatusEvent({
      from: prevStatus,
      to: status,
      actorName: req.user.name,
      note: note || `Issue moved from ${prevStatus} to ${status}`
    })
  );
  await issue.save();

  const refreshed = await Issue.findById(issue._id).populate('createdBy', 'name email avatar');
  const decorated = decorateIssue(refreshed);
  sendIssueStatusEmails(decorated, req.user.name).catch((error) => console.error('Issue status email failed:', error.message));
  res.json(decorated);
};

export const upvoteIssue = async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  const already = issue.upvotedBy.some((id) => id.toString() === req.user._id.toString());
  if (already) {
    issue.upvotedBy = issue.upvotedBy.filter((id) => id.toString() !== req.user._id.toString());
    issue.upvotes = Math.max(0, issue.upvotes - 1);
  } else {
    issue.upvotedBy.push(req.user._id);
    issue.upvotes += 1;
  }
  issue.hotspotWeight = Math.max(1, issue.upvotes + 1);
  await issue.save();
  res.json({ upvotes: issue.upvotes, hasUpvoted: !already });
};

export const verifyIssue = async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  const already = issue.verifiedBy.some((id) => id.toString() === req.user._id.toString());
  if (already) {
    issue.verifiedBy = issue.verifiedBy.filter((id) => id.toString() !== req.user._id.toString());
    issue.verifiedFixCount = Math.max(0, issue.verifiedFixCount - 1);
  } else {
    issue.verifiedBy.push(req.user._id);
    issue.verifiedFixCount += 1;
  }
  await issue.save();
  res.json({ verifiedFixCount: issue.verifiedFixCount, hasVerified: !already });
};

export const getNearbyIssues = async (req, res) => {
  const { lat, lng, radius = 1000 } = req.query;
  const issues = await Issue.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radius)
      }
    }
  })
    .limit(20)
    .populate('createdBy', 'name email avatar')
    .lean();

  res.json(issues.map(decorateIssue));
};
