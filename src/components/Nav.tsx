import React, { CSSProperties, JSX, useCallback} from "react";
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
    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { id } = e.currentTarget.dataset;
        if (id) {
            const menuOvly = document.getElementById('menu-ovly');
            const optionsMenu = document.getElementById(`menu-${id}`);
            if (optionsMenu && menuOvly) {
                optionsMenu.className = 'project-menu';
                menuOvly.style.height = '100%';
            }
        }
    }, []);

    const handleCloseBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>)=> {
        e.preventDefault();
        console.log('click');
        const menuOvly = document.getElementById('menu-ovly');
        const optionMenu = document.querySelectorAll('.project-menu');
        optionMenu.forEach(item=> {

            item.classList.add('hidden');
        })
        if (menuOvly){
            menuOvly.style.height = '0';
        }
    }, [])

    return projects ? projects.map((project) => {
        const { id, projectName, iconColor, tasks } = project ?? {};
        const rgba = hexToRGB(iconColor ?? '', 0.25)

        const style = {
            background: rgba,
            backgroundImage: `linear-gradient(90deg, ${rgba} 0%,hsla(275, 19%, 88%, 1) 100%)`,
            transition: 'background 200ms linear'
        } as CSSProperties;

        return (
            <li key={id}>
                {project && <NavLink to={`${id ? id.toString() : ''}/todo`}
                    style={({ isActive }) => isActive ? style : {}}>
                    <ProjectIcon color={iconColor ?? ''} />
                    {projectName}
                </NavLink>}

                <button type="button" onClick={handleClick} data-id={id}>
                    <i>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                        </svg>
                    </i>
                </button>
                <span className="count">{tasks?.length}</span>
                <div id={`menu-${id ?? ''}`} className={"project-menu hidden"}>
                    <button className="close-btn" type="button" onClick={handleCloseBtn}><i>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </i></button>
                    <button type="button">Edit</button>
                    <button type="button">Delete</button>
                </div>
            </li>
        );
    }) : null;
}


export default function Nav({ projects, completed }: NavProps): JSX.Element {
    const rgba = hexToRGB('#328E6E', .25);
    const style = {
        background: rgba,
        width: '100%',
        backgroundImage: `linear-gradient(90deg, ${rgba} 0%,hsla(275, 19%, 88%, 1) 100%)`
    } as CSSProperties

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