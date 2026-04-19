import Issue from '../models/Issue.js';

export const getMyProfile = async (req, res) => {
  const issues = await Issue.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      initial: req.user.name?.charAt(0)?.toUpperCase() || 'U',
      role: req.user.role
    },
    issues
  });
};
