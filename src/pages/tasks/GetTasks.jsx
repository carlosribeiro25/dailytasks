import React from 'react'
import { deleleTask } from '../../components/ButonDeleteTask'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../../lib/Api"
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, Container, Divider, Toolbar, Typography,
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import AssignmentIcon from "@mui/icons-material/Assignment"
import ResponsiveAppBar from '../../components/NavBar'
import { ToggleStatusButton } from '../../components/ToggleStatus'
import AlertDialog from '../../components/Dialog'

const priorityConfig = {
    alta:  { label: "Alta",  color: "error" },
    media: { label: "Média", color: "warning" },
    baixa: { label: "Baixa", color: "success" },
}

const statusConfig = {
    pendente:     { label: "Pendente",     color: "warning" },
    em_andamento: { label: "Em andamento", color: "info" },
    concluido:    { label: "Concluído",    color: "success" },
}

export default function Tasks() {

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [confirmOpen, setConfirmOpen] = React.useState(false)
    const [taskToDelete, setTaskToDelete] = React.useState(null)

    const { data = [], isLoading, error, isError } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await api.get('/tasks')
            return response.data.tasks ?? []
        },
        refetchOnWindowFocus: false
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => deleleTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
    })

    const handleDelete = (id) => {
        setTaskToDelete(id)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = () => {
        deleteMutation.mutate(taskToDelete, {
            onSuccess: () => setConfirmOpen(false)
        })
    }

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center py-20">
                <CircularProgress size={48} />
            </Box>
        )
    }

    if (isError) {
        return (
            <Box className="flex items-center justify-center px-4 py-10">
                <Alert severity="error" className="m-auto xs:w-8">
                    Erro ao carregar tarefas: {error.message}
                </Alert>
            </Box>
        )
    }

    return (
        <>

        
        <ResponsiveAppBar/>
        <Toolbar />

        <Box className="py-6 px-4 sm:px-6 md:py-10">
            <Container maxWidth="lg">

                <Box className="flex items-center gap-3 mb-8">
                    <AssignmentIcon className="text-blue-600" fontSize="large" />
                    <Typography variant="h5" component="h1" className="font-bold text-amber-50">
                        Minhas Tarefas
                    </Typography>
                    <Chip
                        label={data.length}
                        color="primary"
                        size="small"
                        className="ml-auto"
                    />
                </Box>

                {data.length === 0 && (
                    <Alert severity="info">Nenhuma tarefa encontrada.</Alert>
                )}

                
                <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.map((task) => {
                        const priority = priorityConfig[task.priority] ?? { label: task.priority, color: "default" }
                        const status   = statusConfig[task.status]     ?? { label: task.status,   color: "default" }

                        return (
                            <Card
                                key={task.id}
                                elevation={2}
                                className="rounded-xl flex flex-col hover:shadow-lg transition-shadow duration-200 w-full h-full"
                            >
                                 
                                <CardContent className="flex flex-col gap-2 flex-1">
                                    <Box className="flex flex-wrap gap-2 mb-1">
                                        <Chip label={status.label}   color={status.color}   size="small" />
                                        <Chip label={priority.label} color={priority.color} size="small" variant="outlined" />
                                        {task.category && (
                                            <Chip label={task.category} size="small" variant="outlined" />
                                        )}
                                        
                                    </Box>

                                    
                                    <Typography variant="h6" component="h2" className="font-semibold text-gray-800 leading-tight line-clamp-2">
                                        {task.title}
                                    </Typography>

                                    {task.description && (
                                        <Typography variant="body2" className="text-gray-500 line-clamp-2">
                                            {task.description}
                                        </Typography>
                                    )}

                                    <Divider className="my-1" />

                                    <Box className="flex flex-wrap gap-3 text-gray-500">
                                        {task.date && (
                                            <Box className="flex items-center gap-1">
                                                <CalendarTodayIcon fontSize="inherit" />
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

                                <CardActions className="px-4 pb-4 pt-0 flex gap-1 ">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => navigate(`/tasks/${task.id}`)}
                                    >
                                        Detalhes
                                    </Button>
                                    <Button
                                        size="small"
                                        
                                        variant="contained"
                                        color="success"
                                        startIcon={<EditIcon />}
                                        onClick={() => navigate(`/tasks/${task.id}/update`)}
                                    >
                                        Editar
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDelete(task.id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        Deletar
                                    </Button>
                                    
                                </CardActions>
                            </Card>
                        )
                    })}
                </Box>
            </Container>
        </Box>

        <AlertDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
            isPending={deleteMutation.isPending}
        />
        
        </>
    )
}
