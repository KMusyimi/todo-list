import moment from "moment";
import { FormEvent, JSX, ReactNode, useCallback, useEffect, useState } from "react";
import { IoTimeOutline } from "react-icons/io5";
import { MdDeleteOutline, MdOutlineEditNote } from "react-icons/md";
import { ActionFunctionArgs, useFetcher, useSearchParams } from "react-router-dom";
import { addCompletedTask, CompleteTaskParams, MyTask } from "../api";
import dropDownIcon from '../assets/arrow-down.svg';
import calendarIcon from '../assets/calendar.svg';
import folderIcon from '../assets/projects.svg';
import { DescriptionSvg, NotesSvg } from "./Svg";



interface TaskWrapperProps {
    project: {
        id: string | undefined;
        projectName: string | undefined;
        tasks: MyTask[] | undefined;
    }
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
    if (payload.intent === 'status') {
        await addCompletedTask(payload);
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


function TasksWrapper({ project }: TaskWrapperProps): JSX.Element {
    const [toggle, setToggle] = useState(false);
    const [searchParams] = useSearchParams();
    // const submitted = searchParams.get('submitted');
    const filterDate = searchParams.get('date');

    const { id, projectName, tasks } = project;

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
        <>
            <section className={`tasks ${toggle ? 'expand' : ''}`}>
                <header onClick={() => { setToggle(!toggle) }}>
                    <img className="folder-icon" src={folderIcon} alt="a greyish folder icon" />
                    <div className="heading-container">
                        <h2 className="project-name"> {projectName} </h2>
                        <span className="line"> </span>
                        <div>
                            <img className="dropdown-icon" src={dropDownIcon} alt="a black arrow down icon" />
                            {!toggle && <span className="count"> {tasks?.length ?? 0} </span>}

                        </div>
                    </div>
                </header>
                {
                    (tasks && tasks.length > 0) ? tasks.map((task) => {
                        return (
                            <div id={`task-${task.id}`} key={`list-${task.id}`} className={`task-card`}>
                                <div className="task-wrapper">
                                    {/* TODO: change into inputs and useFetcher */}

                                    <FetcherCell projectId={id ?? ''} taskId={task.id} intent="status">
                                        <label className={getPriority(task.priority)} htmlFor={`c-${task.id}`}>
                                            <input
                                                className="form-checkbox"
                                                type="checkbox"
                                                id={`c-${task.id}`}
                                                name={'status'}
                                                disabled={task.status === 'completed'}
                                                value={'completed'} required />
                                        </label>
                                    </FetcherCell>


                                    <section className={`task-info`} onClick={handleTaskClick} data-task={task.id}>
                                        <h3 className="title">{task.status !== 'completed' ? task.title : <s className="strike">{task.title}</s>}</h3>
                                        {filterDate && <span className="due-time">
                                            <IoTimeOutline /> {task.dueTime}
                                        </span>}
                                    </section>
                                    <div className="btn-container">
                                        {task.status !== 'completed' && <button type="button"> <MdOutlineEditNote /></button>}
                                        <button type="button"><MdDeleteOutline style={{ fill:'rgba(249, 56, 39, .8)' }} /></button>
                                    </div>
                                </div>


                                {task.status !== 'completed' && <div className="info-container">
                                    <DueDate date={task.dueDate + 'T' + task.dueTime} />

                                    <section className="info-section">
                                        <DescriptionSvg />
                                        <p className="description"> {task.description} </p>
                                    </section>
                                    {task.notes && <section className="info-section">
                                        <NotesSvg />
                                        < p className="notes"> {task.notes} </p>
                                    </section>
                                    }
                                </div>
                                }

                            </div>

                        )
                    }) : <p className="empty-task" > Currently no {projectName?.toLocaleLowerCase()} tasks.</p>
                }
                
            </section>
            
        </>

    )
}

function DueDate({ date }: { date: string | Date }) {
    const [dueDate, setDueDate] = useState<string | null>(null);

    const updateDueDate = useCallback((date: string | Date) => {
        setDueDate(prev => {
            prev = moment(new Date(date)).fromNow();
            return prev;
        })

    }, [])

    useEffect(() => {
        updateDueDate(date);
        const timer = setInterval(() => {
            updateDueDate(date);
        }, 1000 * 60);
        return () => { clearInterval(timer) }
    }, [date, updateDueDate]);

    return (
        <p className="due-date" style={{ color: "rgb(22, 196, 127)" }}>
            <img src={calendarIcon} alt="a dark greenish calendar icon" /> Due {dueDate}
        </p>)
}


export default TasksWrapper;