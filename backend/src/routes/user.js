import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile and preferences
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { temperatureUnit, speedUnit, theme } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences = {
      ...user.preferences,
      ...(temperatureUnit && { temperatureUnit }),
      ...(speedUnit && { speedUnit }),
      ...(theme && { theme })
    };

    await user.save();
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add location to favorites
router.post('/locations', auth, async (req, res) => {
  try {
    const { name, lat, lon } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if location already exists
    const locationExists = user.preferences.locations.some(
      loc => loc.name === name
    );

    if (locationExists) {
      return res.status(400).json({ message: 'Location already exists' });
    }

    // Add new location
    user.preferences.locations.push({
      name,
      lat,
      lon,
      isDefault: user.preferences.locations.length === 0
    });

    await user.save();
    res.json(user.preferences.locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove location from favorites
router.delete('/locations/:name', auth, async (req, res) => {
  try {
    const { name } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences.locations = user.preferences.locations.filter(
      loc => loc.name !== name
    );

    await user.save();
    res.json(user.preferences.locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Set default location
router.put('/locations/:name/default', auth, async (req, res) => {
  try {
    const { name } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences.locations = user.preferences.locations.map(loc => ({
      ...loc,
      isDefault: loc.name === name
    }));

    await user.save();
    res.json(user.preferences.locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
