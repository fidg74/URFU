import _axios from 'axios'
import { getCookie, errorMessage } from '@/utils' 

const token = (window.lkp && window.lkp.jwt_cookie) ? getCookie(window.lkp.jwt_cookie) : getCookie('key')
const axios = _axios.create({})
axios.defaults.headers.common['Authorization'] = 'JWT ' + token

axios.interceptors.response.use(
  response => {
  return response
}, error => {
  if (!_axios.isCancel(error)) {
    errorMessage(error)
  }
  return Promise.reject(error)
})

export default axios
