/* eslint-disable react-refresh/only-export-components */
import { FormEvent, JSX, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    Outlet,
    redirect,
    useFetcher,
    useLoaderData,
    useSearchParams
} from "react-router-dom";
import {
    ActiveDates,
    addSubTask,
    completeSubtask,
    completeTask,
    CompleteTaskParams,
    deleteTask,
    getActiveDates,
    getCompletedTasks,
    getFilteredProjects,
    getProjects
} from "../api.ts";
import Calendar from "../components/Calendar.tsx";
import DropdownMenu from "../components/DropDownMenu.tsx";
import Main from "../components/Main.tsx";
import Modal from "../components/Modal.tsx";
import Nav from "../components/Nav.tsx";
import SuccessMsg from "../components/SuccessMsg.tsx";
import TaskForm from "../components/TaskForm.tsx";
import { checkUserProjects, getDateTask } from "../utils.ts";


export type FormIntent = {
    projectId?: string;
    taskId?: string;
    intent?: string;
} | null;

interface FetcherProps {
    taskId: string;
    intent?: string;
    action?: string;
    children: ReactNode;
    className?: string;
    id?: string;
}

export async function projectsLoader({ request }: LoaderFunctionArgs) {
    const date = getDateTask(request);
    const userProjects = await checkUserProjects();
    userProjects.hasProjects();
    return {
        filteredProjects: getFilteredProjects(date),
        completed: await getCompletedTasks(),
        projects: await getProjects(),
        activeDates: await getActiveDates()
    };
}

export function FetcherCellOnInput({ taskId, children, intent, action, ...rest }: FetcherProps) {
    const fetcher = useFetcher();
    const handleInput = useCallback((e: FormEvent<HTMLFormElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);
    }, [fetcher])

    return (
        <fetcher.Form {...rest} method="post" onInput={handleInput} action={action ?? "./:todoId"
        }>
            <input id="id-input" type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="intent" value={intent} />
            {children}
        </fetcher.Form>)
}

export async function fetcherAction({ params, request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const dateParams = new URL(request.url).searchParams;
    const date = dateParams.get('date');
    const data = Object.fromEntries(formData.entries());
    const payload: CompleteTaskParams = {};

    Object.keys(data).forEach((item) => {
        payload[item] = (data[item] as string).trim();
    })
    const completeUrl = payload.date || date ? `../${payload.projectId}/todo?date=${date ?? payload.date}` : `../${payload.projectId}/todo`;

    switch (payload.intent) {
        case 'status':
            await completeTask(payload);
            return redirect(completeUrl);
        case 'delete':
            await deleteTask(payload.taskId);
            return params.id ? redirect(`/projects/${params.id}/todo`) : null;
        case 'add-subtask':
            await addSubTask(payload);
            break;
        case 'complete-subtask':
            await completeSubtask(payload);
            break;
        default:
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Response("Bad Request", { status: 400 });
    }
}

export function FetcherCellSubmit({ taskId, children, intent, action, ...rest }: FetcherProps) {
    const fetcher = useFetcher();
    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);
        e.currentTarget.reset();
    }, [fetcher])

    return (
        <fetcher.Form {...rest} method="post" onSubmit={handleSubmit} action={action ?? "./:todoId"
        }>
            <input id="id-input" type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="intent" value={intent} />
            {children}
        </fetcher.Form>)
}


export default function TaskLayout(): JSX.Element {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [toggleForm, setToggleForm] = useState(false);
    const [formIntent, setFormIntent] = useState<FormIntent>(null);
    const [modalIntent, setModalIntent] = useState<Record<string, string>>({});

    const { filteredProjects, completed, projects, activeDates } = useLoaderData<typeof projectsLoader>();

    const [activeDate, setActiveDates] = useState<ActiveDates | null | undefined>({});

    const [searchParams, setSearchParams] = useSearchParams();

    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const successMsg = searchParams.get('message');
    const completedTasks = searchParams.get('tasks');


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
        if (!toggleMenu){
            setModalIntent({});
        }
        return () => {
            clearTimeout(timer);
        }
    }, [displaySuccessMsg, toggleMenu]);


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
        if (dropdownRef.current) {
            if (dropdownRef.current.classList.contains('open')) {
                document.body.style.overflow = "";
                closeDropDownMenu(dropdownRef.current);
            }
        }
    }, []);

    const handleEditBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (dropdownRef.current) {
            const { projectId, taskId } = dropdownRef.current.dataset;
            setFormIntent({ taskId, projectId, intent: 'edit' } as FormIntent);

            setToggleForm(!toggleForm);
            closeDropDownMenu(dropdownRef.current);
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
        <div className={`menu ${toggleMenu ? 'menu-mobile--open' : ''}`
        }>
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
            < Nav projects={projects} completed={completed} setModalIntent={setModalIntent} />
            <Modal menuOpen={toggleMenu} modalIntent={modalIntent} setModalIntent={setModalIntent} />
            <div id="menu-ovly" className="menu-ovly" style={{ height: '0' }}></div>
        </div>
        <Main className={'main'}>
            <div className="task-container">
                <Calendar activeDates={activeDate} />
                {successMsg && <SuccessMsg successMsg={successMsg} />}
                <section className={'task-section'}>
                    <Outlet context={{ projects: filteredProjects, setActiveDates, activeDates }} />
                </section>
            </div>

            {!completedTasks && <TaskForm setToggleForm={setToggleForm} toggleForm={toggleForm}
                projects={projects} formIntent={formIntent} setFormIntent={setFormIntent} />}

            <DropdownMenu ref={dropdownRef} id={'dropdown-menu'} className={'dropdown-task'}>
                <button id={'edit-btn'} type={'button'} onClick={handleEditBtn}><LuPencil /><span>edit</span></button>
                < FetcherCellOnInput id={'delete-form'} taskId={formIntent?.taskId ?? ''} intent="delete">
                    <button id="delete-btn" type="submit" onClick={handleClick}><LuTrash /><span>delete</span></button>
                </FetcherCellOnInput>
            </DropdownMenu>
        </Main>

        <div className={'ovly'} onClick={handleOverlay}></div>
    </>)
}