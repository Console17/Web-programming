import { useState, useEffect } from 'react';
import { contactAPI } from '../api/contact';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, message: null });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await contactAPI.getAllMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (message) => {
    setDeleteModal({ isOpen: true, message });
  };

  const handleDeleteConfirm = async () => {
    try {
      await contactAPI.deleteMessage(deleteModal.message._id);
      setMessages(messages.filter(m => m._id !== deleteModal.message._id));
      setDeleteModal({ isOpen: false, message: null });
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="contact-messages-section">
      <h3>Contact Messages ({messages.length})</h3>
      {messages.length === 0 ? (
        <div className="no-messages">
          <p>No contact messages yet</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message._id} className="message-card">
              <div className="message-header">
                <div className="message-info">
                  <h4>{message.name}</h4>
                  <span className="message-email">{message.email}</span>
                  <span className="message-subject">{message.subject}</span>
                </div>
                <div className="message-actions">
                  <span className="message-date">{formatDate(message.createdAt)}</span>
                  <button 
                    onClick={() => handleDeleteClick(message)}
                    className="btn-danger delete-message-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="message-content">
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, message: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message={`Are you sure you want to delete this message from ${deleteModal.message?.name}?`}
      />
    </div>
  );
};

export default ContactMessages;