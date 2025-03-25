import {Suspense, useId} from "react";
import {Await, useOutletContext} from "react-router-dom";
import {MyTask} from "../api.ts";
import TasksWrapper from "../components/TasksWrapper.tsx";


export default function AllTasks() {
    const {projects}: {
        projects: Promise<{
            id: string;
            projectName: string;
            tasks: MyTask;
            createdAt: Date;
            updatedAt: Date;
        }[]>
    } = useOutletContext();
    const id = useId();

    function renderAllTasks(projects: {
        id: string;
        projectName: string;
        tasks: MyTask;
    }[]) {
        return projects.map((project, idx) => {
            const {projectName, tasks} = project;
            return <TasksWrapper key={`task-${id + idx.toString()}`} projectName={projectName} tasks={tasks} cls=""/>
        })
    }

    return (
        <Suspense fallback={< h1> Loading...</h1>}>
            <Await resolve={projects}>{renderAllTasks}</Await>
        </Suspense>
    );
}

