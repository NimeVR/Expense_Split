const Group = require('../models/groupModel');

// @desc    Create a new group
// @route   POST /api/groups
const createGroup = async (req, res) => {
  const { name, description, totalAmount, amountPerMember, members } = req.body;
  
  const group = new Group({
    creator: req.user._id, // from authMiddleware
    name,
    description,
    totalAmount,
    amountPerMember,
    members,
  });

  const createdGroup = await group.save();
  res.status(201).json(createdGroup);
};

// @desc    Get logged in user's groups
// @route   GET /api/groups
const getMyGroups = async (req, res) => {
  const groups = await Group.find({ creator: req.user._id });
  res.json(groups);
};

// @desc    Toggle the 'hasPaid' status of a member in a group
// @route   PUT /api/groups/:id/members/:memberIndex/toggle-paid
const toggleMemberPaidStatus = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (group) {
      if (group.creator.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to edit this group' });
      }

      const memberIndex = parseInt(req.params.memberIndex, 10);
      const member = group.members[memberIndex];

      if (member) {
        member.hasPaid = !member.hasPaid;
        const updatedGroup = await group.save();
        res.json(updatedGroup);
      } else {
        res.status(404).json({ message: 'Member not found' });
      }
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a group
// @route   DELETE /api/groups/:id
//
// --- THIS IS THE NEW FUNCTION THAT HAS BEEN ADDED ---
//
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (group) {
      // Security Check: Ensure the user trying to delete the group is the creator
      if (group.creator.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // In Mongoose v6+, you call deleteOne() on the document instance
      await group.deleteOne(); 
      res.json({ message: 'Group removed successfully' });
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Export all four functions so they can be used in your routes file
module.exports = { 
  createGroup, 
  getMyGroups, 
  toggleMemberPaidStatus,
  deleteGroup // <-- The new deleteGroup function is now exported
};