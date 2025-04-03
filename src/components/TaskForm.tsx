/* eslint-disable react-refresh/only-export-components */
import moment from "moment";
import { JSX, useEffect, useRef } from "react";
import { ActionFunctionArgs, Form, redirect, useNavigation, useSearchParams } from "react-router-dom";
import { addTask } from "../api";

interface FormProps {
    id: string | undefined;
    projectName: string | undefined;
}

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
    return redirect('..');
}

export default function TaskForm({ id, projectName }: FormProps): JSX.Element {
    const formContainerRef = useRef<HTMLDivElement>(null);
    const navigation = useNavigation();
    const status = navigation.state;
    const [searchParams] = useSearchParams();
    const paramDate = searchParams.get('date');

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
            <header>
                <hgroup>
                    <h4>Welcome back..</h4>
                    <h1>Create {projectName?.toLocaleLowerCase()} task</h1>
                </hgroup>
            </header>
            <Form action={"/projects/add"} className={'task-form'} replace={true} method="post">
                <input type="hidden" name="projectId" value={id} />
                <label htmlFor={'title'}> Title </label>
                <input type={'text'}
                    id={'title'}
                    name={'title'}
                    className={'form-input'}
                    placeholder={'Eg. bake a cake..'}
                    required />

                <label htmlFor={'dueDate'}> Due date </label>
                <input type={'datetime-local'}
                    id={'dueDate'}
                    name={'dueDate'}
                    className={'form-input'}
                    min={moment(paramDate ?? Date.now()).format('YYYY-MM-DDTHH:mm')}
                    required />

                <fieldset>
                    <legend>Select task priority</legend>
                    <div className="radio-wrapper">

                        <div className={'radio-container'}>
                            <input id={'high'} type={'radio'} name={'priority'} value={3}
                                style={{ height: '25px', width: '25px', verticalAlign: 'middle' }
                                } required />
                            <label htmlFor={'high'}> High </label>
                        </div>
                        <div className={'radio-container'}>
                            <input id={'medium'} type={'radio'} name={'priority'} value={2}
                                style={{ height: '25px', width: '25px', verticalAlign: 'middle' }} />
                            < label htmlFor={'medium'}> Medium </label>
                        </div>
                        <div className={'radio-container'}>
                            <input id={'low'} type={'radio'} name={'priority'} value={1}
                                style={{ height: '25px', width: '25px', verticalAlign: 'middle' }} />
                            < label htmlFor={'low'}> Low </label>
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
                <button type="submit" className="add-btn" disabled={status === 'submitting'}> Add task</button>
            </Form>

        </div>
    )
}