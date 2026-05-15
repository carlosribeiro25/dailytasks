
import { Route, Routes} from 'react-router-dom';
import Login from '../components/Login';
import HomePage from '../components/HomePage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/login' element={<Login/>} /> 
             
            <Route path='/' element={<HomePage />}/>
        </Routes>
    )
}