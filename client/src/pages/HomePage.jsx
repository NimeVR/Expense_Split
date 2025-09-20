// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import CreateGroupModal from './CreateGroupModal.jsx';
import GroupCard from './GroupCard.jsx';
import PaymentDetailsModal from './PaymentDetailsModal.jsx';

function HomePage({ onLogout }) {
  const [groups, setGroups] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingGroupId, setViewingGroupId] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      // Check if user info exists to prevent errors on logout
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) return;

      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/groups', config);
        setGroups(data);
      } catch (error) {
        console.error('Could not fetch groups', error);
      }
    };
    fetchGroups();
  }, []); // The empty dependency array means this runs once on component mount

  const handleGroupCreate = async (newGroupData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post('/api/groups', newGroupData, config);
      setGroups(prevGroups => [...prevGroups, data]);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not create group');
    }
  };
  
  const handleTogglePaidStatus = async (groupId, memberIndex) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data: updatedGroup } = await axios.put(
        `/api/groups/${groupId}/members/${memberIndex}/toggle-paid`,
        {}, 
        config
      );
      setGroups(prevGroups => 
        prevGroups.map(group => 
          group._id === groupId ? updatedGroup : group
        )
      );
    } catch (error) {
      console.error('Failed to update payment status', error);
      alert('Could not update payment status. Please try again.');
    }
  };
  
  // This is the function for deleting a group that was missing
  const handleDeleteGroup = async (groupId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.delete(`/api/groups/${groupId}`, config);
      // Update the UI by filtering out the deleted group from the state
      setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId));
    } catch (error) {
      console.error('Failed to delete group', error);
      alert('Could not delete group. Please try again.');
    }
  };
  
  const handleViewDetails = (groupId) => setViewingGroupId(groupId);
  const currentlyViewingGroup = groups.find(g => g._id === viewingGroupId);

  return (
    <>
      <div className="home-container">
        <header className="home-header">
          <div className="title-container">
            <video autoPlay loop muted className="header-icon">
              {/* Make sure your video is named Moneycoming.mp4 and is in the /public folder */}
              <source src="/Moneycoming.mp4" type="video/mp4" />
            </video>
            <h1>My Groups</h1>
          </div>
          <div className="header-actions">
            <button className="create-group-button" onClick={() => setIsCreateModalOpen(true)}>
              <span className="plus-sign">+</span> Create Group
            </button>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="groups-list">
          {groups.length === 0 ? (
            <p className="no-groups-message">No groups yet. Create one to get started!</p>
          ) : (
            <div className="groups-grid">
              {groups.map(group => (
                // We now pass the handleDeleteGroup function down to each card
                <GroupCard 
                  key={group._id} 
                  group={group} 
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteGroup} 
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {isCreateModalOpen && (
        <CreateGroupModal 
          onGroupCreate={handleGroupCreate} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      )}

      {currentlyViewingGroup && (
        <PaymentDetailsModal
          group={currentlyViewingGroup}
          onClose={() => setViewingGroupId(null)}
          onTogglePaidStatus={handleTogglePaidStatus}
        />
      )}
    </>
  );
}

export default HomePage;