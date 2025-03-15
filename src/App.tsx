
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';
import Content, { todoLoader } from './components/Content';
import Layout from './components/Layout';
import { projectAction } from './components/Modal';
import { projectLoader } from './components/Nav';
import TodoForm, { todoFormAction } from './components/TodoForm';

const router = createBrowserRouter(createRoutesFromElements(
  // all todos /todos
  // add todos /todos/new
  // edit or update /todos/:id
  <Route path={"/"} element={<Layout />} action={projectAction} loader={projectLoader}>
    <Route path=':id/todos' element={<Content />} loader={todoLoader} action={todoLoader} />
    <Route path=':id/todos/add' element={<TodoForm />} action={todoFormAction} />
    <Route path=':id/todos/:todoId' element={<TodoForm />} action={todoFormAction} />
  </Route>))

function App() {


  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App;
