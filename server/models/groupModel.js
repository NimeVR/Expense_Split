const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  hasPaid: { type: Boolean, default: false },
});

const groupSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  amountPerMember: { type: Number, required: true },
  members: [memberSchema],
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;