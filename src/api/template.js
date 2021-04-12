import * as api from '@/utils/axiosUntil'
export async function getList(params) {
  return api.post('/mp/getTemplateList', params || {})
}
export async function setTemplate(params) {
  return api.post('/mp/setTemplate', params)
}
export async function delTemplate(params) {
  return api.post('/mp/delTemplate', params)
}
