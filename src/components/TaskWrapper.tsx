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
        
        const {taskId, projectId, status} = e.currentTarget.dataset;
        const dropdownMenu = document.getElementById(`dropdown-menu`);
        const editBtn = document.getElementById(`edit-btn`) as HTMLButtonElement;
        const y = JSON.stringify(e.currentTarget.getBoundingClientRect().top + window.scrollY);
        
        if(status === 'completed'){
            editBtn.disabled  = true;
            editBtn.style.color  = '#b3b3b3';
            editBtn.style.cursor  = 'disabled';
        }else{
            editBtn.disabled = false;
            editBtn.style.color  = '';
            editBtn.style.cursor  = '';
            
        }
        document.body.style.overflow = 'hidden';
        sessionStorage.setItem('scrollY', y)
        window.scroll(0, Number(y));
        if (dropdownMenu) {
            dropdownMenu.setAttribute('data-task-id', taskId ?? '');
            dropdownMenu.setAttribute('data-project-id', projectId ?? '');
            dropdownMenu.setAttribute('data-status', status ?? '');
            dropdownMenu.classList.add('open');
        }
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