import { Suspense, use } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { getProject } from "../api.ts";
import TasksCard from "../components/TasksCard.tsx";
import { getDateTask } from "../utils.ts";


export async function taskLoader({ params, request }: LoaderFunctionArgs) {
    const date = getDateTask(request);
    if (!params.id) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response("Bad Request", { status: 400 });
    }
    const myProject = await getProject(params.id);
    if (myProject) {
        return { project: myProject.withTasks(date) };
    }
    else {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response("Bad Request", { status: 400 });
    }
}


export default function Task() {
    const { project } = useLoaderData<typeof taskLoader>();
    const loadedTask = use(project);
    const { id, projectName, tasks } = loadedTask ?? {};
    return (
        <Suspense fallback= {<h1 > Loading... </h1>}>
            <TasksCard project={ { id, projectName, tasks } }/>
        </Suspense>)
}