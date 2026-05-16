import { api } from "../lib/Api";

export async function getTaskById(id) {
  const response = await api.get(`/tasks/${id}`);

  return response.data;
}

export async function updateTask(id, data) {
  const response = await api.patch(`/tasks/${id}`, data);

  return response.data;
}