import moment from "moment";
import { FormEvent, JSX, ReactNode, useCallback, useState } from "react";
import { CgNotes } from "react-icons/cg";
import { MdDescription } from "react-icons/md";
import { ActionFunctionArgs, useFetcher } from "react-router-dom";
import { MyTask } from "../api";
import calendarIcon from '../assets/calendar.svg';

interface TaskWrapperProps {
    projectName: string | undefined,
    tasks: MyTask | undefined,
    cls: string
}

interface FetcherProps {
    id: string;
    children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export async function fetcherAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const completed = formData.get('completed');
    const taskId = formData.get('id');
    console.log(completed, taskId);
}

function DueDate({ date }: { date: string }) {
    const [dueDate,] = useState(() => moment(date.split('-').join(''), 'YYYYMMDD').fromNow());
    return (
        <p className="due-date" style={{ color: "rgb(22, 196, 127)" }}>
            <img src={calendarIcon} alt="a purplish calendar icon" /> Due {dueDate}
        </p>)
}


function FetcherCell({ id, children }: FetcherProps) {
    const fetcher = useFetcher();

    const handler = useCallback((e: FormEvent<HTMLFormElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);
    }, [fetcher])

    return (
        <fetcher.Form method="post" onInput={handler} action="./:todoId">
            <input type="hidden" name="id" value={id} />
            {children}
        </fetcher.Form>)
}


function TasksWrapper({ projectName, tasks, cls }: TaskWrapperProps): JSX.Element {
    const handleClick = useCallback((e: React.MouseEvent<HTMLSelectElement>) => {
        const { dataset } = e.currentTarget;
        const { task } = dataset;
        const taskCard = document.getElementById(`task-${task ?? ''}`)
        if (taskCard) {
            taskCard.classList.toggle('open');
        }
    }, [])

    return (
        <section className={`tasks ${cls}`}>
            <header>
                <h2 className="project-name"> {projectName} </h2>
            </header>
            {
                tasks && tasks.length > 0 ? tasks.map((task) => {

                    return (
                        <div id={`task-${task.todoId}`} key={`list-${task.todoId}`} className={`task-card`}>
                            <div className="task-wrapper">
                                {/* TODO: change into inputs and useFetcher */}
                                <FetcherCell id={task.todoId}>
                                    <label htmlFor={`c-${task.todoId}`}>
                                        <input className="form-checkbox" type="checkbox" id={`c-${task.todoId}`} name={'completed'} value={'completed'} required />
                                    </label>
                                </FetcherCell>
                                <section className={`task-info`} onClick={handleClick} data-task={task.todoId}>
                                    <h3 className="title"> {task.title} </h3>
                                    <DueDate date={task.dueDate} />
                                </section>
                                <button type="button" className="options-btn">
                                    {Array.from(Array(6), (_, idx) => <svg key={`rect-${idx.toString()}`} width="3"
                                        height="4" viewBox="0 0 3 4" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <rect y="0.5" width="3" height="3" fill="#D9D9D9" />
                                    </svg>)}
                                </button>
                            </div>
                            <div className="info-container">
                                {task.notes && <section className="info-section">
                                    <CgNotes />
                                    <p className="notes">{task.notes}</p>
                                </section>}
                                <section className="info-section">
                                    <MdDescription />
                                    <p className="description">{task.description}</p>
                                </section>
                            </div>

                        </div>

                    )
                }) : <p className="empty-task">Currently no {projectName} tasks.</p>
            }
        </section>)
}

export default TasksWrapper;