import {JSX} from "react";
import checkboxIcon from "../assets/checkbox.svg";
import {MyTask} from "../api";


function TasksWrapper({projectName, tasks}: { projectName: string | undefined, tasks: MyTask | undefined }): JSX.Element {
    return (
        <section className={'tasks'}>
            <header>
                <h2 className="project-name"> {projectName} </h2>
            </header>
            <ul>
                {
                    tasks && tasks.length > 0 ? tasks.map((task, idx) => {
                        return (
                            <li key={`list-${idx.toString()}`}>
                                <img src={checkboxIcon} alt="greyish checkbox icon"/>
                                <h3 className="title"> {task.title} </h3>
                            </li>)
                    }) : <span>Currently no {projectName} tasks.</span>
                }
            </ul>
        </section>)
}

export default TasksWrapper;