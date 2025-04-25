import moment from "moment";
import { JSX, use, useEffect, useState } from "react";
import { Link, LoaderFunctionArgs, useLoaderData, useLocation } from "react-router-dom";
import { getProject, getTask, MyTask } from "../api";
import Main from "../components/Main";
import { ProjectIcon } from "../components/Svg";
import { FetcherCellOnInput, FetcherCellSubmit } from "./TaskLayout";
import SubTask from "../components/Subtask";
import { DueDate } from "../components/TaskWrapper";


// function DropdownContainer({ children }: { children: ReactNode }) {

// }

// eslint-disable-next-line react-refresh/only-export-components
export async function taskDetailsLoader({ params }: LoaderFunctionArgs) {
  if (!params.todoId || !params.id) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Bad Request", { status: 400 });
  }
  const project = await getProject(params.id)
  return { task: getTask(params.todoId), project: project?.withoutTasks() }
}



export default function TaskDetails(): JSX.Element {
  const [backToLink, setBackToLink] = useState('');
  const location = useLocation();
  const { task, project } = useLoaderData<typeof taskDetailsLoader>();
  const loadedTask: MyTask = use(task);
  const { id, title, dueDate, subtasks, description, status, dueTime } = loadedTask ?? {};

  useEffect(() => {
    setBackToLink((prev) => {
      if (location.state) {
        const { date, backTo } = location.state as { date: string, backTo: string };
        prev = date ? backTo.concat(date) : backTo;
      }
      return prev;

    });

  }, [location.state])

  return (
    <Main style={{ padding: " 2em 1.35em" }}>
      <div className="task-details">
        <Link to={backToLink} relative={'path'}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>

        </Link>
        <div className="header-container">
          <FetcherCellOnInput taskId={id ?? ''} intent="status" action="./../../:todoId">
            <input type="hidden" name="projectId" value={project?.id} />
            <label className="complete-label" htmlFor={`c-${id ?? ''}`}>
              <input
                className="form-checkbox"
                type="checkbox"
                id={`c-${id ?? ''}`}
                name={'status'}
                value={'completed'} required />
            </label>
          </FetcherCellOnInput>
          <header><h1>{title} </h1></header>
          <span className={'status'} style={status === 'overdue' ? { backgroundColor: 'rgb(235, 90, 60)' } : { backgroundColor: "#776EC9" }}>{status} </span>
          <DueDate status={status ?? 'active'} date={`${dueDate ?? ''}T${dueTime ?? ''}`} />
        </div>

        <div className="primary-container">

          <section className="category-section">
            <h2 className="category-title">Category</h2>
            <div className="project-container">
              <ProjectIcon color={project?.iconColor ?? ''} />
              <p className="project-name">{project?.projectName}</p>
            </div>
          </section>

          <section className="dueDate-section">
            <h2 className="due-title">Due date</h2>
            <div className="due-container">
              <p className="due">{moment(dueDate).format('ll')}</p>
            </div>
          </section>
        </div>

        <div className="bg-description">
          <h2>Description
            <i>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </i>
          </h2>
          <p className="description">{description}</p>
        </div>
        <FetcherCellSubmit taskId={id ?? ''} intent="add-subtask" action=".">
          <label htmlFor={'notes'}> Notes </label>
          <textarea id={'notes'}
            name={'notes'}
            className={'form-textarea'}
            placeholder={'Write a brief note...'}
            maxLength={100}
          > </textarea>
        </FetcherCellSubmit>


        {subtasks && <div>
          <SubTask taskId={id ?? ''} subtask={subtasks} />
        </div>}
        <FetcherCellSubmit taskId={id ?? ''} intent="add-subtask" action=".">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          <input className="subtask-input" name='title' type="text" placeholder="Add a subtask" />
        </FetcherCellSubmit>
        <div className="btn-container">
          <button type="button">delete</button>
        </div>
      </div>

    </Main>

  )
}