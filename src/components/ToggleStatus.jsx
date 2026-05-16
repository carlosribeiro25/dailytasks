import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/Api';
import { Alert, Snackbar } from '@mui/material';

const toggleStatus = async ({ id, currentStatus }) => {
    const next = currentStatus === 'concluido' ? 'pendente' : 'concluido';
    const { data } = await api.patch(`/tasks/${id}/status`, { status: next });
    return data;
};

export function ToggleStatusButton({ task }) {
    const queryClient = useQueryClient();
    const [errorOpen, setErrorOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: toggleStatus,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
        onError: () => setErrorOpen(true),
    });

    const isDone = task.status === 'concluido';

    return (
        <>
            <button
                onClick={() => mutation.mutate({ id: task.id, currentStatus: task.status })}
                disabled={mutation.isPending}
            >
                {isDone ? '↩ Desmarcar' : '✔ Concluir'}
            </button>

            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={() => setErrorOpen(false)}>
                    Erro ao atualizar status
                </Alert>
            </Snackbar>
        </>
    );
}
