import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../services/update-tesk";
import {Box, Button, CircularProgress, Container, FormControl, Alert, InputLabel,  MenuItem,  Paper,  Select,  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ResponsiveAppBar from "../components/NavBar";


function toInputDate(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) return dateStr;
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
}

function toApiDate(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("/")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export default function UpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("pendente");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await getTaskById(id);
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setCategory(data.category ?? "");
        setPriority(data.priority ?? "");
        setStatus(data.status ?? "pendente");
        setDate(toInputDate(data.date));
        setTime(data.time ?? "");
      } catch (error) {
        console.error("Erro ao carregar tarefa:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!category) {
      setErrorMsg("Selecione uma categoria");
      return;
    }
    if (!priority) {
      setErrorMsg("Selecione uma prioridade");
      return;
    }
    if (description && description.length < 4) {
      setErrorMsg("Descrição deve ter pelo menos 4 caracteres ou deixar em branco");
      return;
    }

    setErrorMsg("");
    try {
      await updateTask(id, {
        title,
        description: description || undefined,
        category,
        priority,
        status,
        date: toApiDate(date),
        time,
      });
      setSuccess(true);
      setTimeout(() => navigate("/tasks"), 1500);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setErrorMsg("Erro ao atualizar tarefa");
    }
  }

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen bg-gray-50">
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <>

    <ResponsiveAppBar/>
    <Toolbar />
    <Box className="py-6 px-4 sm:px-6 md:py-10">
      <Container maxWidth="md">
        <Paper
          elevation={4}
          className="rounded-2xl overflow-y-hidden"
        >
          <Box className="bg-blue-600 px-6 py-5 flex items-center gap-3">
            <EditNoteIcon className="text-white" fontSize="large" />
            <Typography
              variant="h5"
              component="h1"
              className="font-bold text-white"
            >
              Editar Tarefa
            </Typography>
          </Box>

         
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 p-5 sm:p-7 md:p-8"
          >
            
            <TextField
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              inputProps={{ minLength: 4 }}
              required
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Descrição (opcional, mínimo 4 caracteres)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
            />

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-label">Categoria</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Categoria"
                >
                  <MenuItem value="">
                    <em>Selecione a categoria</em>
                  </MenuItem>
                  <MenuItem value="estudo">Estudo</MenuItem>
                  <MenuItem value="saude">Saúde</MenuItem>
                  <MenuItem value="trabalho">Trabalho</MenuItem>
                  <MenuItem value="pessoal">Pessoal</MenuItem>
                  <MenuItem value="outro">Outro</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="priority-label">Prioridade</InputLabel>
                <Select
                  labelId="priority-label"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  label="Prioridade"
                >
                  <MenuItem value="">
                    <em>Selecione a prioridade</em>
                  </MenuItem>
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="pendente">⏳ Pendente</MenuItem>
                <MenuItem value="em_andamento">🔄 Em andamento</MenuItem>
                <MenuItem value="concluido">✅ Concluído</MenuItem>
              </Select>
            </FormControl>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                label="Hora"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
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
              <Alert severity="success">
                Tarefa atualizada! Redirecionando...
              </Alert>
            )}

            <Box className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/tasks")}
                fullWidth
                className="sm:flex-1"
                size="large"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                fullWidth
                className="sm:flex-1"
                size="large"
              >
                Salvar alterações
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
    
    </>

  );
}