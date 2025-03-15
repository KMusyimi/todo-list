import { JSX, Suspense } from "react";
import { Await, NavLink, useLoaderData } from "react-router-dom";
import { getProjects } from "../api";


// eslint-disable-next-line @typescript-eslint/require-await, react-refresh/only-export-components
export async function projectLoader() {
  return { projectsName: getProjects() }
}

export default function Nav(props: { closeModal: () => void; }): JSX.Element {
  const projects = useLoaderData<typeof projectLoader>();

  function renderProjects(projects: {
    projectName: string | undefined;
    createdAt: number | undefined;
    id: string;
  }[]) {
    return projects.map((project) => {
      const { id, projectName } = project;

      return (
        <li key={id}>
          <NavLink to={`${id.toString()}/todos`} onClick={props.closeModal}>{projectName}</NavLink>
        </li>);
    });
  }

  return (
    <>
      <nav className="nav">
        <ul>
          <Suspense fallback={<h1>Loading</h1>}>
            <Await resolve={projects.projectsName}>
              {renderProjects}
            </Await>
          </Suspense>
        </ul>
      </nav>
    </>
  )
}