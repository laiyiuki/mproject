const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    level: { type: Number, required: true, default: 1000 },
    image: { type: String },
    video: { type: String },
    description: { type: String },
    approvedBy: { type: Schema.Types.ObjectId },
    remark: { type: String },
    status: { type: String, required: true, default: 'new' }, // pending, approved, rejected
  },
  {
    timestamps: true,
  },
);

module.exports = CourseSchema;
