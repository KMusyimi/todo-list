import { Suspense, use, useEffect } from "react";
import { LoaderFunctionArgs, useLoaderData, useOutletContext } from "react-router-dom";
import { ActiveDates, getActiveDates, getProject } from "../api.ts";
import TasksCard from "../components/TasksCard.tsx";
import { getDateTask } from "../utils.ts";

interface ContextParams{
    setActiveDates: (value: React.SetStateAction<ActiveDates | null | undefined>)=> void
}

// eslint-disable-next-line react-refresh/only-export-components
export async function taskLoader({ params, request }: LoaderFunctionArgs) {
    const date = getDateTask(request);
    if (!params.id) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response("Bad Request", { status: 400 });
    }
    const myProject = await getProject(params.id);
    if (myProject) {
        return { project: myProject.filteredTask(date), activeDates: await getActiveDates(params.id) };
    }
    else {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response("Bad Request", { status: 400 });
    }
}

// setModalIntent: (value: React.SetStateAction<Record<string, string>>) => void;
// 
export default function Task() {
    const { project, activeDates } = useLoaderData<typeof taskLoader>();
    const { setActiveDates }: ContextParams = useOutletContext();

    const loadedTask = use(project);
    const { id, projectName, tasks } = loadedTask ?? {};
    useEffect(() => {
        if(activeDates){
            setActiveDates(activeDates)
        }
    }, [activeDates, setActiveDates]);

    return (
        <Suspense fallback={<h1> Loading... </h1>}>
            <TasksCard project={{ id, projectName, tasks }} />
        </Suspense>)
}