/* eslint-disable react-refresh/only-export-components */
import moment from "moment";
import { JSX, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ActionFunctionArgs, redirect, useFetcher, useNavigation } from "react-router-dom";
import { addTask, MyProject, MyProjects, TaskRecordParams, updateTask } from "../api";
import { FormIntent } from "../Views/TaskLayout";
import RectSolidSvg from "./Svg";

interface FormProps {
    toggleForm?: boolean;
    setToggleForm: (value: React.SetStateAction<boolean>) => void;
    projects?: MyProjects | null | undefined;
    formIntent?: FormIntent;
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
                return redirect(`../${projectId}/todo?date=${payload.dueDate}`);
            default:
                // eslint-disable-next-line @typescript-eslint/only-throw-error
                throw new Response("Bad Request", { status: 400 });
        }


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
        <Suspense fallback={<h1> Loading...</h1>
        }>
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

export default function TaskForm({
    toggleForm,
    setToggleForm,
    projects,
    formIntent,
    setFormIntent
}: FormProps): JSX.Element {
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
    const [minTime, setMinTime] = useState('');
    const [minDate] = useState(() => moment().format('YYYY-MM-DD'));
    const navigation = useNavigation();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dueDate, setDueDate] = useState(() => formState?.tasks[0]?.dueDate);
    const fetcher = useFetcher();

    const status = navigation.state;

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        setMinTime((prev) => {
            if (dueDate === minDate) {
                prev = moment().format('HH:mm');
            } else {
                prev = ''
            }
            return prev;
        });
        if (formIntent) {
            let task;
            const { intent, projectId, taskId } = formIntent;
            if (intent === 'edit') {
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
    }, [status, toggleForm, setToggleForm, formIntent, projects, dueDate, minDate]);

    const closeForm = useCallback(() => {
        setFormState(prev => {
            prev = task;
            return prev
        });
        document.body.style.overflow = '';
        document.body.style.position = '';
        setFormIntent({} as FormIntent);
        setDueDate(() => moment().format('YYYY-MM-DD'));
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
        const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (type === 'date') {
            setDueDate(prev => {
                prev = value;
                return prev;
            });
        }
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
        }, 100);
    }, []);

    const handleCloseBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        closeForm();
    }, [closeForm]);

    const handleSubmit = useCallback(() => {
        setTimeout(() => {
            closeForm();

        }, 70);
    }, [closeForm]);

    return (
        <>
            <div className={'form-container'}>
                <header><i style={{height:'35px'}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5"
                style={{height:"inherit"}}
                >
                    <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                </svg>
                </i><h1>{formIntent?.intent ?? "Add"} Task</h1></header>
                <p>Make your daily and weekly plans, activities, and schedules easier.</p>
                <fetcher.Form ref={formRef}
                    action={"/projects/add"}
                    className={toggleForm ? 'task-form' : 'task-form collapse'}
                    method="post"
                    onSubmit={handleSubmit}
                    onTransitionEnd={handleTransitionEnd}>
                    <input type="hidden" name="intent" value={formIntent?.intent ?? 'add'
                    } />
                    <input type="hidden" name="status" value={'active'} />
                    {formIntent?.intent === 'edit' && <input type="hidden" name="id" value={formIntent.taskId ?? ''} />}

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
                                    <select className="bg-grey" name="projectId" id="projects" onInput={handleOnInput}
                                        required>
                                        {
                                            formIntent?.intent === 'edit' ?
                                                <option value={formState?.id}> {formState?.projectName} </option> :
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
                                value={dueDate}
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
                                min={minTime}
                                value={formState?.tasks[0]?.dueTime}
                                onInput={handleOnInput}
                                required />
                        </div>
                    </div>

                    <div className="bg-grey priority-container" style={{ marginBottom: '1.115em' }}>
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
                        maxLength={600}
                        value={formState?.tasks[0]?.description}
                        onInput={handleOnInput}
                        required
                    > </textarea>

                    <div className="btn-container">
                        <button type="button" onClick={handleCloseBtn}> Close</button>
                        <button type="submit"
                            className="add-btn"> {formIntent?.intent === 'edit' ? 'Edit' : 'Add'}</button>
                    </div>
                </fetcher.Form>
            </div>
        </>
    )
}