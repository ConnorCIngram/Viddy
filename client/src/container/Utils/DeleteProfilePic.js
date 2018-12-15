import axios from 'axios';

export default function deleteProfilePic(token) {
  const config = {
    headers: {
      'x-access-token': token
    }
  }
  return axios.delete('/api/images', config);
}