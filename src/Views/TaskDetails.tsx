import moment from "moment";
import { JSX, use, useCallback, useEffect, useRef, useState } from "react";
import { Link, LoaderFunctionArgs, useLoaderData, useLocation } from "react-router-dom";
import { getProject, getTask, MyProjects, MyTask } from "../api";
import Main from "../components/Main";
import { FetcherCellOnInput, FetcherCellSubmit, FormIntent } from "./TaskLayout";
import SubTask from "../components/Subtask";
import { DueDate } from "../components/TaskWrapper";
import { v4 as uuidV4 } from 'uuid';
import TaskForm from "../components/TaskForm";
import { getPriority, hexToRGB } from "../utils";



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
  const overdueStyles = { backgroundColor: 'rgba(235, 90, 60, .3)', color: 'rgba(235, 90, 60, 1)' };

  const activeStyles = { backgroundColor: "rgba(119, 110, 201, .3)", color: "rgba(119, 110, 201, 1)" };

  const [backToLink, setBackToLink] = useState('');
  const [fetcherAction, setFetcherAction] = useState('');
  const [toggleForm, setToggleForm] = useState(false);
  const [formIntent, setFormIntent] = useState<FormIntent>(null);

  const location = useLocation();
  const { task, project } = useLoaderData<typeof taskDetailsLoader>();
  const loadedTask: MyTask = use(task);
  const { id, title, priority, dueDate, subtasks, description, status, dueTime } = loadedTask ?? {};
  const editProject = [{ ...project, tasks: [loadedTask] }] as MyProjects;

  const displayFormRef = useRef(true);

  useEffect(() => {
    const { date, backTo } = location.state as { date: string, backTo: string };
    setBackToLink((prev) => {
      if (!prev) {
        prev = date ? backTo.concat(date) : backTo;
      }
      return prev;

    });
    if (!toggleForm) {
      displayFormRef.current = true;
    }
    setFetcherAction(prev => {
      if (!prev) {
        prev = date ? './../../:todoId'.concat(date) : './../../:todoId';
      }
      return prev;
    })

  }, [location.state, toggleForm]);
  const taskPriority = getPriority(priority ?? '');

  const handleEditBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    displayFormRef.current = false;
    setFormIntent({ taskId: id, projectId: project?.id, intent: 'edit' } as FormIntent);

  }, [id, project?.id]);

  const handleTransitionEnd = useCallback(() => {
    if (!displayFormRef.current) {
      setToggleForm(!toggleForm);

    }
  }, [toggleForm]);

  return (
    <Main className={'main main-details'} style={toggleForm ? { overflow: 'hidden' } : {}}>

      <div id="task-details" className={displayFormRef.current ? 'task-details' : "task-details hidden"}
        onTransitionEnd={handleTransitionEnd}
      >

        <Link to={backToLink} relative={'path'}>
          <i>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
          </i>
          <span>go back </span>
        </Link>

        <div className="header-container">
          <FetcherCellOnInput taskId={id ?? ''} intent="status" action={fetcherAction}>
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
          <header>
            <h1>{title}</h1>
          </header>
          <div className="project-container" style={{ backgroundColor: hexToRGB(project?.iconColor ?? '', .35) }}>
            <span className="project-name">{project?.projectName}</span>
          </div>

          <DueDate status={status ?? 'active'} date={`${dueDate ?? ''}T${dueTime ?? ''}`} />
        </div>

        <div className="primary-container bg-grey">
          <section className="priority-section">
            <h2 className="priority-title">Priority</h2>
            <p className={`priority priority--${taskPriority}`}>{taskPriority}</p>
          </section>
          <section>
            <h2>Status</h2>
            <p className={'status'} style={status === 'overdue' ? overdueStyles : activeStyles}>{status} </p>
          </section>

          <section className="dueDate-section">
            <h2 className="due-title">Due date</h2>
            <p className="due">{moment(dueDate).format('ll')}</p>
          </section>
        </div>

        <div className="description-container bg-grey">
          <h2>Description
            <i>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </i>
          </h2>
          <p className="description">{description}</p>
        </div>

        {subtasks && <SubTask taskId={id ?? ''} subtask={subtasks} action={fetcherAction} />
        }
        <FetcherCellSubmit className="subtask-form" taskId={id ?? ''} intent="add-subtask" action={fetcherAction}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          <input type="hidden" name="id" value={uuidV4()} />
          <input className="subtask-input" name='title' type="text" placeholder="Add a subtask" />
        </FetcherCellSubmit>
      </div>

      <div className="btn-container">
        <button className="edit-btn" type="button" onClick={handleEditBtn}>edit</button>
        <FetcherCellOnInput id={'delete-form'} taskId={id ?? ''} intent="delete" action={fetcherAction}>
          <button className="delete-btn" type="submit">delete</button>
        </FetcherCellOnInput>
      </div>

      {toggleForm && <TaskForm formIntent={formIntent} setFormIntent={setFormIntent} toggleForm={toggleForm} projects={editProject} setToggleForm={setToggleForm} />}

      <div className={'ovly'}></div>
    </Main>

  )
}