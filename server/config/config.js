

// const config = {
//   development: {
//     port: process.env.PORT || 5002,
//     mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/messaging-app',
//     jwtSecret: process.env.JWT_SECRET || 'secret_key',
//     corsOptions: {
//       origin: ['http://localhost:5173', 'http://localhost:5183'], // Allow both ports
//       methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add PUT and DELETE
//       allowedHeaders: ['Content-Type', 'Authorization']
//     }
//   },
//   production: {
//     port: process.env.PORT || 5002,
//     mongoURI: process.env.MONGO_URI,
//     jwtSecret: process.env.JWT_SECRET,
//     corsOptions: {
//       origin: process.env.CLIENT_URL, // Use environment variable for production
//       methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add PUT and DELETE
//       allowedHeaders: ['Content-Type', 'Authorization']
//     }
//   }
// };

// const env = process.env.NODE_ENV || 'development';
// module.exports = config[env];

const config = {
  development: {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/messaging-app',
    jwtSecret: process.env.JWT_SECRET || 'secret_key',
    corsOptions: {
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5179', 'https://project-9c21.vercel.app', 'https://project-iota-seven-64.vercel.app'], // Add new Vercel frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true // Allow credentials (cookies, authorization headers)
    }
  },
  production: {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    corsOptions: {
      origin: ['https://project-9c21.vercel.app'], // Use new Vercel frontend for production
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];