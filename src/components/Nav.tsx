import { CSSProperties, JSX, use } from "react";
import { NavLink } from "react-router-dom";
import { MyProjects } from "../api";
import { hexToRGB } from "../utils";
interface NavProps {
    projects: MyProjects
};


function Render({ projects}: NavProps) {

    return projects.map((project) => {
        const { id, projectName, avatarColor, tasks } = project ?? {};
        const rgba = hexToRGB(avatarColor ?? '', 0.15)
        const style = {
            backgroundColor: rgba,
            backgroundImage: `linear-gradient(90deg, ${rgba} 10%,  rgb(218, 218, 218) 25%,#F3EFEE 100%)`
        } as CSSProperties
        return (
            <li key={id}>
                {project && <NavLink to={`${id ? id.toString() : ''}/todo`}
                    style={({ isActive }) => isActive ? style : {}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="0.997817" y="0.997817" width="22.0044" height="22.0044" rx="4.98909"
                            stroke={avatarColor}
                            strokeWidth="2.11" />
                    </svg>
                    {projectName}
                </NavLink>}
                <span className="count">{tasks?.length}</span>
            </li>);
    });
}


export default function Nav({ projectPromise }: { projectPromise: Promise<MyProjects | null> }): JSX.Element {

    const projects = use(projectPromise);

    const style = {
        width: '100%',
        backgroundImage: `linear-gradient(90deg, ${hexToRGB('#328E6E', 0.25)} 10%,rgb(218, 218, 218) 25%,rgb(242, 240, 240) 100%)`
    } as CSSProperties
    

    return (
        <nav className="nav">
            <ul>
                <li>
                    <NavLink to='.' 
                        style={({ isActive }) => isActive ? style : {}}
                    end>    
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="0.997817" y="0.997817" width="22.0044" height="22.0044" rx="4.98909"
                                stroke="#328E6E"
                                strokeWidth="2.11" />
                        </svg>
                        All projects</NavLink>
                </li>
                {projects && <Render projects={projects}/>}
            </ul>
        </nav>
    )
}