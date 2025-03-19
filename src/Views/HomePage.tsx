/* eslint-disable react-refresh/only-export-components */
import { JSX, Suspense, useEffect, useId, useState } from "react";
import { ActionFunctionArgs, Await, Link, LoaderFunctionArgs, useLoaderData, useSearchParams } from "react-router-dom";
import { getProjectName, getTodos } from "../api";
import { daysInWeekArr } from "../utils";
import SuccessMsg from "../components/SuccessMsg.tsx";
import { FaPlus } from "react-icons/fa6";
import moment from "moment";
import checkboxIcon from '../assets/checkbox.svg';


export async function todoLoader({ params }: LoaderFunctionArgs) {
    const project = getProjectName();
    return { todos: getTodos(params.id), projectName: await project.projectName(params.id) }
}

export async function todoAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        console.log(formData.get('name'));
    } catch (e) {
        console.error(e);
    }
}

export default function HomePage(): JSX.Element {
    const { todos, projectName } = useLoaderData<typeof todoLoader>();
    const [currentDate,] = useState(() => new Date());
    const [searchParams, setSearchParams] = useSearchParams();
    const successMsg = searchParams.get('message');
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
        return () => {
            clearTimeout(timer);
        }
    }, [setSearchParams, successMsg])

    function RenderDates() {
        const id = useId();
        const startDay = currentDate.getDay();
        const strDate = currentDate.toISOString().slice(0, 10);
        const arrDays = [...daysInWeekArr.slice(startDay - 1), ...daysInWeekArr.slice(0, startDay - 1)];

        return arrDays.map((daysStr, idx) => {
            const date = new Date();
            // d.getDate() - d.getDay() + idx, we take the current day (23), remove the day of week (0 for Sunday, 2 for Tuesday... Basically we calculate the last Sunday date) et add number of days to have every date in the week.
            const day = date.setDate(date.getDate() - date.getDay() + (startDay - 1 + idx));
            const formatDate: string = new Date(day).toISOString().slice(0, 10);

            const dateWeek = formatDate.substring(formatDate.lastIndexOf('-') + 1);

            return (
                <button className={strDate === formatDate ? 'date-btn today' : 'date-btn'
                } type="button"
                    key={`day-${id + idx.toString()}`}>
                    <div className="day"> {daysStr.slice(0, 3)} </div>
                    < div className="date"> {dateWeek} </div>
                </button>)
        })

    }

    return (
        <>
            <section className="todo-section">
                <header>
                    <h1>{moment().calendar().split(' ')[0]} </h1>
                </header>
                {successMsg && <SuccessMsg successMsg={successMsg} />}
                <div className="calendar">
                    <RenderDates />
                </div>
                <section className="todo-container">
                    <header>
                        <h2 className="project-name">{projectName} </h2>
                    </header>
                    <div className="todos-wrapper">
                        <ul>
                            <Suspense fallback={< h1> Loading...</h1>}>
                                <Await resolve={todos}>
                                    {(loadedTodos) => {
                                        const { todos } = loadedTodos ?? {};
                                        return (
                                            <>
                                                {todos ? todos.map((todo, idx) => {
                                                    return (
                                                        <li key={`list-${idx.toString()}`}>
                                                            <img src={checkboxIcon} alt="greyish checkbox icon" />
                                                            <h3 className="title">{todo.title}</h3>
                                                        </li>)
                                                }) : <span>Currently no tasks.</span>}
                                            </>)
                                    }}
                                </Await>
                            </Suspense>
                        </ul>
                    </div>
                </section>
            </section>
            <div className="link-wrapper">
                <Link className="add-todo--link" to={'add'} state={{ projectName }
                }> <FaPlus />  Add Task </Link>
            </div>

        </>
    )
}