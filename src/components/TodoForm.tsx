/* eslint-disable react-refresh/only-export-components */
import {JSX} from "react";
import {IoMdArrowBack} from "react-icons/io";
import {ActionFunctionArgs, Form, Link, redirect} from "react-router-dom";
import {addTodos, MyTodo} from "../api";

export async function todoFormAction({request, params}: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const dueDate = formData.get('due-date');
        const priority = formData.get('priority');
        const description = formData.get('description');
        const notes = formData.get('notes');

        const todo = {
            projectId: params.id,
            todos: [{title, dueDate, priority: Number(priority), description, notes}]
        } as MyTodo;
        await addTodos(todo);
        if (params.id) {
            // TODO: redirect to todo
            return redirect(`../${params.id}/todos`);
        }
    } catch (e) {
        console.error(e)
    }
}


export default function TodoForm(): JSX.Element {
    return (
        <Form replace={true} method="post">
            <header>
                <h1>Add Todo </h1>
                < Link to={'..'} relative={'path'}> <IoMdArrowBack/>go back</Link>
            </header>
            < label htmlFor={'title'}> title: </label>
            < input type={'text'}
                    id={'title'}
                    name={'title'}
                    className={'form-input'}
                    placeholder={'Eg. bake a cake..'}
                    required/>

            <label htmlFor={'due-date'}> due date: </label>
            < input type={'date'}
                    id={'due-date'}
                    name={'due-date'}
                    className={'form-input'}
                    min={new Date().toISOString().slice(0, 10)}
                    required/>

            <fieldset>
                <legend>Select todo priority</legend>
                < div className={'radio-container'}>
                    <input id={'high'} type={'radio'} name={'priority'} value={1}/>
                    <label htmlFor={'high'}> high </label>
                </div>
                < div className={'radio-container'}>
                    <input id={'medium'} type={'radio'} name={'priority'} value={2}/>
                    <label htmlFor={'medium'}> medium </label>
                </div>
                < div className={'radio-container'}>
                    <input id={'low'} type={'radio'} name={'priority'} value={3}/>
                    <label htmlFor={'low'}> low </label>
                </div>
            </fieldset>
            < label htmlFor={'description'}> description: </label>
            < textarea id={'description'} name={'description'} className={'form-input'}
                       placeholder={'Enter a brief description'} maxLength={350}> </textarea>
            < label htmlFor={'notes'}> notes: </label>
            < textarea id={'notes'}
                       name={'notes'}
                       className={'form-input'}
                       placeholder={'Add any additional notes'}
                       maxLength={150}> </textarea>
            < button type="submit"> + Add ToDo</button>
        </Form>);
}

