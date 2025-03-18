import { JSX } from "react";
import { NavLink } from "react-router-dom";


export default function Nav(props: {
  closeModal: () => void;
  projects: {
    projectName: string | undefined;
    createdAt: number | undefined;
    id: string;
  }[]
  }
): JSX.Element {

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
          {renderProjects(props.projects)}
        </ul>
      </nav>
    </>
  )
}