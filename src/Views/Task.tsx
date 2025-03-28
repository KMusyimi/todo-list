import {Suspense, use} from "react";
import {LoaderFunctionArgs, useLoaderData} from "react-router-dom";
import {getProject} from "../api.ts";
import TasksWrapper from "../components/TasksWrapper.tsx";

// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/require-await
export async function taskLoader({params}: LoaderFunctionArgs) {
    const myProject = getProject();
    return {project: myProject.project(params.id)}
}


export default function Task() {
    const {project} = useLoaderData<typeof taskLoader>();
    const loadedTask = use(project);
    const {id, projectName, tasks} = loadedTask ?? {};
    return (
        <Suspense fallback={<h1> Loading... </h1>}>
            <TasksWrapper id={id} projectName={projectName} tasks={tasks}/>
        </Suspense>)
}