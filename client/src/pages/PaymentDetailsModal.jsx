// src/pages/PaymentDetailsModal.jsx
import React from 'react';
import './PaymentDetailsModal.css';

function PaymentDetailsModal({ group, onClose, onTogglePaidStatus }) {
  if (!group) return null; // Don't render if no group is selected

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content payment-details" onClick={(e) => e.stopPropagation()}>
        <h2>{group.name} - Payment Status</h2>
        <div className="summary">
          <p>Total Amount: <strong>${group.totalAmount.toFixed(2)}</strong></p>
          <p>Amount Per Member: <strong>${group.amountPerMember.toFixed(2)}</strong></p>
        </div>
        <ul className="payment-list">
          {group.members.map((member, index) => (
            <li key={index} className={member.hasPaid ? 'paid' : 'unpaid'}>
              <span className="member-name">{member.name}</span>
              <button 
                className="status-button"
                // --- THIS IS THE CORRECTED LINE ---
                // We use group._id because the data comes from MongoDB
                onClick={() => onTogglePaidStatus(group._id, index)}
              >
                {member.hasPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
              </button>
            </li>
          ))}
        </ul>
        <button className="button-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default PaymentDetailsModal;