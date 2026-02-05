const Contact = require('./contact.model');

const createMessage = async (req, res) => {
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
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .select('name email subject message createdAt');
    
    res.json(messages);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

const deleteMessage = async (req, res) => {
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
};

module.exports = {
  createMessage,
  getAllMessages,
  deleteMessage
};