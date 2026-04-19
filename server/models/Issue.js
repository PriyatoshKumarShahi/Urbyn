import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    from: String,
    to: { type: String, required: true },
    actorName: String,
    note: String,
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ['pothole', 'garbage', 'streetlight', 'water', 'drainage', 'other'],
      default: 'other'
    },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'resolved'],
      default: 'pending'
    },
    department: { type: String, required: true },
    areaName: { type: String, default: '' },
    addressText: { type: String, default: '' },
    hotspotWeight: { type: Number, default: 1 },
    upvotes: { type: Number, default: 0 },
    verifiedFixCount: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    verifiedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v) => Array.isArray(v) && v.length === 2,
          message: 'Coordinates must contain [lng, lat]'
        }
      }
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reporterName: { type: String, required: true },
    resolvedImage: { type: String, default: '' },
    slaDeadline: { type: Date },
    isOverdue: { type: Boolean, default: false },
    overdueByHours: { type: Number, default: 0 },
    resolvedAt: Date,
    resolutionTimeHours: Number,
    statusHistory: { type: [statusHistorySchema], default: [] }
  },
  { timestamps: true }
);

issueSchema.index({ location: '2dsphere' });

export default mongoose.model('Issue', issueSchema);
