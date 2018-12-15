import axios from 'axios';
import qs from 'qs';

export default function changePassword(token, password, newPassword) {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-access-token': token
    }
  }
  return axios.put('/api/auth/password', qs.stringify({password: password, newPassword: newPassword}), config);
}