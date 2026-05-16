
import { useState } from 'react';
import { api } from '../../lib/Api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField,
    Typography, Alert, Toolbar
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import SaveIcon from '@mui/icons-material/Save';
import ResponsiveAppBar from '../../components/NavBar';

const createTask = async (task) => {
    const { data } = await api.post('/tasks', task);
    return data;
};

const emptyForm = {
    title: '', description: '', category: '', priority: '', status: 'pendente', date: '', time: '',
};

export default function CreateTask() {

    const queryClient = useQueryClient();
    const [form, setForm] = useState(emptyForm);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const mutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setForm(emptyForm);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
        },
        onError: (error) => {
            const msg = error.response?.data?.message || error.response?.data?.error || 'Ocorreu um erro, preencha todos os campos';
            setErrorMsg(msg);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.category) {
            setErrorMsg('Selecione uma categoria');
            return;
        }
        if (!form.priority) {
            setErrorMsg('Selecione uma prioridade');
            return;
        }
        if (form.description && form.description.length < 4) {
            setErrorMsg('Descrição deve ter pelo menos 4 caracteres ou deixar em branco');
            return;
        }
        setErrorMsg('');

        const [year, month, day] = form.date.split('-');
        const formattedDate = form.date ? `${day}/${month}/${year}` : '';

        mutation.mutate({
            title: form.title,
            description: form.description || undefined,
            category: form.category,
            priority: form.priority,
            status: form.status,
            date: formattedDate,
            time: form.time,
        });
    };

    return (
    <>

    <ResponsiveAppBar/>
    <Toolbar />

    <Box className="py-6 px-4 sm:px-6 md:py-8">
            <Container maxWidth="sm">
                <Paper elevation={4} className="rounded-2xl overflow-x-hidden">

                   
                    <Box className="bg-blue-500 px-6 py-3 flex items-center gap-3">
                        <AddTaskIcon className="text-white" fontSize="large" />
                        <Typography variant="h5" component="h1" className="font-bold text-white">
                            Nova Tarefa
                        </Typography>
                    </Box>

                  
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5 p-7 sm:p-4 md:p-4 sm:m-4"
                    >
                        
                        <TextField
                            label="Título"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Digite o nome da tarefa"
                            required
                            fullWidth
                            variant="outlined"
                        />

                        
                        <TextField
                            label="Descrição (opcional, mínimo 4 caracteres)"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Descrição opcional"
                            multiline
                            rows={2}
                            fullWidth
                            variant="outlined"
                        />

                        
                        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="category-label">Categoria</InputLabel>
                                <Select
                                    labelId="category-label"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    label="Categoria"
                                >
                                    <MenuItem value=""><em>Selecione</em></MenuItem>
                                    <MenuItem value="estudo">Estudo</MenuItem>
                                    <MenuItem value="saude">Saúde</MenuItem>
                                    <MenuItem value="trabalho">Trabalho</MenuItem>
                                    <MenuItem value="pessoal">Pessoal</MenuItem>
                                    <MenuItem value="outro">Outro</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl  fullWidth variant="outlined">
                                <InputLabel id="priority-label">Prioridade</InputLabel>
                                <Select
                                    labelId="priority-label"
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    label="Prioridade"
                                >
                                    <MenuItem value=""><em>Selecione</em></MenuItem>
                                    <MenuItem value="alta">🔴 Alta</MenuItem>
                                    <MenuItem value="media">🟡 Média</MenuItem>
                                    <MenuItem value="baixa">🟢 Baixa</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                    
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                label="Status"
                            >
                                <MenuItem value="pendente">⏳ Pendente</MenuItem>
                                <MenuItem value="em_andamento">🔄 Em andamento</MenuItem>
                                <MenuItem value="concluido">✅ Concluído</MenuItem>
                            </Select>
                        </FormControl>

                    
                        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TextField
                                label="Data Limite"
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                            <TextField
                                label="Hora"
                                name="time"
                                type="time"
                                value={form.time}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Box>

                        {errorMsg && (
                            <Alert severity="error" onClose={() => setErrorMsg('')}>
                                {errorMsg}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" onClose={() => setSuccess(false)}>
                                Tarefa cadastrada com sucesso!
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={mutation.isPending}
                            startIcon={mutation.isPending ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                        >
                            {mutation.isPending ? 'Salvando...' : 'Adicionar Tarefa'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    
    </>
        
    );
}
