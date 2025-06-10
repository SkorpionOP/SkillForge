// skillForge-backend/middleware/authMiddleware.js
const admin = require('firebase-admin');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 401 Unauthorized: No token provided or token format is incorrect
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const idToken = authHeader.split(' ')[1]; // Extract the token part after "Bearer "

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Attach the decoded token to the request object, so subsequent handlers can access user data
    req.user = decodedToken;
    // Call next() to pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    if (error.code === 'auth/id-token-expired') {
      // 401 Unauthorized: Token has expired
      return res.status(401).json({ message: 'Token expired. Please re-authenticate.' });
    }
    // 401 Unauthorized: Token is invalid for other reasons
    return res.status(401).json({ message: 'Token is not valid, authorization denied' });
  }
};

// Export the middleware function so it can be imported and used in other files
module.exports = authMiddleware;