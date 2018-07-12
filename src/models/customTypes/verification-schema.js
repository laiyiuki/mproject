const mongoose = require('mongoose');
const { Schema } = mongoose;

const VerificationSchema = new Schema(
  {
    type: { type: String, require: true },
    file: { type: String },
    approvedBy: { type: Schema.Types.ObjectId },
    remark: { type: String },
    status: { type: String, require: true, default: 'pending' }, // pending, approved, rejected
  },
  {
    timestamps: true,
  },
);

module.exports = VerificationSchema;
