// src/pages/CreateGroupModal.jsx

import React, { useState } from 'react';
import './CreateGroupModal.css';

function CreateGroupModal({ onGroupCreate, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [members, setMembers] = useState([{ name: '', email: '' }]);

  const handleMemberChange = (index, event) => {
    const newMembers = [...members];
    newMembers[index][event.target.name] = event.target.value;
    setMembers(newMembers);
  };

  const addMemberField = () => {
    if (members.length < 5) {
      setMembers([...members, { name: '', email: '' }]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const amountValue = parseFloat(totalAmount) || 0;
    const amountPerMember = members.length > 0 ? amountValue / members.length : 0;
    const newGroup = {
      id: Date.now(),
      name: groupName,
      description: groupDescription,
      totalAmount: amountValue,
      amountPerMember: amountPerMember,
      members: members.map(member => ({ ...member, hasPaid: false })),
    };
    onGroupCreate(newGroup);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* Header - Stays fixed at the top */}
          <h2>Create New Group</h2>

          {/* Body - This is the part that will scroll */}
          <div className="form-body">
            <div className="form-group">
              <label htmlFor="groupName">Group Name</label>
              <input type="text" id="groupName" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="totalAmount">Total Amount ($)</label>
              <input type="number" id="totalAmount" placeholder="e.g., 100" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="groupDescription">Group Description</label>
              <textarea id="groupDescription" value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Members (Max 5)</label>
              {members.map((member, index) => (
                <div key={index} className="member-input-group">
                  <input type="text" name="name" placeholder={`Member ${index + 1} Name`} value={member.name} onChange={(e) => handleMemberChange(index, e)} required />
                  <input type="email" name="email" placeholder={`Member ${index + 1} Email`} value={member.email} onChange={(e) => handleMemberChange(index, e)} required />
                </div>
              ))}
              {members.length < 5 && (
                <button type="button" className="add-member-button" onClick={addMemberField}>
                  + Add Member
                </button>
              )}
            </div>
          </div>

          {/* Footer/Actions - Stays fixed at the bottom */}
          <div className="modal-actions">
            <button type="button" className="button-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="button-create">Create Group</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;