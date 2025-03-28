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
    const idStr = useId();

    function renderAllTasks(projects: {
        id: string;
        projectName: string;
        tasks: MyTask;
    }[]) {
        return projects.map((project, idx) => {
            const {id, projectName, tasks} = project;
            return <TasksWrapper key={`task-${idStr + idx.toString()}`} id={id} projectName={projectName} tasks={tasks} />
        })
    }

    return (
        <Suspense fallback={<h1> Loading...</h1>}>
            <Await resolve={projects}>{renderAllTasks}</Await>
        </Suspense>
    );
}

