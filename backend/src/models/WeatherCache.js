import mongoose from 'mongoose';

const weatherCacheSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    index: true
  },
  data: {
    type: Object,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 1800 // TTL index: 30 minutes
  }
});

export default mongoose.model('WeatherCache', weatherCacheSchema);
