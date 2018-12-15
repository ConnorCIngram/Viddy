import axios from 'axios';
import qs from 'qs';

export default function changeProfileInfo(token, {...changes}) {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-access-token': token
    }
  }
  return axios.put('/api/auth', qs.stringify(changes), config);
    
}