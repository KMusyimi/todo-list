import moment from "moment";
import { JSX, use, useEffect, useState } from "react";
import { Link, LoaderFunctionArgs, useLoaderData, useLocation } from "react-router-dom";
import { getProject, getTask } from "../api";
import dropDownIcon from '../assets/arrow-down.svg';
import Main from "../components/Main";
import RectSolidSvg, { ProjectIcon } from "../components/Svg";
import { FetcherCellSubmit } from "./TaskLayout";
import SubTask from "../components/Subtask";


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
  const loadedTask = use(task);
  const { id, title, dueDate, subtasks, description } = loadedTask ?? {};

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
    <Main>
      <div className="task-details">
        <Link to={backToLink} relative={'path'}> back </Link>
        <section>
          <header><RectSolidSvg /><h1>{title}</h1></header>
          <div className="container">
            <section className="category-section">
              <h2 className="category-title">Category</h2>
              <div className="dropdown-container">
                <span className="project-icon"><ProjectIcon color={project?.iconColor ?? ''} /></span>
                <p className="project-name">{project?.projectName}</p>
                <img className="dropdown-icon" src={dropDownIcon} alt="a black arrow down icon" />
              </div>
            </section>

            <section className="dueDate-section">
              <h2 className="due-date-title">Due date</h2>
              <div className="dropdown-container">
                <p className="due-date">{moment(dueDate).format('ll')}</p>
                <img className="dropdown-icon" src={dropDownIcon} alt="a black arrow down icon" />
              </div>
            </section>
          </div>

          <div className="bg-description">
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
            <SubTask taskId={id ?? ''} subtask={subtasks}/>
          </div>}
          <FetcherCellSubmit taskId={id ?? ''} intent="add-subtask" action=".">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            <input className="subtask-input" name='title' type="text" placeholder="Add a subtask" />
          </FetcherCellSubmit>
        </section>
        <div className="btn-container">
            <button type="button">delete</button>
        </div>
      </div>

    </Main>

  )
}