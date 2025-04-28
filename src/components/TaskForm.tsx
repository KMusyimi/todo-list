/* eslint-disable react-refresh/only-export-components */
import moment from "moment";
import { JSX, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ActionFunctionArgs, Form, redirect, useNavigation } from "react-router-dom";
import { addTask, MyProject, MyProjects, TaskRecordParams, updateTask } from "../api";
import { FormIntent } from "../Views/TaskLayout";
import RectSolidSvg from "./Svg";

interface FormProps {
    toggleForm?: boolean;
    setToggleForm: (value: React.SetStateAction<boolean>) => void;
    projects?: MyProjects | null | undefined;
    intent?: FormIntent;
    setFormIntent: (value: React.SetStateAction<FormIntent>) => void;
}

interface SelectProps {
    projects?: MyProjects | null;
}


export async function taskFormAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const payload: TaskRecordParams = {};
        const data = Object.fromEntries(formData);
        const projectId = formData.get('projectId') as string;
        Object.keys(data).forEach((item) => {
            payload[item] = data[item] as string;
        });

        switch (payload.intent) {
            case 'edit':
                await updateTask(payload);
                break;
            case 'add':
                await addTask(payload);
                break;
            default:
                // eslint-disable-next-line @typescript-eslint/only-throw-error
                throw new Response("Bad Request", { status: 400 });
        }

        return redirect(`../${projectId}/todo?date=${payload.dueDate}`);

    } catch (e) {
        console.error(e);
    }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function addLoader() {
    return redirect('/projects');
}

function ProjectsList({ projects }: SelectProps) {
    return (
        <Suspense fallback={<h1> Loading...</h1>}>
            {
                projects?.map(project => {
                    let projectStr = '';
                    if (project?.projectName) {
                        projectStr = project.projectName.charAt(0).toLocaleUpperCase() + project.projectName.slice(1);
                    }
                    return (<option key={project?.id} value={project?.id}>
                        {projectStr} </option>)
                })}
        </Suspense>);
}

export default function TaskForm({ toggleForm, setToggleForm, projects, intent, setFormIntent }: FormProps): JSX.Element {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const task: MyProject = {
        id: "",
        projectName: "",
        iconColor: "",
        tasks: [{
            projectId: '',
            id: '',
            title: '',
            status: 'active',
            dueDate: moment().format('YYYY-MM-DD'),
            dueTime: '00:00:00',
            priority: '',
            description: '',
            createdAt: '',
        }],
        createdAt: ""
    };

    const [formState, setFormState] = useState<MyProject>(task);
    const formRef = useRef<HTMLFormElement>(null);

    const navigation = useNavigation();
    const inputRef = useRef<HTMLInputElement | null>(null)

    const status = navigation.state;


    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (intent) {
            let task;
            const { action, projectId, taskId } = intent;
            if (action === 'edit') {
                const regxp = new RegExp(`^.*${taskId ?? ''}.*$`);
                if (projects) {
                    const projectsCopy = [...projects]
                    for (const project of projectsCopy) {
                        if (project?.id === projectId) {
                            const tasks = project?.tasks.filter(task => regxp.test(task?.id ?? ''));
                            task = { ...project, tasks } as MyProject;
                        }
                    }
                    if (task) {
                        setFormState(task);
                    }
                }
            }
        }
        return () => {
            clearTimeout(timer);
        }
    }, [status, toggleForm, setToggleForm, intent, projects]);

    const closeForm = useCallback(() => {
        setFormState(prev => { prev = task; return prev });
        document.body.style.overflow = '';
        document.body.style.position = '';
        setFormIntent({} as FormIntent);

        setToggleForm(prev => {
            if (prev) {
                prev = !prev;
            }
            return prev
        });
    }, [setFormIntent, setToggleForm, task]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const { id } = e.currentTarget;
        if (id === 'input-wrapper') {
            document.body.style.overflow = 'hidden';
            setToggleForm(true);
        }
    }, [setToggleForm]);

    const handleOnInput = useCallback((e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
        setFormState((prev) => ({
            ...prev,
            tasks: [{ ...prev?.tasks[0], [name]: value }]
        } as unknown as MyProject));
    }, []);

    const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 600);
    }, []);

    const handleCloseBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        closeForm();
    }, [closeForm]);

    const handleSubmit = useCallback(() => {
        closeForm();
    }, [closeForm]);
    return (
        <>
            <div className={'form-container'}>
                <Form ref={formRef}
                    action={"add"}
                    className={toggleForm ? 'task-form' : 'task-form collapse'}
                    method="post"
                    onSubmit={handleSubmit}
                    onTransitionEnd={handleTransitionEnd}>
                    <input type="hidden" name="intent" value={intent?.action ?? 'add'} />
                    <input type="hidden" name="status" value={'active'} />
                    {intent?.action === 'edit' && <input type="hidden" name="id" value={intent.taskId ?? ''} />}

                    <div id="input-wrapper" className="input-container" onClick={handleClick}>
                        {

                            toggleForm ?
                                <>
                                    <RectSolidSvg />
                                    <label htmlFor={'title'}> Title </label>
                                    <input
                                        ref={inputRef}
                                        type={'text'}
                                        id={'title'}
                                        name={'title'}
                                        className={'form-input'}
                                        placeholder={'Write a new task'}
                                        value={formState?.tasks[0]?.title}
                                        onInput={handleOnInput}
                                        required />

                                    <label htmlFor="projects"> category </label>
                                    <select className="bg-grey" name="projectId" id="projects" onInput={handleOnInput} required>
                                        {
                                            intent?.action === 'edit' ? <option value={formState?.id}> {formState?.projectName} </option> :
                                                <>
                                                    <option value="" hidden> No list</option>
                                                    <ProjectsList projects={projects} />
                                                </>
                                        }
                                    </select>
                                </> : <span>Write a new task</span>}

                    </div>

                    <div className="dueDate-container bg-grey">
                        <div>
                            <label htmlFor="dueDate"> due date </label>
                            <input type={'date'}
                                id={'dueDate'}
                                name={'dueDate'}
                                placeholder="mm/dd/yyyy"
                                className={'form-input'}
                                min={moment().format('YYYY-MM-DD')}
                                value={formState?.tasks[0]?.dueDate}
                                onInput={handleOnInput}
                                required />

                        </div>
                        <div>
                            <label htmlFor="dueTime"> due time </label>
                            <input type={'time'}
                                id={'dueTime'}
                                name={'dueTime'}
                                placeholder="--:-- --"
                                className={'form-input'}
                                value={formState?.tasks[0]?.dueTime}
                                onInput={handleOnInput}
                                required />
                        </div>
                    </div>

                    <div className="bg-grey">
                        <fieldset>
                            <legend>Priority</legend>
                            <div className="radio-wrapper">
                                <label className="label-radio" htmlFor={'high'}> High
                                    <input id={'high'} type={'radio'} name={'priority'}
                                        checked={formState?.tasks[0]?.priority === '3'}
                                        onChange={handleOnInput}
                                        value={3}
                                        required />
                                </label>
                                <label className="label-radio" htmlFor={'medium'}> Medium
                                    <input id={'medium'} type={'radio'} name={'priority'}
                                        checked={formState?.tasks[0]?.priority === '2'}
                                        onChange={handleOnInput}
                                        value={2} />
                                </label>
                                <label className="label-radio" htmlFor={'low'}> Low
                                    <input id={'low'} type={'radio'} name={'priority'}
                                        checked={formState?.tasks[0]?.priority === '1'}
                                        onChange={handleOnInput}
                                        value={1} />
                                </label>
                            </div>
                        </fieldset>

                    </div>

                    <label htmlFor={'description'}> Description </label>
                    <textarea id={'description'}
                        name={'description'}
                        className={'form-textarea'}
                        placeholder={'Write a brief description...'}
                        maxLength={400}
                        value={formState?.tasks[0]?.description}
                        onInput={handleOnInput}
                        required
                    ></textarea>

                    <div className="btn-container">
                        <button type="button" onClick={handleCloseBtn}>Close</button>
                        <button type="submit" className="add-btn">{intent?.action === 'edit' ? 'Edit' : 'Add'}</button>
                    </div>
                </Form>
            </div>
        </>
    )
}