import moment from "moment";
import * as React from "react";
import { useCallback } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { MyTask } from "../api.ts";
import calendarIcon from '../assets/calendar.svg';
import { FetcherCellOnInput } from "../Views/TaskLayout.tsx";


interface TaskProps {
    id: string;
    task: MyTask;
}


function DueDate({ date }: { date: string | Date }) {
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
        <p className="due-date" style={{ color: "#776EC9" }
        }>
            <img src={calendarIcon} alt="a dark greenish calendar icon" />
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
        editBtn.disabled = status === 'completed';

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
            {task && <div className="task-wrapper">
                {/* TODO: change into inputs and useFetcher */}

                <FetcherCellOnInput taskId={task.id} intent="status">
                    <input type="hidden" name="projectId" value={id} />
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
                <DueDate date={task.dueDate + 'T' + task.dueTime} />
            </div>}
        </>

    )
}