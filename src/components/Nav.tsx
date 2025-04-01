import { JSX } from "react";
import { NavLink } from "react-router-dom";
import projectIcon from '../assets/projects.svg';
import { Project } from "../api";
interface NavProps {
    projectNames: Project[] | null
}


function Render({ projectNames }: NavProps) {
    if (!projectNames) { console.error('no project names'); }
    return projectNames?.map((project) => {
        const { id, projectName } = project;
        return (
            <li key={id} >
                <NavLink to={`${id.toString()}/todo`} >
                    <img src={projectIcon} alt="image of project icon" />
                    {projectName}
                </NavLink>
            </li>);
    });
}


export default function Nav({ projectNames }: NavProps): JSX.Element {
    return (
        <nav className="nav">
            <ul>
                {projectNames?<Render projectNames={projectNames} />: <span>no projects available</span>}
            </ul>
        </nav>
    )
}