import { post } from 'utils/sdk';

// Function to validate token and obtain session from the server
export const validateTokenAndObtainSession = ({ data, idToken }) => {
  const headers = {
    Authorization: `Bearer ${idToken}`, // Attach token as Bearer token in Authorization header
    'Content-Type': 'application/json',
  };

  // Make POST request to the server to validate the token and initiate a session
  return post('users/init/', data, { headers });
};
