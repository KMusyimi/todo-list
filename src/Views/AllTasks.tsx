import { Suspense, useEffect, useId } from "react";
import { Await, useOutletContext } from "react-router-dom";
import { ActiveDates, MyTask } from "../api.ts";
import TasksCard from "../components/TasksCard.tsx";

interface ContextParams {
    projects: Promise<{
        id: string;
        tasks: MyTask[];
        projectName: string;
        updatedAt?: Date | string;
        createdAt: Date;
    }[]>;    
    setActiveDatesHelper: (dates: ActiveDates | null | undefined) => void;
    activeDates :ActiveDates | null | undefined;
}

export default function AllTasks() {
    const { projects, activeDates, setActiveDatesHelper }: ContextParams = useOutletContext();
    const idStr = useId();

    useEffect(()=> {
       setActiveDatesHelper(activeDates)
    }, [activeDates, setActiveDatesHelper]);

    function renderAllTasks(projects: {
        id: string;
        projectName: string;
        tasks: MyTask[];
    }[]) {
        if (projects.length  === 0){
            return <TasksCard project={{id: '',projectName: 'No Lists', tasks:[]}}/>
        }
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

