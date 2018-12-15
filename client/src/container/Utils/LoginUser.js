import axios from 'axios';

// Calls api to create a valid 
export default function loginUser(email, password) {
  return axios.post('/api/auth', {email: email, password: password});
}