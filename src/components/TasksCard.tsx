import { JSX, useState } from "react";
import { ActionFunctionArgs } from "react-router-dom";
import { completeTask, CompleteTaskParams, deleteTask, MyTask } from "../api";
import dropDownIcon from '../assets/arrow-down.svg';
import folderIcon from '../assets/projects.svg';
import TaskWrapper from "./TaskWrapper.tsx";


interface TaskCardProps {
    project: {
        id: string | undefined;
        projectName: string | undefined;
        tasks: MyTask[] | undefined;
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export async function fetcherAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const payload: CompleteTaskParams = {};
    Object.keys(data).forEach((item) => {
        payload[item] = data[item] as string;
    })
    console.log(payload);
    switch (payload.intent) {
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


function TasksCard({ project }: TaskCardProps): JSX.Element {
    const [toggle, setToggle] = useState(false);
    const { id, projectName, tasks } = project;
   
    return (
        <>
            <div id={'task'} className={`tasks ${toggle ? 'expand' : ''}`}>

                <div className="heading-container" onClick={() => { setToggle(!toggle) }}>
                    <img className="folder-icon" src={folderIcon} alt="a greyish folder icon" />
                    <header >
                        <h2 className="project-name"> {projectName} </h2>
                        <span className="count"> {tasks?.length} </span>
                        <div className="dropdown-container">
                            <img className="dropdown-icon" src={dropDownIcon} alt="a black arrow down icon" />
                        </div>
                    </header>
                </div>
                {(tasks && tasks.length > 0) ? <>
                    {tasks.map((task) => {
                        if (task) {
                            return (
                                <div id={`task-${task.id}`} key={`list-${task.id}`} className={`task-card`}>
                                    <TaskWrapper task={task} id={id ?? ''} />
                                </div>)
                        }
                    })}
                </> : <p className="empty-task"> Currently no active tasks.</p>}
            </div>

        </>
    )

}



// {(tasks.map((task) => {
//     if (task) {
//         return (
//             <div id={`task-${task.id}`} key={`list-${task.id}`} className={`task-card`}>
//                 <TaskWrapper task={task} id={id ?? ''} />
//             </div>
/* 
<div className="info-container">
    <DueDate date={task.dueDate + 'T' + task.startTime} />
    <span className="due-time"><IoTimeOutline /> {task.startTime}</span>

    <section className="info-section">
        <DescriptionSvg />
        <p className="description"> {task.description} </p>
    </section>
    {task.notes && <section className="info-section">
        <NotesSvg />
        <p className="notes"> {task.notes} </p>
    </section>
    }
</div> */
//         )
//     }
// })}
export default TasksCard;