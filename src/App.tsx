
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';
import Layout, { projectLoader } from './components/Layout';
import { projectAction } from './components/Modal';
import AddTodo, { todoFormAction } from './Views/AddTodo';
import HomePage, { todoAction, todoLoader } from './Views/HomePage';

const router = createBrowserRouter(createRoutesFromElements(
  // all todos /todos
  // add todos /todos/new
  // edit or update /todos/:id
  <Route path={"/"} element={<Layout />} action={projectAction} loader={projectLoader}>
    <Route path=':id/todos' element={<HomePage />} loader={todoLoader} action={todoAction} />
    <Route path=':id/todos/add' element={<AddTodo />} action={todoFormAction} />
    <Route path=':id/todos/:todoId' element={<AddTodo />} action={todoFormAction} />
  </Route>))

function App() {


  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App;
