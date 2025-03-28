import {JSX, Suspense, use} from "react";
import { NavLink} from "react-router-dom";
import projectIcon from '../assets/projects.svg';
import { MyTask } from "../api";
interface NavProps{
    projects: Promise<{
        id: string;
        projectName: string;
        tasks: MyTask;
        createdAt: number;
        updatedAt: number;
    }[]>;
}
interface LoadedProjectsProps{
    projects: {
        id: string;
        projectName: string;
        tasks: MyTask;
        createdAt: number;
        updatedAt: number;
    }[]
};

function RenderProjects({projects}: LoadedProjectsProps) {
    return projects.map((project) => {
        const { id, projectName } = project;
        return (
            <li key= { id } >
                <NavLink to={ `${id.toString()}/todo` } >
                    <img src={ projectIcon } alt = "image of project icon" />
                    { projectName }
                </NavLink>
            </li>);
});
    }


export default function Nav({projects}:NavProps): JSX.Element {
    const loadedProjects = use(projects);
    return (
        <nav className="nav">
            <ul>
                <Suspense fallback={<h1>Loading</h1>}>
                    <RenderProjects projects={loadedProjects}/>
                </Suspense>
            </ul>
        </nav>
    )
}