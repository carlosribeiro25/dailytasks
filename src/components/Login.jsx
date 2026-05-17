import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/Api';
import {
    Alert, Box, Button, Container, IconButton, InputAdornment, Paper, TextField, Typography,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const { data } = await api.post('/login', {
                email,
                password
            })

            localStorage.setItem('token', data.token)
            navigate('/')
        } catch (error) {
            console.error("Erro: ", error.response?.data || error.message)
            if (error.response?.status === 400) {
                setErrorMsg("Credenciais inválidas, verifique se o email ou senha estão corretos")
            } else {
                setErrorMsg("Erro ao realizar login")
            }
        }
    }

    return (
        <Box className="flex items-center   justify-center py-10 px-4 sm:px-6">
            <Container maxWidth="xs" disableGutters>
                <Paper elevation={4} className="rounded-2xl overflow-hidden w-full">

                    <Box className="bg-gray-800 px-4 py-4 flex flex-col items-center gap-2">
                        <Typography variant="h5" component="h1" className="font-bold text-amber-50">
                            Bem-vindo ao Dailytasks
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5 p-6 sm:p-8 "
                    >
                        <TextField
                            label="Digite seu email"
                            type="email"
                            value={email}
                            name="email"
                            id="email"
                            placeholder="Digite seu email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className=' text-stone-50'
                            fullWidth
                            variant="outlined"
                        />

                        <TextField
                            label="Sua senha"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            name="password"

                            id="password"
                            placeholder="Digite sua senha"
                            onChange={(e) => setPassword(e.target.value)}
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
                                                sx={{ color: 'rgba(0,0,0,0.54)' }}
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            startIcon={<LoginIcon />}
                        >
                            Acessar
                        </Button>

                        <div className='justify-center text-center flex'>
                            <Link to='/registerUser' >
                                <p className='text-green-600'>Já tem conta?  Cadastre-se aqu ⬇</p><HowToRegIcon /> </Link>
                        </div>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}
