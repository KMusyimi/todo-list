/* eslint-disable react-refresh/only-export-components */
import { FormEvent, JSX, ReactNode, use, useCallback, useEffect, useRef, useState } from "react";
import { LuPencil } from "react-icons/lu";
import { PiTrashSimpleBold } from "react-icons/pi";
import { LoaderFunctionArgs, Outlet, useFetcher, useLoaderData, useSearchParams } from "react-router-dom";
import { getProjects} from "../api.ts";
import Calendar from "../components/Calendar.tsx";
import DropdownMenu from "../components/DropDownMenu.tsx";
import Modal from "../components/Modal.tsx";
import Nav from "../components/Nav.tsx";
import SuccessMsg from "../components/SuccessMsg.tsx";
import TaskForm from "../components/TaskForm.tsx";
import { checkUserProjects } from "../utils.ts";


export type FormIntent = {
    projectId: string;
    taskId: string;
    action: string;
} | null;

interface FetcherProps {
    taskId: string;
    intent?: string;
    children: ReactNode;
}

export async function projectsLoader({ request }: LoaderFunctionArgs) {
    const param = new URL(request.url).searchParams;
    const date = param.get('date');
    const userProjects = await checkUserProjects();
    userProjects.hasProjects();
    return { projects: getProjects(date ?? '') };
}

export function FetcherCell({ taskId, children, intent }: FetcherProps) {
    const fetcher = useFetcher();

    const handleInput = useCallback((e: FormEvent<HTMLFormElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);
    }, [fetcher])

    return (
        <fetcher.Form method="post" onInput={handleInput} action="./:todoId">
            <input type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="intent" value={intent} />
            {children}
        </fetcher.Form>)
}



export default function TaskLayout(): JSX.Element {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [toggleForm, setToggleForm] = useState(false);
    const [formIntent, setFormIntent]= useState<FormIntent>(null);

    const { projects } = useLoaderData<typeof projectsLoader>();
    const loadedProjects = use(projects);

    const [searchParams, setSearchParams] = useSearchParams();

    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const successMsg = searchParams.get('message');


    const displaySuccessMsg = useCallback(() => {
        if (successMsg) {
            return setTimeout(() => {
                setSearchParams(prev => {
                    prev.delete('message');
                    return prev
                });
            }, 5000);
        }
    }, [setSearchParams, successMsg]);

    
    useEffect(() => {
        const timer = displaySuccessMsg();
       
        return () => {
            clearTimeout(timer);
        }
    }, [displaySuccessMsg, toggleForm]);

    const handleDropDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dropdownMenu = dropdownRef.current;
        if (dropdownMenu) {
            if (dropdownMenu.classList.contains('open')) {
                document.body.style.overflow = "";
                const scrollY = sessionStorage.getItem("scrollY");
                dropdownMenu.removeAttribute('data-task-id');
                dropdownMenu.removeAttribute('data-project-id');

                if (scrollY) {
                    window.scroll(0, Number(scrollY));
                }
                dropdownMenu.classList.remove('open');
            }
        }
    }, []);

    const handleEditBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (dropdownRef.current) {
            const { projectId, taskId, status } = dropdownRef.current.dataset;
            if (status !== 'completed'){
                setFormIntent({taskId, projectId, action: 'edit'} as FormIntent);
                setToggleForm(!toggleForm);
                dropdownRef.current.removeAttribute('data-task-id');
                dropdownRef.current.removeAttribute('data-project-id');
                dropdownRef.current.removeAttribute('data-status');
                dropdownRef.current.classList.toggle('open');
            }
        }
    }, [toggleForm]);
    const handleDeleteBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (dropdownRef.current) {
            const {taskId} = dropdownRef.current.dataset;
            setFormIntent({taskId, projectId: '', action: 'delete'} as FormIntent);
        }
    }, []);
    
    return (<>
        <div className={`menu menu-mobile ${toggleMenu ? 'menu-mobile--open' : ''}`}>
            <button type="button" className={`menu-btn ${toggleMenu ? 'expand' : ''} `}
                onClick={() => {
                    setToggleMenu(!toggleMenu)
                }}
                aria-label={'Main Menu button'}>
                <svg viewBox="0 0 100 100" style={{ width: '35px', height: '32px' }}>
                    <path className="line line1"
                        d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                    <path className="line line2" d="M 20,50 H 80" />
                    <path className="line line3"
                        d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                </svg>
            </button>
            <div className="menu-container">
                <Nav projects={loadedProjects} />
                <Modal />
            </div>
        </div>

        <main className={'main'} id={'main'}>
            <div className="task-container">
                <Calendar />
                {successMsg && <SuccessMsg successMsg={successMsg} />}
                <section className={'task-section'}>
                    <Outlet context={{ projects }} />
                </section>
            </div>

            <TaskForm setToggleForm={setToggleForm} toggleForm={toggleForm} 
            projects={loadedProjects} intent={formIntent} setFormIntent={setFormIntent}/>

            <DropdownMenu ref={dropdownRef} id={'dropdown-menu'} className={'dropdown-task'}>
                 <button id={'edit-btn'} type={'button'} onClick={handleEditBtn}><LuPencil /><span>edit</span></button>
                <button type={'button'} onClick={handleDeleteBtn}><PiTrashSimpleBold /><span>delete</span></button>
            </DropdownMenu>

        </main>
        <div className={'ovly'} onClick={handleDropDown}></div>
    </>)
}