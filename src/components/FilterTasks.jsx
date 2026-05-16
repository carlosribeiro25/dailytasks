import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/Api';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Toolbar from '@mui/material/Toolbar';
import ResponsiveAppBar from './NavBar';

const priorityConfig = {
    alta:  { label: 'Alta',  color: 'error' },
    media: { label: 'Média', color: 'warning' },
    baixa: { label: 'Baixa', color: 'success' },
};

const statusConfig = {
    pendente:     { label: 'Pendente',     color: 'warning' },
    em_andamento: { label: 'Em andamento', color: 'info' },
    concluido:    { label: 'Concluído',    color: 'success' },
};

const emptyForm = { category: '', priority: '', status: '', date: '' };

const fetchFilteredTasks = async (filters) => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.priority) params.priority = filters.priority;
    if (filters.status)   params.status   = filters.status;
    if (filters.date) {
        const [year, month, day] = filters.date.split('-');
        params.date = `${day}/${month}/${year}`;
    }
    const { data } = await api.get('/tasks/filter', { params });
    return data.tasks;
};

export default function FilterTasks() {

    const [form, setForm]       = useState(emptyForm);
    const [applied, setApplied] = useState(emptyForm);

    const hasFilters = applied.category || applied.priority || applied.status || applied.date;

    const { data: tasks, isLoading, isError } = useQuery({
        queryKey: ['tasks', 'filter', applied],
        queryFn: () => fetchFilteredTasks(applied),
        enabled: !!hasFilters,
        retry: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setApplied({ ...form });
    };

    const handleClear = () => {
        setForm(emptyForm);
        setApplied(emptyForm);
    };

    return (

        <>
        <ResponsiveAppBar/>
        <Toolbar />

        <Box className="py-6 px-4 sm:px-6 md:py-10">
            <Container maxWidth="lg">

                <Paper elevation={2} className="rounded-2xl overflow-hidden mb-6">

                   
                    <Box className="bg-blue-600 px-6 py-4 flex items-center gap-3">
                        <FilterListIcon className="text-white" />
                        <Typography variant="h6" component="h2" className="font-bold text-white">
                            Filtrar Tarefas
                        </Typography>
                    </Box>

                    
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 p-5 sm:p-6"
                    >
                        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="cat-label">Categoria</InputLabel>
                                <Select
                                    labelId="cat-label"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    label="Categoria"
                                >
                                    <MenuItem value=""><em>Todas</em></MenuItem>
                                    <MenuItem value="estudo">Estudo</MenuItem>
                                    <MenuItem value="saude">Saúde</MenuItem>
                                    <MenuItem value="trabalho">Trabalho</MenuItem>
                                    <MenuItem value="pessoal">Pessoal</MenuItem>
                                    <MenuItem value="outro">Outro</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="pri-label">Prioridade</InputLabel>
                                <Select
                                    labelId="pri-label"
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    label="Prioridade"
                                >
                                    <MenuItem value=""><em>Todas</em></MenuItem>
                                    <MenuItem value="alta">🔴 Alta</MenuItem>
                                    <MenuItem value="media">🟡 Média</MenuItem>
                                    <MenuItem value="baixa">🟢 Baixa</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="sta-label">Status</InputLabel>
                                <Select
                                    labelId="sta-label"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    label="Status"
                                >
                                    <MenuItem value=""><em>Todos</em></MenuItem>
                                    <MenuItem value="pendente">⏳ Pendente</MenuItem>
                                    <MenuItem value="em_andamento">🔄 Em andamento</MenuItem>
                                    <MenuItem value="concluido">✅ Concluído</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Data"
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                variant="outlined"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Box>

                        <Box className="flex flex-col sm:flex-row gap-3">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon />}
                                className="sm:flex-1"
                                fullWidth
                            >
                                Filtrar
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                color="inherit"
                                startIcon={<ClearIcon />}
                                onClick={handleClear}
                                className="sm:flex-1"
                                fullWidth
                            >
                                Limpar filtros
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {!hasFilters && (
                    <Alert severity="info">Selecione ao menos um filtro para buscar tarefas.</Alert>
                )}

                {isLoading && hasFilters && (
                    <Box className="flex justify-center py-12">
                        <CircularProgress />
                    </Box>
                )}

                {isError && (
                    <Alert severity="warning">Nenhuma tarefa encontrada com os filtros aplicados.</Alert>
                )}

                {tasks && tasks.length > 0 && (
                    <>
                        <Typography variant="body2" className="text-gray-500 mb-3">
                            {tasks.length} tarefa(s) encontrada(s)
                        </Typography>

                        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tasks.map(task => {
                                const priority = priorityConfig[task.priority] ?? { label: task.priority, color: 'default' };
                                const status   = statusConfig[task.status]     ?? { label: task.status,   color: 'default' };

                                return (
                                    <Card key={task.id} elevation={2} className="rounded-xl flex flex-col hover:shadow-lg transition-shadow duration-200">
                                        <CardContent className="flex flex-col gap-2 flex-1">

                                            {/* Chips */}
                                            <Box className="flex flex-wrap gap-1">
                                                <Chip label={status.label}   color={status.color}   size="small" />
                                                <Chip label={priority.label} color={priority.color} size="small" variant="outlined" />
                                                {task.category && (
                                                    <Chip label={task.category} size="small" variant="outlined" />
                                                )}
                                            </Box>

                                            {/* Title */}
                                            <Typography variant="h6" component="h3" className="font-semibold text-gray-800 line-clamp-2">
                                                {task.title}
                                            </Typography>

                                            {task.description && (
                                                <Typography variant="body2" className="text-gray-500 line-clamp-2">
                                                    {task.description}
                                                </Typography>
                                            )}

                                            <Divider />

                                            <Box className="flex flex-wrap gap-3 text-gray-500">
                                                {task.date && (
                                                    <Box className="flex items-center gap-1">
                                                        <CalendarTodayIcon fontSize="large" />
                                                        <Typography variant="caption">{task.date}</Typography>
                                                    </Box>
                                                )}
                                                {task.time && (
                                                    <Box className="flex items-center gap-1">
                                                        <AccessTimeIcon fontSize="inherit" />
                                                        <Typography variant="caption">{task.time}</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </>
                )}

                {tasks && tasks.length === 0 && (
                    <Alert severity="info">Nenhuma tarefa encontrada com esses filtros.</Alert>
                )}

            </Container>
        </Box>
        
        </>
        
    );
}
