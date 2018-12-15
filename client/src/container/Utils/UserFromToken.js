import axios from 'axios';

export default function UserFromToken(token) {
  return axios.get('/api/auth', {headers: {'x-access-token': token}});
}