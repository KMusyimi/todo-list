import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';
import { projectAction } from './components/Modal';
import { taskFormAction } from './components/TaskForm.tsx';
import { fetcherAction } from './components/TasksWrapper.tsx';
import AllTasks from "./Views/AllTasks.tsx";
import StartPage, { introLoader, startPageAction } from './Views/StartPage';
import Task, { taskLoader } from './Views/Task.tsx';
import TaskLayout, { projectsLoader } from "./Views/TaskLayout.tsx";

const router = createBrowserRouter(createRoutesFromElements(
    // all todos /todos
    // add todos /todos/new
    // edit or update /todos/:id
    <Route path={ "/"} action = { projectAction } >
    <Route index element = {< StartPage />} loader = { introLoader } action = { startPageAction } />
        <Route path={ 'projects' } element = {< TaskLayout />} loader = { projectsLoader } >
            <Route index element = {< AllTasks />} />
                < Route path = ':todoId' element = {<> </>} action={fetcherAction}/ >
                    <Route path='add' element = {<> </>} action={taskFormAction} / >
                        <Route path=':id/todo' element = {< Task />} loader = { taskLoader } />
                            <Route path=':id/todo/:todoId' element = {<> </>} action={fetcherAction}/>
                                </Route>

                                </Route>));

function App() {
    return (
        <RouterProvider router= { router } />
    )
}

export default App;
