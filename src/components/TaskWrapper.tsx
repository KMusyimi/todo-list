import {HiDotsVertical} from "react-icons/hi";
import {IoTimeOutline} from "react-icons/io5";
import {MyTask} from "../api.ts";
import * as React from "react";
import {FormEvent, ReactNode, useCallback, useRef} from "react";
import {useFetcher, useSearchParams} from "react-router-dom";

interface TaskProps {
    id: string;
    task: MyTask;
}

interface FetcherProps {
    projectId: string;
    taskId: string;
    intent?: string;
    children: ReactNode;
}

function FetcherCell({taskId, projectId, children, intent}: FetcherProps) {
    const fetcher = useFetcher();

    const handleInput = useCallback((e: FormEvent<HTMLFormElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);
    }, [fetcher])

    return (
        <fetcher.Form method="post" onInput={handleInput} action="./:todoId">
            <input type="hidden" name="taskId" value={taskId}/>
            <input type="hidden" name="projectId" value={projectId}/>
            <input type="hidden" name="intent" value={intent}/>
            {children}
        </fetcher.Form>)
}


export default function TaskWrapper({id, task}: TaskProps) {
    const [searchParams] = useSearchParams();

    const filterDate = searchParams.get('date');
    const taskRef = useRef<HTMLSelectElement | null>(null);

    const handleTaskClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const {dataset} = e.currentTarget;
        const {task} = dataset;
        const taskCard = document.getElementById(`task-${task ?? ''}`);
        if (taskCard) {
            taskRef.current = taskCard as HTMLSelectElement;
            taskCard.classList.toggle('expand');
        }
    }, []);


    const getPriority = useCallback((priority: number) => {
        return `priority-${priority === 3 ? 'high' : (priority === 2) ? 'medium' : 'low'}`;
    }, []);

    const handleChange = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const dropdownMenu = document.getElementById(`dropdown-menu`);
        const main = document.getElementById(`main`);
        const y = JSON.stringify(e.currentTarget.getBoundingClientRect().top +  window.scrollY);
        console.log(y, scrollY);
        if (main) {
            document.body.style.overflow = 'hidden';
            sessionStorage.setItem('scrollY', y)
            window.scroll(0, Number(y));
        }
        if (dropdownMenu) {
            dropdownMenu.classList.add('open');
        }
    }, []);

    return (
        <>
            <div className="task-wrapper">
                {/* TODO: change into inputs and useFetcher */}

                <FetcherCell projectId={id} taskId={task.id} intent="status">
                    <label className={getPriority(task.priority)} htmlFor={`c-${task.id}`}>
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            id={`c-${task.id}`}
                            name={'status'}
                            disabled={task.status === 'completed'}
                            value={'completed'} required/>
                    </label>
                </FetcherCell>

                <section className={`task-info`} onClick={handleTaskClick} data-task={task.id}>
                    <h3 className="title"> {task.status !== 'completed' ? task.title :
                        <s className="strike"> {task.title} </s>}</h3>
                    {filterDate && <span className="due-time"><IoTimeOutline/> {task.dueTime}</span>}
                </section>

                <button className={`btn-${id}`} type="button" onClick={handleChange}>
                    <HiDotsVertical/>
                </button>
            </div>
        </>

    )
}