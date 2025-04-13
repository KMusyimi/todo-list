import { Suspense, useId } from "react";
import { Await, useOutletContext } from "react-router-dom";
import { MyTask } from "../api.ts";
import TasksCard from "../components/TasksCard.tsx";

interface ProjectPromise {
    projects: Promise<{
        id: string;
        tasks: MyTask[];
        projectName: string;
        updatedAt?: Date | string;
        createdAt: Date;
    }[]>
}

export default function AllTasks() {
    const { projects }: ProjectPromise = useOutletContext();
    const idStr = useId();

    function renderAllTasks(projects: {
        id: string;
        projectName: string;
        tasks: MyTask[];
    }[]) {
        return projects.map((project, idx) => {
            return <TasksCard key={ `task-${idStr + idx.toString()}` } project = { project } />
        })
    }

    return (
        <Suspense fallback= {<h1> Loading...</h1>}>
            <Await resolve={projects}>{renderAllTasks}</Await>
        </Suspense>
    );
}

