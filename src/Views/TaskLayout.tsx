/* eslint-disable react-refresh/only-export-components */
import { FormEvent, JSX, ReactNode, use, useCallback, useEffect, useRef, useState } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";
import { LoaderFunctionArgs, Outlet, useFetcher, useLoaderData, useSearchParams } from "react-router-dom";
import {getCompletedTasks, getProjects } from "../api.ts";
import Calendar from "../components/Calendar.tsx";
import DropdownMenu from "../components/DropDownMenu.tsx";
import Modal from "../components/Modal.tsx";
import Nav from "../components/Nav.tsx";
import SuccessMsg from "../components/SuccessMsg.tsx";
import TaskForm from "../components/TaskForm.tsx";
import { checkUserProjects } from "../utils.ts";


export type FormIntent = {
    projectId?: string;
    taskId?: string;
    action?: string;
} | null;

interface FetcherProps {
    taskId: string;
    intent?: string;
    children: ReactNode;
    id?: string;
}

export async function projectsLoader({ request }: LoaderFunctionArgs) {
    const param = new URL(request.url).searchParams;
    const date = param.get('date');
    const userProjects = await checkUserProjects();
    userProjects.hasProjects();
    return { projects: getProjects(date ?? '') ,completed : await getCompletedTasks()};
}

export function FetcherCell({ taskId, children, intent, ...rest }: FetcherProps) {
    const fetcher = useFetcher();

    const handleInput = useCallback((e: FormEvent<HTMLFormElement>) => {
        console.log(e.currentTarget);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);
    }, [fetcher])

    return (
        <fetcher.Form {...rest} method="post" onInput={handleInput} action="./:todoId">
            <input id="id-input" type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="intent" value={intent} />
            {children}
        </fetcher.Form>)
}



export default function TaskLayout(): JSX.Element {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [toggleForm, setToggleForm] = useState(false);
    const [formIntent, setFormIntent] = useState<FormIntent>(null);
    
    const { projects, completed } = useLoaderData<typeof projectsLoader>();
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


    const closeDropDownMenu = (dropdown: HTMLDivElement) => {
        Object.keys(dropdown.dataset).forEach((item) => {
            if (item.match(/[A-Z][a-z]+/g)) {
                item = item.split(/(?=[A-Z])/).join('-');
            }
            dropdown.removeAttribute(`data-${item.toLowerCase()}`);
        });
        dropdown.classList.remove('open');
    }

    const handleOverlay = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dropdownMenu = dropdownRef.current;
        if (dropdownMenu) {
            if (dropdownMenu.classList.contains('open')) {
                document.body.style.overflow = "";
                closeDropDownMenu(dropdownMenu);
            }
        }
    }, []);

    const handleEditBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (dropdownRef.current) {
            const { projectId, taskId, status } = dropdownRef.current.dataset;
            if (status !== 'completed') {
                setFormIntent({ taskId, projectId, action: 'edit' } as FormIntent);
                setToggleForm(!toggleForm);
                closeDropDownMenu(dropdownRef.current);
            }
        }
    }, [toggleForm]);

    const handleClick = () => {
        if (dropdownRef.current) {
            const { taskId } = dropdownRef.current.dataset;
            setFormIntent({ taskId });
            closeDropDownMenu(dropdownRef.current);
        }
    }

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
                <Nav projects={loadedProjects} completed={completed} />
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
                projects={loadedProjects} intent={formIntent} setFormIntent={setFormIntent} />

            <DropdownMenu ref={dropdownRef} id={'dropdown-menu'} className={'dropdown-task'}>
                <button id={'edit-btn'} type={'button'} onClick={handleEditBtn}><LuPencil /><span>edit</span></button>
                <FetcherCell id={'delete-form'} taskId={formIntent?.taskId ?? ''} intent="delete">
                    <button id="delete-btn" type="submit" onClick={handleClick} ><LuTrash /><span>delete</span></button>
                </FetcherCell>
            </DropdownMenu>

        </main>
        <div className={'ovly'} onClick={handleOverlay}></div>
    </>)
}