const config = {
  development: {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/messaging-app',
    jwtSecret: process.env.JWT_SECRET || 'secret_key',
    corsOptions: {
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5179', 'https://project-9c21-abld1jy52-vikash-sharmas-projects-ab292e3a.vercel.app'], // Add Vercel frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS for preflight
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true, // Allow credentials (cookies, authorization headers)
      optionsSuccessStatus: 200 // Some browsers require this for OPTIONS
    }
  },
  production: {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    corsOptions: {
      origin: ['https://project-9c21-abld1jy52-vikash-sharmas-projects-ab292e3a.vercel.app'], // Use Vercel frontend for production
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200
    }
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];