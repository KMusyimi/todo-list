import {JSX, Suspense} from "react";
import {Await, NavLink} from "react-router-dom";
import projectIcon from '../assets/projects.svg';
import { MyTask } from "../api";


export default function Nav(props: {
    projects: Promise<{
        id: string;
        projectName: string;
        tasks: MyTask;
        createdAt: number;
        updatedAt: number;
    }[]>;}): JSX.Element {

    function renderProjects(projects: {
        id: string;
        projectName: string;
        tasks: MyTask;
        createdAt: number;
        updatedAt: number;
    }[]) {
        return projects.map((project) => {
            const {id, projectName} = project;

            return (
                <li key={id}>
                    <NavLink to={`${id.toString()}/todo`} >
                        <img src={projectIcon} alt="image of project icon"/>
                        {projectName}</NavLink>
                </li>);
        });
    }

    return (
        <>
            <nav className="nav">
                <ul>
                    <Suspense fallback={<h1>Loading</h1>}>
                        <Await resolve={props.projects}>
                            {renderProjects}
                        </Await>
                    </Suspense>
                </ul>
            </nav>
        </>
    )
}