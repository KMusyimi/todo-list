import {Suspense} from "react";
import {Await, LoaderFunctionArgs, useLoaderData} from "react-router-dom";
import {getProject} from "../api.ts";
import TasksWrapper from "../components/TasksWrapper.tsx";

// eslint-disable-next-line @typescript-eslint/require-await, react-refresh/only-export-components
export async function taskLoader({params}: LoaderFunctionArgs) {
    const myProject = getProject();
    return {project: myProject.project(params.id)}
}


export default function Task() {
    const {project} = useLoaderData<typeof taskLoader>();
    return (<Suspense fallback={<h1>Loading... </h1>}>
        <Await resolve={project}>{(loadedTask) => {
            const {projectName, tasks} = loadedTask ?? {};
            return <TasksWrapper projectName={projectName} tasks={tasks}/>;
        }}</Await>
    </Suspense>)
}