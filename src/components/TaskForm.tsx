/* eslint-disable react-refresh/only-export-components */
import moment from "moment";
import { JSX, Suspense, use, useCallback, useEffect, useRef, useState} from "react";
import { ActionFunctionArgs, Form, redirect, useNavigation, useSearchParams } from "react-router-dom";
import { addTask, MyProjects } from "../api";
import RectSolidSvg from "./Svg";

interface ProjectPromise { projectPromise: Promise<MyProjects | null> }

export async function taskFormAction({ request }: ActionFunctionArgs) {
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

function ProjectsList({ projectPromise }: ProjectPromise){
    const projects = use(projectPromise);
    
    return (
    <Suspense fallback={<h1>Loading...</h1>}>
        {projects?.map(project=> {
            let projectStr = '';
            if (project?.projectName){
                projectStr = project.projectName.charAt(0).toLocaleUpperCase() + project.projectName.slice(1);

            }
            return (<option key={project?.id} value={project?.id}>{projectStr}</option>)
        })}
    </Suspense>)
}

export default function TaskForm({ projectPromise}:ProjectPromise): JSX.Element {
    const[toggle, setToggle] = useState(false);
    const formRef = useRef<HTMLFormElement>(null)
    const navigation = useNavigation();
    
    const status = navigation.state;
    const [searchParams] = useSearchParams();
    const paramDate = searchParams.get('date');

    useEffect(()=>{
        if (toggle){
            document.body.style.position = 'fixed';
        }else{
            formRef.current?.reset();
            document.body.style.position = '';
        }
    },[toggle]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>)=> {
        e.preventDefault();
        const {id} = e.currentTarget;
        if (id === 'input-wrapper'){
            setToggle(true)
        }
    },[]);   

    return (
        <>
        <div className="form-ovly"></div>
            <div id={'task-container'} className={"form-container"}>
            <Form ref={formRef} action={"/projects/add"} className={toggle?'task-form': 'task-form collapse'} replace={true} method="post" >
                    <div id="input-wrapper" className="input-container" onClick={handleClick}>
                    {toggle && <RectSolidSvg/>}
                    <label htmlFor={'title'}> Title </label>
                    <input type={'text'}
                        id={'title'}
                        name={'title'}
                        className={'form-input'}
                        placeholder={'Write a new task'}
                        required />
                    
                        {toggle && <>
                        <label htmlFor="projects">category</label>
                    <select className="bg-grey" name="projectId" id="projects" required>
                        <option value="" hidden>No list</option>
                        <ProjectsList projectPromise={projectPromise} />
                    </select>
                        </>
                    }
                </div>
                            
                <div className="duedate-container bg-grey">
                    <div>
                        <label htmlFor="dueDate">due date</label>
                        <input type={'date'}
                            id={'dueDate'}
                            name={'dueDate'}
                            className={'form-input'}
                            min={moment(paramDate ?? Date.now()).format('YYYY-MM-DD')}
                            required />

                    </div>
                    <div>
                        <label htmlFor="dueTime">due time</label>
                        <input type={'time'}
                            id={'dueTime'}
                            name={'dueTime'}
                            className={'form-input'}
                            required />
                    </div>
                </div>
                

                <div className="bg-grey">
                <fieldset>
                    <legend>Priority</legend>
                    <div className="radio-wrapper">

                        <div className={'radio-container'}>
                            <label tabIndex={0} className="label-radio" htmlFor={'high'}> High 
                            <input id={'high'} type={'radio'} name={'priority'} value={3}
                                style={{ height: '25px', width: '25px', verticalAlign: 'middle' }
                                } required />

                            </label>
                        </div>
                        <div className={'radio-container'}>
                            <label  tabIndex={0}className="label-radio" htmlFor={'medium'}> Medium 

                            <input id={'medium'} type={'radio'} name={'priority'} value={2}
                                style={{ height: '25px', width: '25px', verticalAlign: 'middle' }} />
                            </label>
                        </div>
                        <div className={'radio-container'}>
                            <label tabIndex={0} className="label-radio" htmlFor={'low'}> Low 
                            <input id={'low'} type={'radio'} name={'priority'} value={1}
                                style={{ height: '25px', width: '25px', verticalAlign: 'middle' }} />

                            </label>
                        </div>
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
                    <button type="button" onClick={()=>{setToggle(false)}}>close</button>
                <button type="submit" className="add-btn" disabled={status === 'submitting'}> Add task</button>
                </div>
            </Form>

        </div>
        </>
    )
}