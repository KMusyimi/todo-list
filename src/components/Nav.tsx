import { JSX, use } from "react";
import { NavLink } from "react-router-dom";
import projectIcon from '../assets/projects.svg';
import { MyProjects } from "../api";
interface NavProps {
    projects: MyProjects
};



function Render({ projects }: NavProps) {
    return projects.map((project) => {
        const { id, projectName, avatarColor,tasks } = project ?? {};
        console.log(avatarColor);
        return (
            <li key= { id }  >
                {project && <NavLink to={`${id ? id.toString() : ''}/todo`} >
                    <img src={projectIcon} alt="image of project icon" />
                    {projectName}
                    <span className="count">{tasks?.length}</span>
                </NavLink>}
            </li>);
    });
}


export default function Nav({ projectPromise }: { projectPromise: Promise<MyProjects | null> }): JSX.Element {
    const projects = use(projectPromise);
    return (
        <nav className="nav">
            <ul>
                {projects && <Render projects={projects} />}
            </ul>
        </nav>
    )
}