/* eslint-disable react-refresh/only-export-components */
import { JSX, Suspense } from "react";
import { ActionFunctionArgs, Await, Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { getProjectName, getTodos } from "../api";

// eslint-disable-next-line @typescript-eslint/require-await
export async function todoLoader({ params }: LoaderFunctionArgs) {
  const project = getProjectName();
  return { todos: getTodos(params.id), projectName: project.projectName(params.id) }
}

export async function todoAction({ request }: ActionFunctionArgs) {
  try {
    const formdata = await request.formData();
    console.log(formdata.get('name'));
  } catch (e) {
    console.error(e);
  }
}

export default function Content(): JSX.Element {
  const data = useLoaderData<typeof todoLoader>();

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Await resolve={data.projectName}>
        {(projectName) => {
          return (
            <header>
              <h1>{projectName}</h1>
            </header>)
        }}
      </Await>
      <Await resolve={data.todos}>
        {(loadedTodos) => {
          const { todos } = loadedTodos ?? {};
          return (
            <>

              <Link className="add-todo--link" to={'add'}>+ Add Todo</Link>

              <div className="todos-container">
                {todos ? todos.map((todo, idx) => {
                  return (
                    <li key={`list-${idx.toString()}`}>
                      <h2>{todo.title}</h2>
                      <p>{todo.priority}</p>
                      <p>{todo.dueDate}</p>
                      <p>{todo.description}</p>
                    </li>)
                }) : <p>Currently no todos. Add a Todo to be able to view one.</p>}
              </div>

            </>
          )
        }}
      </Await>
    </Suspense>
  )
}