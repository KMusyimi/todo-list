import { CSSProperties, JSX} from "react";
import { NavLink } from "react-router-dom";
import { CompletedTask, MyProjects } from "../api";
import { hexToRGB } from "../utils";
import { ProjectIcon } from "./Svg";
import { FaCheck } from "react-icons/fa6";

interface NavProps {
    projects: MyProjects | null;
    completed?: CompletedTask;
};


function Render({ projects }: NavProps) {
    if (!projects){
        return null;
    }
    return projects.map((project) => {
        const { id, projectName, iconColor, tasks } = project ?? {};
        const rgba = hexToRGB(iconColor ?? '', 0.35)

        const style = {
            background: 'rgba(224, 224, 224, 1)',
            backgroundImage: `linear-gradient(90deg, ${rgba} 0%,${hexToRGB(iconColor ?? '', 0.15)} 35%,  rgb(224, 224, 224) 85%)`,
            transition: 'background-color 200ms linear'
        } as CSSProperties;

        return (
            <li key={id}>
                {project && <NavLink to={`${id ? id.toString() : ''}/todo`}
                    style={({ isActive }) => isActive ? style : {}}>
                    <ProjectIcon color={iconColor ?? ''} />
                    {projectName}
                </NavLink>}
                <span className="count">{tasks?.length}</span>
            </li>);
    });
}


export default function Nav({ projects, completed }: NavProps): JSX.Element {

    const style = {
        background: 'rgba(224, 224, 224, 1)',
        width: '100%',
        backgroundImage: `linear-gradient(90deg, ${hexToRGB('#328E6E', 0.35)} 0%,${hexToRGB('#328E6E', 0.15)} 25%,rgba(218, 218, 218, 1) 75%)`
    } as CSSProperties
    console.log(projects)

    return (
        <nav className="nav">
            <ul>
                <li>
                    <NavLink to='.'
                        style={({ isActive }) => isActive ? style : {}}
                        end>
                        <ProjectIcon color="#328E6E" />
                        All projects</NavLink>
                </li>
                {projects && <Render projects={projects} />}
                <li>
                    <NavLink to={'completed'}><FaCheck />{completed?.projectName}</NavLink>
                    
                </li>
            </ul>
        </nav>
    )
}