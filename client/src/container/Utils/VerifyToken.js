import axios from 'axios';

export default function verifyToken(token) {
  return axios.get('/api/auth', {headers: {'x-access-token': token}});
};  