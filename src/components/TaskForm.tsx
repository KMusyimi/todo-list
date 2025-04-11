/* eslint-disable react-refresh/only-export-components */
import moment from "moment";
import {JSX, Suspense, use, useCallback, useEffect, useRef, useState} from "react";
import {ActionFunctionArgs, Form, redirect, useNavigation} from "react-router-dom";
import {addTask, MyProjects} from "../api";
import RectSolidSvg from "./Svg";

interface ProjectPromise {
    projectPromise: Promise<MyProjects | null>
}

export async function taskFormAction({request}: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const projectId = formData.get('projectId') as string;
        await addTask(data);
        return redirect(`../${projectId}/todo?submitted=true`);

    } catch (e) {
        console.error(e)
    }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function addLoader() {
    return redirect('/projects');
}

function ProjectsList({projectPromise}: ProjectPromise) {
    const projects = use(projectPromise);

    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            {projects?.map(project => {
                let projectStr = '';
                if (project?.projectName) {
                    projectStr = project.projectName.charAt(0).toLocaleUpperCase() + project.projectName.slice(1);

                }
                return (<option key={project?.id} value={project?.id}>
                    {projectStr}</option>)
            })}
        </Suspense>)
}

export default function TaskForm({projectPromise}: ProjectPromise): JSX.Element {
    const [toggle, setToggle] = useState(false);
    const formRef = useRef<HTMLFormElement>(null)
    const navigation = useNavigation();
    const inputRef = useRef<HTMLInputElement | null>(null)

    const status = navigation.state;

    useEffect(() => {
        if (status === 'submitting') {
            formRef.current?.reset();
            setTimeout(() => {
                setToggle(false);
            }, 100);
        }
        if (toggle) {
            document.body.style.position = 'fixed';
        } else {
            formRef.current?.reset();
            document.body.style.position = '';
        }
    }, [toggle, status]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const {id} = e.currentTarget;
        if (id === 'input-wrapper') {
            setToggle(true)
        }
    }, []);


    const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 800);
    }, []);


    return (
        <>
            <div className="form-ovly"></div>
            <div id={'task-container'} className={"form-container"}>
                <Form ref={formRef} action={"/projects/add"} className={toggle ? 'task-form' : 'task-form collapse'}
                      replace={true} method="post" onTransitionEnd={handleTransitionEnd}>
                    <div id="input-wrapper" className="input-container" onClick={handleClick}>
                        {toggle ?
                            <>
                                <RectSolidSvg/>
                                <label htmlFor={'title'}> Title </label>
                                <input
                                    ref={inputRef}
                                    type={'text'}
                                    id={'title'}
                                    name={'title'}
                                    className={'form-input'}
                                    placeholder={'Write a new task'}
                                    required/>

                                <label htmlFor="projects">category</label>
                                <select className="bg-grey" name="projectId" id="projects" required>
                                    <option value="" hidden>No list</option>
                                    <ProjectsList projectPromise={projectPromise}/>
                                </select>

                            </> : <span>Write a new task</span>}

                    </div>

                    <div className="duedate-container bg-grey">
                        <div>
                            <label htmlFor="dueDate">due date</label>
                            <input type={'date'}
                                   id={'dueDate'}
                                   name={'dueDate'}
                                   placeholder="MM/DD/YYY"
                                   className={'form-input'}
                                   min={moment().format('YYYY-MM-DD')}
                                   required/>

                        </div>
                        <div>
                            <label htmlFor="dueTime">due time</label>
                            <input type={'time'}
                                   id={'dueTime'}
                                   name={'dueTime'}
                                   placeholder="--:-- --"
                                   className={'form-input'}
                                   required/>
                        </div>
                    </div>

                    <div className="bg-grey">
                        <fieldset>
                            <legend>Priority</legend>
                            <div className="radio-wrapper">
                                <label className="label-radio" htmlFor={'high'}> High
                                    <input id={'high'} type={'radio'} name={'priority'} value={3} required/>
                                </label>
                                <label className="label-radio" htmlFor={'medium'}> Medium
                                    <input id={'medium'} type={'radio'} name={'priority'} value={2}/>
                                </label>
                                <label className="label-radio" htmlFor={'low'}> Low
                                    <input id={'low'} type={'radio'} name={'priority'} value={1}/>
                                    </label>
                            </div>
                        </fieldset>


                    </div>

                    <label htmlFor={'description'}> Description </label>
                    <textarea id={'description'}
                              name={'description'}
                              className={'form-textarea'}
                              placeholder={'Write a brief description...'}
                              maxLength={250} required
                    > </textarea>
                    {/* <label htmlFor={'notes'}> Notes </label>
                <textarea id={'notes'}
                    name={'notes'}
                    className={'form-textarea'}
                    placeholder={'Write a brief note...'}
                    maxLength={100}
                > </textarea> */}
                    <div className="btn-container">
                        <button type="button" onClick={() => {
                            setToggle(false)
                        }}>close
                        </button>
                        <button type="submit" className="add-btn"
                                disabled={status === 'submitting'}> {status === 'submitting' ? 'Submitting..' : 'Add'}</button>
                    </div>
                </Form>

            </div>
        </>
    )
}