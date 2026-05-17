import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/Api';
import {
    Alert, Box, Button, CircularProgress, Container, IconButton, InputAdornment, Paper, TextField, Toolbar, Typography,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Link } from 'react-router-dom';

const registerUser = async (userData) => {
    const { data } = await api.post('/users', userData);
    return data;
};

export default function RegisterUser() {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            setForm({ name: '', email: '', password: '', confirmPassword: '' });
            setErrorMsg('');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
        },
        onError: (error) => {
            const msg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Erro ao cadastrar usuário';
            setErrorMsg(msg);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.name.length < 4) {
            setErrorMsg('Nome deve ter pelo menos 4 caracteres');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setErrorMsg('As senhas não coincidem');
            return;
        }
        if (form.password.length < 6) {
            setErrorMsg('Senha deve ter pelo menos 6 caracteres');
            return;
        }

        setErrorMsg('');
        mutation.mutate({
            name: form.name,
            email: form.email,
            password: form.password,
        });
    };

    return (
        <>

            <Toolbar />

            <Box className="flex items-center justify-center py-10 px-4 sm:px-6">
                <Container maxWidth="xs">
                    <Paper elevation={4} className="rounded-2xl overflow-hidden">


                        <Box className="bg-blue-600 px-6 py-5 flex items-center gap-3">
                            <PersonAddIcon className="text-white" fontSize="large" />
                            <Typography variant="h5" component="h1" className="font-bold text-white">
                                Criar conta
                            </Typography>
                        </Box>


                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 p-6"
                        >
                            <TextField
                                label="Nome completo"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Seu nome completo"
                                inputProps={{ minLength: 4 }}
                                required
                                fullWidth
                                variant="outlined"
                            />

                            <TextField
                                label="E-mail"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                required
                                fullWidth
                                variant="outlined"
                            />

                            <TextField
                                label="Senha"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                inputProps={{ minLength: 6 }}
                                required
                                fullWidth
                                variant="outlined"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    edge="end"
                                                    sx={{ color: 'rgba(112,128,144)' }}
                                                    size='medium'
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />

                            <TextField
                                label="Confirmar senha"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repita a senha"
                                required
                                fullWidth
                                variant="outlined"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                    edge="end"
                                                    sx={{ color: 'rgba(0,0,0,0.54)' }}
                                                >
                                                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />

                            {errorMsg && (
                                <Alert severity="error" onClose={() => setErrorMsg('')}>
                                    {errorMsg}
                                </Alert>
                            )}

                            {success && (
                                <Alert severity="success" onClose={() => setSuccess(false)}>
                                    Usuário cadastrado com sucesso!
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                disabled={mutation.isPending}
                                startIcon={
                                    mutation.isPending
                                        ? <CircularProgress size={18} color="inherit" />
                                        : <HowToRegIcon />
                                }
                            >
                                {mutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
                            </Button>
                            <Link className='text-blue-400 text-center justify-center ml-4' to='/login'> Voltar</Link>
                        </Box>
                    </Paper>
                </Container>


            </Box>
        </>
    );
}