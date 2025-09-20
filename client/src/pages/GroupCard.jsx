// src/pages/GroupCard.jsx
import React from 'react';
import './GroupCard.css';

// We now need to accept an 'onDelete' function as a prop
function GroupCard({ group, onViewDetails, onDelete }) {
  const paidCount = group.members.filter(member => member.hasPaid === true).length;
  const totalMembers = group.members.length;
  const paidPercentage = totalMembers > 0 ? (paidCount / totalMembers) * 100 : 0;
  const isAllPaid = paidCount === totalMembers;

  // Function to ask for confirmation before deleting
  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`)) {
      onDelete(group._id);
    }
  };

  return (
    <div className="group-card">
      <div className="card-header">
        <h3>{group.name}</h3>
        {isAllPaid && <span className="paid-tag">All Paid</span>}
      </div>
      
      <p className="group-description">{group.description}</p>
      
      <div className="members-section">
        <h4>Members ({totalMembers})</h4>
        <ul>
          {group.members.map((member, index) => (
            <li key={index}>
              <span>{member.name}</span>
              <span className="amount-due">${group.amountPerMember.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="progress-section">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${paidPercentage}%` }}></div>
        </div>
        <span className="progress-text">{paidCount} / {totalMembers} Paid</span>
      </div>
      
      {/* --- NEW JSX FOR THE BUTTONS --- */}
      <div className="card-actions">
        <button className="delete-button" onClick={handleDeleteClick}>
          Delete Group
        </button>
        <button className="view-details-button" onClick={() => onViewDetails(group._id)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default GroupCard;