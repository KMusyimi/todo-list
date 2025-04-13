/* eslint-disable react-refresh/only-export-components */
import {JSX, useCallback, useEffect, useState} from "react";
import {LoaderFunctionArgs, Outlet, useLoaderData, useSearchParams} from "react-router-dom";
import {getProjects} from "../api.ts";
import Calendar from "../components/Calendar.tsx";
import Modal from "../components/Modal.tsx";
import Nav from "../components/Nav.tsx";
import SuccessMsg from "../components/SuccessMsg.tsx";
import {checkUserProjects} from "../utils.ts";
import TaskForm from "../components/TaskForm.tsx";
import DropdownMenu from "../components/DropDownMenu.tsx";
import {LuPencil} from "react-icons/lu";
import {PiTrashSimpleBold} from "react-icons/pi";


export async function projectsLoader({request}: LoaderFunctionArgs) {
    const param = new URL(request.url).searchParams;
    const date = param.get('date');
    const userProjects = await checkUserProjects();
    userProjects.hasProjects();

    return {projects: getProjects(date ?? '')}
}


export default function TaskLayout(): JSX.Element {
    const [toggleMenu, setToggleMenu] = useState(false);
    const {projects} = useLoaderData<typeof projectsLoader>();
    const [searchParams, setSearchParams] = useSearchParams();
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
    }, [displaySuccessMsg]);

    const handleDropDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dropdown = document.getElementById(`dropdown-menu`);
        const main = document.getElementById(`main`);
        if (dropdown && main) {
            if (dropdown.classList.contains('open')) {
                document.body.style.overflow = "";
                const scrollY = sessionStorage.getItem("scrollY");
                if (scrollY) {
                    window.scroll(0, Number(scrollY));
                }
                dropdown.classList.remove('open');
            }
        }
    }, [])
    return (<>
        <div className={`menu menu-mobile ${toggleMenu ? 'menu-mobile--open' : ''}`}>
            <button type="button" className={`menu-btn ${toggleMenu ? 'expand' : ''} `}
                    onClick={() => {
                        setToggleMenu(!toggleMenu)
                    }}
                    aria-label={'Main Menu button'}>
                <svg viewBox="0 0 100 100" style={{width: '35px', height: '32px'}}>
                    <path className="line line1"
                          d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"/>
                    <path className="line line2" d="M 20,50 H 80"/>
                    <path className="line line3"
                          d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"/>
                </svg>
            </button>
            <div className="menu-container">
                <Nav projectPromise={projects}/>
                <Modal/>
            </div>
        </div>

        <main className={'main'} id={'main'}>
            <section className={'task-section'}>
                <Calendar/>
                {successMsg && <SuccessMsg successMsg={successMsg}/>}
                <Outlet context={{projects}}/>
            </section>
                <DropdownMenu id={'dropdown-menu'} className={'dropdown-task'}>
                    <button type={'button'}><LuPencil/><span>edit</span></button>
                    <button type={'button'}><PiTrashSimpleBold/><span>delete</span></button>
                </DropdownMenu>
            {!toggleMenu && <TaskForm projectPromise={projects}/>}
        </main>
        <div className={'ovly'} onClick={handleDropDown}></div>
    </>)
}