/* eslint-disable react-refresh/only-export-components */
import { JSX, useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link, Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import { getProjects } from "../api.ts";
import Calendar from "../components/Calendar.tsx";
import Modal from "../components/Modal.tsx";
import Nav from "../components/Nav.tsx";
import SuccessMsg from "../components/SuccessMsg.tsx";
import { checkUserProjects } from "../utils.ts";
import TaskForm from "../components/TaskForm.tsx";


export async function allTasksLoader() {
    const userProjects = await checkUserProjects();
    userProjects.hasProjects();
    return { projects: getProjects() }
}


export default function TaskLayout(): JSX.Element {
    const [displayModal, setDisplayModal] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);
    const { projects } = useLoaderData<typeof allTasksLoader>();
    const [toggleForm, setToggleForm] = useState(false);
    
    const closeModal = useCallback(()=> {
        if (displayModal) {setDisplayModal(!displayModal);}
    }, [displayModal])
    

    const [searchParams, setSearchParams] = useSearchParams();
    const successMsg = searchParams.get('message');
    const submitted = searchParams.get('submitted');
    
    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (successMsg) {
            timer = setTimeout(() => {
                setSearchParams(prev => {
                    prev.delete('message');
                    return prev
                });
            }, 5000);
        }
        if (submitted){
            setToggleForm(!toggleForm);
            setSearchParams((prev)=> {
                prev.delete('submitted');
                return prev;
            })
        }
        return () => {
            clearTimeout(timer);
        }
    }, [setSearchParams, submitted, successMsg, toggleForm]);
    

    return (<>
        <div className={`menu menu-mobile ${toggleMenu ? 'menu-mobile--open' : ''}`}>
            <button type="button" className={`menu-btn ${toggleMenu ? 'open' : ''} `}
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
            <div>
                <div className="project-link--wrapper">
                    <Link to='/projects'>My Projects</Link>
                </div>

                <Nav projects={projects} />
                <button
                    id={'add-project'}
                    className={'add-btn'}
                    type={'button'}
                    onClick={() => {
                        setDisplayModal(true)
                    }}><FaPlus />Create new project
                </button>
            </div>
        </div>
        <main className={'main'}>
            <section className={'todo-section'}>
                <Calendar />
                {successMsg && <SuccessMsg successMsg={successMsg} />}
                <Outlet context={{ projects }} />
            </section>
            <div className="todo-btn-wrapper">
                <button type="button" 
                className={toggleMenu ?"add-btn hidden": 'add-btn'}
                onClick={()=>{setToggleForm(!toggleForm)}}><FaPlus className={toggleForm ? "icon close-icon": 'icon'} /> {toggleForm?'Close form':'Create new task'}</button>
            </div>
            
            {toggleForm && <TaskForm projects={projects}/>}
        </main>
        {displayModal && <Modal closeModal={closeModal} />}
    </>)
}