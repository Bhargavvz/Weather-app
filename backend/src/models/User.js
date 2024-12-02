import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  preferences: {
    temperatureUnit: {
      type: String,
      enum: ['C', 'F'],
      default: 'C'
    },
    speedUnit: {
      type: String,
      enum: ['kph', 'mph'],
      default: 'kph'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    locations: [{
      name: String,
      lat: Number,
      lon: Number,
      isDefault: Boolean
    }]
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
