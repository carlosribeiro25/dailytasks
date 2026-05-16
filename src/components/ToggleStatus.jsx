import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/Api';

const toggleStatus = async ({ id, currentStatus }) => {
    const next = currentStatus === 'concluido' ? 'pendente' : 'concluido';
    const { data } = await api.patch(`/tasks/${id}/status`, { status: next });
    return data;
};

export function ToggleStatusButton({ task }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: toggleStatus,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
        onError: () => alert('Erro ao atualizar status'),
    });

    const isDone = task.status === 'concluido';

    return (
        <button
            onClick={() => mutation.mutate({ id: task.id, currentStatus: task.status })}
            disabled={mutation.isPending}
        >
            {isDone ? '↩ Desmarcar' : '✔ Concluir'}
        </button>
    );
}
