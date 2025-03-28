import moment from "moment";
import { FormEvent, JSX, ReactNode, useCallback, useState } from "react";
import { ActionFunctionArgs, useFetcher } from "react-router-dom";
import { completeTask, CompleteTaskParams, MyTask } from "../api";
import dropDownIcon from '../assets/arrow-down.svg';
import calendarIcon from '../assets/calendar.svg';
import folderIcon from '../assets/projects.svg';
import RectSolidSvg from "./Svg";


interface TaskWrapperProps {
    id: string | undefined;
    projectName: string | undefined;
    tasks: MyTask | undefined;
}

interface FetcherProps {
    projectId: string;
    taskId: string;
    intent?: string;
    children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export async function fetcherAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const payload: CompleteTaskParams = {};
    Object.keys(data).forEach((item) => {
        payload[item] = data[item] as string;
    })
    if (data.status) {
        await completeTask(payload);
    }
}


function FetcherCell({ taskId, projectId, children, intent }: FetcherProps) {
    const fetcher = useFetcher();

    const handler = useCallback((e: FormEvent<HTMLFormElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);
    }, [fetcher])

    return (
        <fetcher.Form method="post" onInput={handler} action="./:todoId">
            <input type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="intent" value={intent} />
            {children}
        </fetcher.Form>)
}


function TasksWrapper({ id, projectName, tasks }: TaskWrapperProps): JSX.Element {
    const [toggle, setToggle] = useState(false);
    const handleTaskClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const { dataset } = e.currentTarget;
        const { task } = dataset;
        const taskCard = document.getElementById(`task-${task ?? ''}`)
        if (taskCard) {
            taskCard.classList.toggle('expand');
        }
    }, []);



    const getPriority = useCallback((priority: number) => {
        return `priority-${priority === 3 ? 'high' : (priority === 2) ? 'medium' : 'low'}`;
    }, []);


    return (
        <section className={`tasks ${toggle ? 'expand' : ''}`}>
            <header onClick={() => { setToggle(!toggle) }}>
                <img className="folder-icon" src={folderIcon} alt="a greyish folder icon" />
                <div className="heading-container">
                    <h2 className="project-name">{projectName}</h2>
                    <span className="line"></span>
                    <div>
                        <img className="dropdown-icon" src={dropDownIcon} alt="a black arrow down icon" />
                        {!toggle && <span className="count">{tasks?.length}</span>}

                    </div>
                </div>
            </header>
            {
                tasks && tasks.length > 0 ? tasks.map((task) => {
                    return (
                        <div id={`task-${task.todoId}`} key={`list-${task.todoId}`} className={`task-card`}>
                            <div className="task-wrapper">
                                {/* TODO: change into inputs and useFetcher */}

                                <FetcherCell projectId={id ?? ''} taskId={task.todoId} intent="status">
                                    <label className={getPriority(task.priority)} htmlFor={`c-${task.todoId}`}>
                                        <input className="form-checkbox" type="checkbox" id={`c-${task.todoId}`}
                                            name={'status'} value={'completed'} required
                                            disabled={task.status === 'completed'} />
                                    </label>
                                </FetcherCell>


                                <section className={`task-info`} onClick={handleTaskClick} data-task={task.todoId}>
                                    <h3 className="title"> {task.status !== 'completed' ? task.title : <s className="strikethrough">{task.title}</s>} </h3>
                                </section>


                                <button type="button" className="options-btn">
                                    {Array.from(Array(6), (_, idx) => <svg key={`rect-${idx.toString()}`} width="3"
                                        height="4" viewBox="0 0 3 4" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <rect y="0.5" width="3" height="3" fill="#D9D9D9" />
                                    </svg>)}
                                </button>
                            </div>


                            {task.status !== 'completed' && <div className="info-container">
                                <DueDate date={task.dueDate} />
                                {task.notes && <section className="info-section">
                                    <RectSolidSvg />
                                    <p className="notes">{task.notes}</p>
                                </section>}
                                <section className="info-section">
                                    <RectSolidSvg />
                                    <p className="description">{task.description}</p>
                                </section>
                            </div>}

                        </div>

                    )
                }) : <p className="empty-task">Currently no {projectName} tasks.</p>
            }
            <div className="btn-container">
                <RectSolidSvg/>
            <button className="task-btn" type="button">Write a task...</button>
            </div>
        </section>)
}

function DueDate({ date }: { date: string }) {
    const [dueDate,] = useState(() => moment(date.split('-').join(''), 'YYYYMMDD').fromNow());
    return (
        <p className="due-date" style={{ color: "rgb(22, 196, 127)" }}>
            <img src={calendarIcon} alt="a purplish calendar icon" /> Due {dueDate}
        </p>)
}


export default TasksWrapper;