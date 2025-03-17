/* eslint-disable react-refresh/only-export-components */
import { JSX, Suspense, useId, useState } from "react";
import { ActionFunctionArgs, Await, Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { getProjectName, getTodos } from "../api";
import { daysInWeekArr } from "../utils";

// eslint-disable-next-line @typescript-eslint/require-await
export async function todoLoader({ params }: LoaderFunctionArgs) {
  const project = getProjectName();
  return { todos: getTodos(params.id), projectName: await project.projectName(params.id) }
}

export async function todoAction({ request }: ActionFunctionArgs) {
  try {
    const formdata = await request.formData();
    console.log(formdata.get('name'));
  } catch (e) {
    console.error(e);
  }
}

export default function HomePage(): JSX.Element {
  const { todos, projectName } = useLoaderData<typeof todoLoader>();
  const [currentDate,] = useState(() => new Date());


  function RenderDates() {
    const id = useId();
    const startDay = currentDate.getDay();
    const strDate = currentDate.toISOString().slice(0, 10);
    const arrDays = [...daysInWeekArr.slice(startDay - 1), ...daysInWeekArr.slice(0, startDay - 1)];

    return arrDays.map((daysStr, idx) => {
      const date = new Date();
      // d.getDate() - d.getDay() + idx, we take the current day (23), remove the day of week (0 for Sunday, 2 for Tuesday... Basically we calculate the last Sunday date) et add number of days to have every date in the week.
      const day = date.setDate(date.getDate() - date.getDay() + (startDay - 1 + idx));
      const formatDate: string = new Date(day).toISOString().slice(0, 10);

      const dateWeek = formatDate.substring(formatDate.lastIndexOf('-') + 1);

      return (
        <button className={strDate === formatDate ? 'date-btn today' : 'date-btn'} type="button" key={`day-${id + idx.toString()}`}>
          <span className="day">{daysStr.slice(0, 3)}</span>
          <span className="date">{dateWeek}</span>
        </button>)
    })

  }

  return (
    <div className="todo-container">
      <header>
        <h1>{projectName}</h1>
      </header>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Await resolve={todos}>
          {(loadedTodos) => {
            const { todos } = loadedTodos ?? {};
            return (
              <>

                <Link className="add-todo--link" to={'add'} state={{projectName}}>+ Add Task</Link>
                {todos && <RenderDates />}

                <div className="todos-wrapper">
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


    </div>
  )
}