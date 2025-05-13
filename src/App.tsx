import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import './App.css';
import {projectAction} from './components/Modal';
import {addLoader, taskFormAction} from './components/TaskForm.tsx';
import AllTasks from "./Views/AllTasks.tsx";
import StartPage, {introLoader} from './Views/StartPage';
import Task, {taskLoader} from './Views/Task.tsx';
import TaskLayout, {fetcherAction, projectsLoader} from "./Views/TaskLayout.tsx";
import TaskDetails, { taskDetailsLoader } from './Views/TaskDetails.tsx';
import Completed, {completedTaskLoader} from './Views/Completed.tsx';


// all todos /todos
// add todos /todos/new
// edit or update /todos/:id
const router = createBrowserRouter(createRoutesFromElements(
    <Route path={"/"} action={projectAction}>
        <Route index element={<StartPage/>} loader={introLoader} action={projectAction}/>
        <Route path={'projects'} element={<TaskLayout/>} loader={projectsLoader}>
            <Route index element={<AllTasks/>}/>
            <Route path=':todoId' element={<></>} action={fetcherAction}/>
            <Route path='add' element={<></>} loader={addLoader} action={taskFormAction}/>
            <Route path=':id/todo' element={<Task/>} loader={taskLoader}/>
            <Route path=':id/todo/:todoId' element={<></>} action={fetcherAction}/>
            <Route path='completed' element={<Completed/>} loader={completedTaskLoader}/>
        </Route>
        <Route path={'projects/:id/todo/details/:todoId'} element={<TaskDetails />} loader={taskDetailsLoader} action={taskFormAction}/>    
    </Route>));

function App() {
    return (<RouterProvider router={router}/>);
}

export default App;