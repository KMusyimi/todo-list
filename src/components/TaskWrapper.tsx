import moment from "moment";
import * as React from "react";
import { useCallback } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { MyTask } from "../api.ts";
import { FetcherCellOnInput } from "../Views/TaskLayout.tsx";


interface TaskProps {
    id: string;
    task: MyTask;
}


export function DueDate({ status,date }: { status: string,date: string | Date }) {
    const [dueDate, setDueDate] = React.useState<string | null>(null);

    const updateDueDate = useCallback((date: string | Date) => {
        setDueDate(prev => {
            prev = moment(new Date(date)).fromNow();
            return prev;
        })
    }, [])

    React.useEffect(() => {
        updateDueDate(date);
        const timer = setInterval(() => {
            updateDueDate(date);
        }, 1000 * 60);
        return () => {
            clearInterval(timer)
        }
    }, [date, updateDueDate]);

    return (
        <p className={"due-date"} style={status === 'overdue' ? { color: 'rgb(235, 90, 60)'}:{ color: "#776EC9" }
        }>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.115} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>

            <span>Due {dueDate}</span>
        </p>)
}

export default function TaskWrapper({ id, task }: TaskProps) {
    const location = useLocation();

    const handleTaskClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const { dataset } = e.currentTarget;
        const { task } = dataset;
        const taskCard = document.getElementById(`task-${task ?? ''}`);
        if (taskCard) {
            taskCard.classList.toggle('expand');
        }
    }, []);


    const getPriority = useCallback((priority: number | string) => {
        return `priority-${priority == 3 ? 'high' : (priority == 2) ? 'medium' : 'low'}`;
    }, []);

    const handleChange = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const { dataset } = e.currentTarget;
        const { status } = dataset;
        const dropdownMenu = document.getElementById('dropdown-menu') as HTMLDivElement;
        const editBtn = document.getElementById('edit-btn') as HTMLButtonElement;

        document.body.style.overflow = 'hidden';
        editBtn.style.display = status === 'completed' ? 'none': '';

        Object.keys(dataset).forEach((item) => {
            const value = dataset[item];
            if (item.match(/[A-Z][a-z]+/g)) {
                item = item.split(/(?=[A-Z])/).join('-');
            }
            dropdownMenu.setAttribute(`data-${item.toLowerCase()}`, value ?? '');
        });

        dropdownMenu.classList.add('open');
    }, []);

    return (
        <>
            {task && <div className={task.status !== 'completed' ? "task-wrapper" : `task-wrapper ${task.status}`}>
                {/* TODO: change into inputs and useFetcher */}

                <FetcherCellOnInput taskId={task.id} intent="status">
                    <input type="hidden" name="projectId" value={id} />
                    <input type="hidden" name="status" value={'completed'} />

                    <label className={`complete-label ${getPriority(task.priority)}`} htmlFor={`c-${task.id}`}>
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            id={`c-${task.id}`}
                            name={'status'}
                            disabled={task.status === 'completed'}
                            value={'completed'} required />
                    </label>
                </FetcherCellOnInput>

                <section className={`task-info`} onClick={handleTaskClick}>
                    {task.status !== 'completed' ?
                        <Link to={`/projects/${id}/todo/details/${task.id}`}
                            state={{ backTo: location.pathname, date: location.search }}
                            className="title">{task.title}</Link> :
                        <h3 className="title"> {task.title}</h3>
                    }
                </section>

                <button id={`btn-${id}`} type="button" onClick={handleChange} data-task-id={task.id} data-project-id={id} data-status={task.status}>
                    <HiDotsVertical />
                </button>
                {task.status !== 'completed' && <DueDate status={task.status} date={task.dueDate + 'T' + task.dueTime} />}
            </div>}
        </>

    )
}