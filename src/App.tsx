import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';
import { projectAction } from './components/Modal';
import AllTasks from "./Views/AllTasks.tsx";
import StartPage, { introLoader, startPageAction } from './Views/StartPage';
import Task, { taskLoader } from './Views/Task.tsx';
import TaskLayout, { allTasksLoader } from "./Views/TaskLayout.tsx";
import { todoFormAction } from './components/TaskForm.tsx';
import { fetcherAction } from './components/TasksWrapper.tsx';

const router = createBrowserRouter(createRoutesFromElements(
    // all todos /todos
    // add todos /todos/new
    // edit or update /todos/:id
    <Route path={"/"} action={projectAction}>
        <Route index element={< StartPage />} loader={introLoader} action={startPageAction} />
        <Route path={'projects'} element={< TaskLayout />} loader={allTasksLoader}>
            <Route index element={< AllTasks />} />
            < Route path = ':todoId' element = {<></>} action={fetcherAction}/>
            <Route path='add' element={<></>} action={todoFormAction} />
            <Route path=':id/todo' element={< Task />} loader={taskLoader} />
            <Route path=':id/todo/:todoId' element={<></>} action={fetcherAction}/>
        </Route>

    </Route>));

function App() {
    return (
        <RouterProvider router={router} />
    )
}

export default App;
