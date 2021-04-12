import * as api from '@/utils/axiosUntil'
export async function getTitle (params) {
  return api.post('/Title/getTitle', params)
}
export async function delTitle (params) {
  return api.post('/Title/delTitle', params)
}
export async function saveTitle (params) {
  return api.post('/Title/setTitle', params)
}
