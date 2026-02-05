import express from 'express';
import Contact from './contact.model.js';

const router = express.Router();

// Create a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .select('name email subject message createdAt');
    
    res.json(messages);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Failed to get messages' });
  }
});

// Delete a contact message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

export default router;