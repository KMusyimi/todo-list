/* eslint-disable react-refresh/only-export-components */
import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { LoaderFunctionArgs, Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import { getProjects } from "../api.ts";
import Calendar from "../components/Calendar.tsx";
import Modal from "../components/Modal.tsx";
import Nav from "../components/Nav.tsx";
import SuccessMsg from "../components/SuccessMsg.tsx";
import { checkUserProjects } from "../utils.ts";
import TaskForm from "../components/TaskForm.tsx";


export async function projectsLoader({ request }: LoaderFunctionArgs) {
    const param = new URL(request.url).searchParams;
    const date = param.get('date');
    const userProjects = await checkUserProjects();
    userProjects.hasProjects();

    return { projects: getProjects(date ?? '') }
}


export default function TaskLayout(): JSX.Element {
    const [toggleMenu, setToggleMenu] = useState(false);
    const { projects } = useLoaderData<typeof projectsLoader>();
    const [searchParams, setSearchParams] = useSearchParams();
    const successMsg = searchParams.get('message');
    const formContainerRef = useRef<HTMLElement | null>(null);


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

    const handleScroll = useCallback(() => {
        if (formContainerRef.current) {
            if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
                formContainerRef.current.classList.add('hide');
            } else {
                formContainerRef.current.classList.remove('hide');
            }

        }
    }, [])

    useEffect(() => {
        const timer = displaySuccessMsg();
        formContainerRef.current = document.getElementById('task-container');
        

        window.addEventListener('scroll', handleScroll);

        if (toggleMenu) {
            if (formContainerRef.current) {
                formContainerRef.current.classList.add('hide');
            }
        } else {
            formContainerRef.current?.classList.remove('hide');
        }

        return () => {
            clearTimeout(timer);
            removeEventListener('scroll', handleScroll);
        }
    }, [displaySuccessMsg, handleScroll, toggleMenu]);


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
                <Nav projectPromise={projects} />
                <Modal />
            </div>
        </div>
        <main className={'main'}>
            <section className={'task-section'}>
                <Calendar />
                {successMsg && <SuccessMsg successMsg={successMsg} />}
                <Outlet context={{ projects }} />
            </section>
            <TaskForm projectPromise={projects} />
        </main>
    </>)
}