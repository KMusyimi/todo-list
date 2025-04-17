import { HiDotsVertical } from "react-icons/hi";
import { IoTimeOutline } from "react-icons/io5";
import { MyTask } from "../api.ts";
import * as React from "react";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FetcherCell } from "../Views/TaskLayout.tsx";

interface TaskProps {
    id: string;
    task: MyTask;
}


export default function TaskWrapper({ id, task }: TaskProps) {
    const [searchParams] = useSearchParams();
    const filterDate = searchParams.get('date');

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
        const { status} = dataset;
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

                <FetcherCell taskId={task.id} intent="status">
                    <input type="hidden" name="projectId" value={id} />
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
                    <h3 className="title"> {task.status !== 'completed' ? task.title :
                        <s className="strike"> {task.title} </s>}</h3>
                    {filterDate && <span className="due-time"><IoTimeOutline /> {task.dueTime}</span>}
                </section>

                <button id={`btn-${id}`} type="button" onClick={handleChange} data-task-id={task.id} data-project-id={id} data-status={task.status}>
                    <HiDotsVertical />
                </button>
            </div>}
        </>

    )
}