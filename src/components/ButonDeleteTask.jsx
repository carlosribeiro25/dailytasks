import { api } from  '../lib/Api'

export const deleleTask = async (id) => {
    await api.delete(`/tasks/${id}`)
}


