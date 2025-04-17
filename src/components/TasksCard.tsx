import moment from "moment";
import {JSX, useCallback, useEffect, useState} from "react";
import {ActionFunctionArgs} from "react-router-dom";
import {completeTask, CompleteTaskParams, deleteTask, MyTask} from "../api";
import dropDownIcon from '../assets/arrow-down.svg';
import calendarIcon from '../assets/calendar.svg';
import folderIcon from '../assets/projects.svg';
import {DescriptionSvg, NotesSvg} from "./Svg";
import TaskWrapper from "./TaskWrapper.tsx";


interface TaskCardProps {
    project: {
        id: string | undefined;
        projectName: string | undefined;
        tasks: MyTask[] | undefined;
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export async function fetcherAction({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const payload: CompleteTaskParams = {};
    Object.keys(data).forEach((item) => {
        payload[item] = data[item] as string;
    })
    switch (payload.intent){
        case 'status':
            await completeTask(payload);
            break;
        case 'delete':
            await deleteTask(payload.taskId);
            break;
        default:
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Response("Bad Request", { status: 400 });
    }
}


function TasksCard({project}: TaskCardProps): JSX.Element {
    const [toggle, setToggle] = useState(false);
    const {id, projectName, tasks} = project;
    return (
        <>
            <section id={'task'} className={`tasks ${toggle ? 'expand' : ''}`}>
                <header onClick={() => {
                    setToggle(!toggle)
                }}>
                    <img className="folder-icon" src={folderIcon} alt="a greyish folder icon"/>
                    <div className="heading-container">
                        <h2 className="project-name"> {projectName} </h2>
                        <span className="line"> </span>
                        <div>
                            <img className="dropdown-icon" src={dropDownIcon} alt="a black arrow down icon"/>
                            {!toggle && <span className="count"> {tasks?.length ?? 0} </span>}

                        </div>
                    </div>
                </header>
                {
                    (tasks && tasks.length > 0) ? tasks.map((task) => {
                        if(task){
                            return (
                                <div id={`task-${task.id}`} key={`list-${task.id}`} className={`task-card`}>
                                    <TaskWrapper task={task} id={id ?? ''}/>
    
                                    <div className="info-container">
                                        <DueDate date={task.dueDate + 'T' + task.dueTime}/>
    
                                        <section className="info-section">
                                            <DescriptionSvg/>
                                            <p className="description"> {task.description} </p>
                                        </section>
                                        {task.notes && <section className="info-section">
                                            <NotesSvg/>
                                            <p className="notes"> {task.notes} </p>
                                        </section>
                                        }
                                    </div>
                                </div>
                            )
                        }
                    }) : <p className="empty-task"> Currently no {projectName?.toLocaleLowerCase()} tasks.</p>
                }
            </section>
        </>

    )
}

function DueDate({date}: { date: string | Date }) {
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
        return () => {
            clearInterval(timer)
        }
    }, [date, updateDueDate]);

    return (
        <p className="due-date" style={{color: "rgb(22, 196, 127)"}}>
            <img src={calendarIcon} alt="a dark greenish calendar icon"/> Due {dueDate}
        </p>)
}


export default TasksCard;