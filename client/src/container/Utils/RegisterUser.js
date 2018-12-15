import axios from 'axios';
const qs = require('qs');

export default function registerUser(firstname, lastname = null, email, password) {
  let userData = {
    email: email,
    password: password,
    name: {
      firstname: firstname,
      lastname: lastname
    }
  };

  console.log(qs.stringify(userData));
  return axios.post('/api/auth/register', qs.stringify(userData));
}