const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Extract token from the "Authorization" header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);

    // Extract user ID from the decoded token
    const userId = decodedToken.userId;

    // Check if the request contains a valid user ID
    if (req.body.userId && req.body.userId !== userId) {
      // Throw an error if the user ID is invalid
      throw new Error('Invalid user ID');
    } else {
      // Call the next middleware if the user ID is valid
      next();
    }
  } catch (error) {
    // Return an error response if there was an issue with the token or user ID
    res.status(401).json({ error: error.message });
  }
};
