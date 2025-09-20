// api/routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createGroup, 
  getMyGroups, 
  toggleMemberPaidStatus, 
  deleteGroup // <-- Import the new function
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

// Route for creating a group and getting all of a user's groups
router.route('/').post(protect, createGroup).get(protect, getMyGroups);

// Route for toggling a member's paid status
router.route('/:id/members/:memberIndex/toggle-paid').put(protect, toggleMemberPaidStatus);

// --- NEW ROUTE for deleting a specific group ---
router.route('/:id').delete(protect, deleteGroup);

module.exports = router;