import {JSX, Suspense, use} from "react";
import TasksCard from "../components/TasksCard.tsx";
import {getCompletedTasks} from "../api.ts";
import {useLoaderData} from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export function completedTaskLoader() {
    return {completedTask: getCompletedTasks()}
}

export default function Completed(): JSX.Element {
    const {completedTask} = useLoaderData<typeof completedTaskLoader>();
    const loadedProjects = use(completedTask);
    const {id, projectName, tasks} = loadedProjects ?? {};
    return (
        <Suspense fallback={<h1> Loading... </h1>}>
            <TasksCard project={{id, projectName, tasks}}/>
        </Suspense>
    )
}