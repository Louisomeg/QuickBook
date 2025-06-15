const { Suggestion } = require('../models');

exports.createSuggestion = async (req, res) => {
  const userId = req.user.id;
  const { category, title, description } = req.body;
  const attachments = req.files ? req.files.map((f) => f.path) : [];
  try {
    const suggestion = await Suggestion.create({
      userId,
      category,
      title,
      description,
      attachments,
    });
    res.status(201).json(suggestion);
    // Emit real-time notification for admins about new suggestion
    const io = req.app.get('io');
    io.to('admin').emit('newSuggestion', suggestion);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserSuggestions = async (req, res) => {
  const userId = req.user.id;
  try {
    const suggestions = await Suggestion.findAll({ where: { userId } });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getSuggestionById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const suggestion = await Suggestion.findOne({ where: { id, userId } });
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};