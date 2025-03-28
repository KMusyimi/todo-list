/* eslint-disable react-refresh/only-export-components */
import { nanoid } from "nanoid";
import { JSX, Suspense, use, useEffect, useRef } from "react";
import { ActionFunctionArgs, Form, redirect } from "react-router-dom";
import { MyTask, MyTodo, updateTasks } from "../api";

export async function todoFormAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const projectId = formData.get('project');
        const dueDate = formData.get('due-date');
        const priority = formData.get('priority');
        const description = formData.get('description');
        const notes = formData.get('notes');
        const task = {
            id: projectId,
            tasks: [{
                todoId: nanoid(),
                title,
                dueDate,
                priority: Number(priority),
                description,
                status: 'active',
                notes,
                createdAt: Date.now()
            }]
        } as MyTodo;
        const projectIdStr = projectId as string;
        await updateTasks(task);
        return redirect(`../${projectIdStr}/todo?submitted=true`);

    } catch (e) {
        console.error(e)
    }
}


function FormOptions({ projects }: {
    projects: Promise<{
        id: string;
        projectName: string;
        tasks: MyTask;
        createdAt: number;
        updatedAt: number;
    }[]>
}) {
    const projectPromise = use(projects);
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            {projectPromise.map((project) => {
                const { id, projectName } = project;
                return (<option key={id} value={id}> {projectName} </option>)
            })}
        </Suspense>

    )
}

export default function TaskForm({ projects }: {
    projects: Promise<{
        id: string;
        projectName: string;
        tasks: MyTask;
        createdAt: number;
        updatedAt: number;
    }[]>
}): JSX.Element {
    const formContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (formContainerRef.current) {
                formContainerRef.current.classList.add('mounted');
            }
        }, 10);
        return () => {
            clearTimeout(timer)
        }
    }, []);

    return (
        <div ref={formContainerRef} className={"task-form-container"}>
            <Form action={"/projects/add"} className={'task-form'} replace={true} method="post">
                <label htmlFor={'title'}> Title </label>
                <input type={'text'}
                    id={'title'}
                    name={'title'}
                    className={'form-input'}
                    placeholder={'Eg. bake a cake..'}
                    required />

                <label htmlFor="projects-select"> choose a project </label>
                <select name='project' id="projects-select">
                    <option value={''} disabled> Please select a project</option>
                    < FormOptions projects={projects} />
                </select>

                <label htmlFor={'due-date'}> Due date </label>
                <input type={'date'}
                    id={'due-date'}
                    name={'due-date'}
                    className={'form-input'}
                    min={new Date().toISOString().slice(0, 10)}
                    required />

                <fieldset>
                    <legend>Select task priority</legend>
                    <div className="radio-wrapper">

                        <div className={'radio-container'}>
                            <input id={'high'} type={'radio'} name={'priority'} value={3}
                                style={{ height: '25px', width: '25px', verticalAlign: 'middle' }} required/>
                            <label htmlFor={'high'}> High </label>
                        </div>
                        <div className={'radio-container'}>
                            <input id={'medium'} type={'radio'} name={'priority'} value={2}
                                style={{ height: '25px', width: '25px', verticalAlign: 'middle' }} />
                            <label htmlFor={'medium'}> Medium </label>
                        </div>
                        <div className={'radio-container'}>
                            <input id={'low'} type={'radio'} name={'priority'} value={1}
                                style={{ height: '25px', width: '25px', verticalAlign: 'middle' }} />
                            <label htmlFor={'low'}> Low </label>
                        </div>
                    </div>
                </fieldset>
                <label htmlFor={'description'}> Description </label>
                <textarea id={'description'}
                    name={'description'}
                    className={'form-textarea'}
                    placeholder={'Write a brief description...'}
                    maxLength={250} required
                > </textarea>
                <label htmlFor={'notes'}> Notes </label>
                <textarea id={'notes'}
                    name={'notes'}
                    className={'form-textarea'}
                    placeholder={'Write a brief note...'}
                    maxLength={100}
                > </textarea>
                < button type="submit" className="add-btn"> Add task</button>
            </Form>

        </div>
    )
}