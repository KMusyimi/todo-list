import { CSSProperties, JSX, use } from "react";
import { NavLink } from "react-router-dom";
import { MyProjects } from "../api";
import { hexToRGB } from "../utils";
import { ProjectIcon } from "./Svg";
interface NavProps {
    projects: MyProjects
};


function Render({ projects }: NavProps) {

    return projects.map((project) => {
        const { id, projectName, iconColor, tasks } = project ?? {};
        const rgba = hexToRGB(iconColor ?? '', 0.05)
        
        const style = {
            backgroundColor: rgba,
            backgroundImage: `linear-gradient(90deg, ${rgba} 0%,${rgba} 45%,  rgba(218, 218, 218, .45) 80%,rgba(218, 218, 218, 1) 100%)`,
            transition: 'background-color 200ms linear'
        } as CSSProperties;

        return (
            <li key={id}>
                {project && <NavLink to={`${id ? id.toString() : ''}/todo`}
                    style={({ isActive }) => isActive ? style : {}}>
                    <ProjectIcon color={iconColor ?? ''}/>
                    {projectName}
                </NavLink>}
                <span className="count">{tasks?.length}</span>
            </li>);
    });
}


export default function Nav({ projectPromise }: { projectPromise: Promise<MyProjects | null> }): JSX.Element {

    const projects = use(projectPromise);

    const style = {
        backgroundColor: hexToRGB('#328E6E', 0.05),
        width: '100%',
        backgroundImage: `linear-gradient(90deg, ${hexToRGB('#328E6E', 0.15)} 0%,${hexToRGB('#328E6E', 0.15)} 45%,rgba(218, 218, 218, .45) 80%,rgba(218, 218, 218, 1) 100%)`
    } as CSSProperties


    return (
        <nav className="nav">
            <ul>
                <li>
                    <NavLink to='.'
                        style={({ isActive }) => isActive ? style : {}}
                        end>
                        <ProjectIcon color="#328E6E"/>
                        All projects</NavLink>
                </li>
                {projects && <Render projects={projects} />}
            </ul>
        </nav>
    )
}