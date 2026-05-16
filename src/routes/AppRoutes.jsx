import { Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import HomePage from '../components/HomePage';
import Tasks from '../pages/tasks/GetTasks';
import CreateTask from '../pages/tasks/CreateTask';
import PageDetailTask from '../pages/TakDetails';
import UpdateTask from '../pages/UpdateTask';
import FilterTasks from '../components/FilterTasks';
import PrivateRoute from '../components/PrivateRouter'; 
import RegisterUser from '../components/CadastroUser';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/registerUser' element={<RegisterUser/>}/>

            <Route element={<PrivateRoute />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/tasks' element={<Tasks />} />
                <Route path='/cadastrar' element={<CreateTask />} />
                <Route path='/tasks/filter' element={<FilterTasks />} />
                <Route path='/tasks/:id' element={<PageDetailTask />} />
                <Route path='/tasks/:id/update' element={<UpdateTask />} />
            </Route>
        </Routes>
    )
}

