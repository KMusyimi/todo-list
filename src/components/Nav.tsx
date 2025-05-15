import React, { CSSProperties, FormEvent, JSX, useCallback, useState } from "react";
import { NavLink, useFetcher } from "react-router-dom";
import { CompletedTask, MyProject, MyProjects } from "../api";
import { hexToRGB } from "../utils";
import { ProjectIcon } from "./Svg";
import { FaCheck } from "react-icons/fa6";
import { LuTrash } from "react-icons/lu";

interface NavProps {
    setModalIntent: (value: React.SetStateAction<Record<string, string>>) => void;
    projects: MyProjects | null;
    completed?: CompletedTask;
};


function Render({ projects, setModalIntent }: NavProps) {
    const [toggleItems, setToggleItems] = useState<Record<number, boolean>>({});
    const fetcher = useFetcher();
    const closeOptionMenu = useCallback((idx: number) => {
        const overlay = document.getElementById('menu-ovly');
        setToggleItems(prevState => ({
            ...prevState,
            [idx]: !prevState[idx]
        }));
        if (overlay) {
            overlay.style.height = '0%';
        }
    }, []);

    const handleToggleOptions = useCallback((idx: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const overlay = document.getElementById('menu-ovly');
        if (overlay) {
            overlay.style.height = !toggleItems[idx] ? '100%' : '0%';
        }
        if (toggleItems[idx]) {
            setModalIntent({ intent: 'add', projectName: '', iconColor: '' });
        }
        setToggleItems(prevState => ({
            ...prevState,
            [idx]: !prevState[idx]
        }));

    }, [setModalIntent, toggleItems]);

    const handleEditBtn = useCallback((project: MyProject, idx: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (project) {
            const { id, projectName, iconColor } = project;
            setModalIntent({ intent: 'edit', id, projectName, iconColor });
        }
        closeOptionMenu(idx);
    }, [closeOptionMenu, setModalIntent]);



    const handleSubmit = useCallback((idx: number) => (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);
        setModalIntent({ intent: 'add', projectName: '', iconColor: '' });
        closeOptionMenu(idx)
    }, [closeOptionMenu, fetcher, setModalIntent])


    return projects ? projects.map((project, idx) => {
        const { id, projectName, iconColor, tasks } = project ?? {};
        const rgba = hexToRGB(iconColor ?? '', 0.15)

        const style = {
            background: rgba,
            backgroundImage: `linear-gradient(90deg, ${rgba} 0%,hsla(275, 19%, 88%, 1) 100%)`,
        } as CSSProperties;

        return (
            <li key={id}>
                <NavLink to={`${id ? id.toString() : ''}/todo`}
                    style={({ isActive }) => isActive ? style : {}}>
                    <ProjectIcon color={iconColor ?? ''} />
                    {projectName}
                </NavLink>
                <button type="button" onClick={handleToggleOptions(idx)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                    </svg>
                </button>
                <span className="count">{tasks?.length}</span>
                {toggleItems[idx] && <div id={`menu-${id ?? ''}`} className={"project-menu"}>
                    <button className="close-btn" type="button" onClick={handleToggleOptions(idx)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <button type="button" onClick={handleEditBtn(project, idx)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit</button>
                    <fetcher.Form method="post" action="/" onSubmit={handleSubmit(idx)}>
                        <input type="hidden" name="intent" value={'delete'} />
                        <input type="hidden" name="id" value={id} />
                        <button className="delete-btn" type="submit"><LuTrash />Delete</button>
                    </fetcher.Form>

                </div>}
            </li>
        );
    }) : null;
}


export default function Nav({ projects, completed, setModalIntent }: NavProps): JSX.Element {
    const rgba = hexToRGB('#328E6E', .15);
    const style = {
        background: rgba,
        width: '100%',
        backgroundImage: `linear-gradient(90deg, ${rgba} 0%,hsla(275, 19%, 88%, 1) 100%)`
    } as CSSProperties;

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
                {projects && <Render projects={projects} setModalIntent={setModalIntent} />}
                <li>
                    <NavLink to={'/projects/completed?tasks=completed'}><FaCheck />{completed?.projectName}</NavLink>
                </li>
            </ul>
        </nav>
    )
}