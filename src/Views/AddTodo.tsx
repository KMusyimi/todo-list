/* eslint-disable react-refresh/only-export-components */
import {JSX} from "react";
import {IoMdArrowBack} from "react-icons/io";
import {ActionFunctionArgs, Link, redirect, useLocation} from "react-router-dom";
import {addTodos, MyTodo} from "../api";
import TodoForm from "../components/TodoForm.tsx";

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


export default function AddTodo(): JSX.Element {
    const location = useLocation();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {projectName}: { projectName: string } = location.state;
    return (<>
        <header>
            <h1>Add {projectName} task </h1>
            < Link to={'..'} relative={'path'}> <IoMdArrowBack/>go back</Link>
        </header>
        < TodoForm/>
    </>)
}

