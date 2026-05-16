import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Toolbar,
    Typography,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import ResponsiveAppBar from "../components/NavBar";
import { getTaskById } from "../services/GetTaskId";

const priorityConfig = {
    alta:  { label: "Alta",  color: "error" },
    media: { label: "Média", color: "warning" },
    baixa: { label: "Baixa", color: "success" },
};

const statusConfig = {
    pendente:     { label: "Pendente",     color: "warning" },
    em_andamento: { label: "Em andamento", color: "info" },
    concluido:    { label: "Concluído",    color: "success" },
};

export default function PageDetailTask() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadTask() {
            try {
                const data = await getTaskById(id);
                setTask(data);
            } catch (err) {
                console.error("Erro ao buscar task:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        loadTask();
    }, [id]);

    return (
        <>
            <ResponsiveAppBar />
            <Toolbar />

            <Box className="py-6 px-4 sm:px-6 md:py-10">
                <Container maxWidth="md">

                    {loading && (
                        <Box className="flex justify-center py-16">
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error">Erro ao carregar a tarefa.</Alert>
                    )}

                    {!loading && !error && !task && (
                        <Alert severity="warning">Tarefa não encontrada.</Alert>
                    )}

                    {task && (
                        <Paper elevation={3} className="rounded-2xl overflow-hidden">

                            {/* Header azul */}
                            <Box className="bg-blue-600 px-6 py-5 flex items-center gap-3">
                                <AssignmentIcon className="text-white" fontSize="large" />
                                <Typography variant="h5" component="h1" className="font-bold text-white flex-1 line-clamp-2">
                                    {task.title}
                                </Typography>
                            </Box>

                            <Box className="p-5 sm:p-6 flex flex-col gap-5">

                                <Box className="flex flex-wrap gap-2">
                                    {task.status && (() => {
                                        const s = statusConfig[task.status] ?? { label: task.status, color: "default" };
                                        return <Chip label={s.label} color={s.color} />;
                                    })()}
                                    {task.priority && (() => {
                                        const p = priorityConfig[task.priority] ?? { label: task.priority, color: "default" };
                                        return <Chip label={p.label} color={p.color} variant="outlined" />;
                                    })()}
                                    {task.category && (
                                        <Chip label={task.category} variant="outlined" />
                                    )}
                                </Box>

                                <Divider />

                                {task.description && (
                                    <Box>
                                        <Typography variant="overline" className="text-gray-400 font-semibold">
                                            Descrição
                                        </Typography>
                                        <Typography variant="body1" className="text-gray-700 mt-1">
                                            {task.description}
                                        </Typography>
                                    </Box>
                                )}

                                <Divider />

                                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {task.date && (
                                        <Box className="flex items-center gap-2 text-gray-600">
                                            <CalendarTodayIcon fontSize="small" />
                                            <Box>
                                                <Typography variant="overline" className="text-gray-400 font-semibold block leading-none">
                                                    Data
                                                </Typography>
                                                <Typography variant="body2">{task.date}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    {task.time && (
                                        <Box className="flex items-center gap-2 text-gray-600">
                                            <AccessTimeIcon fontSize="small" />
                                            <Box>
                                                <Typography variant="overline" className="text-gray-400 font-semibold block leading-none">
                                                    Hora
                                                </Typography>
                                                <Typography variant="body2">{task.time}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>

                                {task.createdAt && (
                                    <Typography variant="caption" className="text-gray-400">
                                        Criado em: {task.createdAt}
                                    </Typography>
                                )}

                                <Divider />

                                <Box className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={<ArrowBackIcon />}
                                        onClick={() => navigate(-1)}
                                        fullWidth
                                    >
                                        Voltar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => navigate(`/tasks/${id}/update`)}
                                        fullWidth
                                    >
                                        Editar tarefa
                                    </Button>
                                </Box>

                            </Box>
                        </Paper>
                    )}

                </Container>
            </Box>
        </>
    );
}