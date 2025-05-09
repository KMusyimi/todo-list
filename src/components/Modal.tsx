import React, { FormEvent, JSX, useCallback, useEffect, useRef, useState } from "react";
import { ActionFunctionArgs, redirect, useFetcher } from "react-router-dom";
import { addProject, deleteProject, ProjectParams, updateProject } from "../api";
import { colors } from "../utils";
import { ProjectIcon } from "./Svg";

interface ModalProps {
    menuOpen: boolean,
    modalIntent: Record<string, string>,
    setModalIntent: (value: React.SetStateAction<Record<string, string>>) => void;
    className?: string,
}

// eslint-disable-next-line react-refresh/only-export-components
export async function projectAction({ request }: ActionFunctionArgs): Promise<Response | undefined> {
    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const payload: ProjectParams = {};
        Object.keys(data).forEach((item) => {
            payload[item] = (data[item] as string).trim();
        })
        switch (payload.intent) {
            case 'add':
                {
                    delete payload.intent;
                    const projectID = await addProject(payload);
                    let newStr = payload.projectName;
                    newStr = newStr.charAt(0).toUpperCase() + newStr.slice(1);

                    if (projectID) {
                        return redirect(`projects/${projectID}/todo?message=${newStr} project added successfully to your projects`);
                    }
                    break;
                }
            case 'edit':
                delete payload.intent;
                await updateProject(payload)
                break;
            case 'delete':
                await deleteProject(payload);
                return redirect('/');
            default:
                // eslint-disable-next-line @typescript-eslint/only-throw-error
                throw new Response("Bad Request", { status: 400 });

        }

    } catch (e) {
        console.error(e);
    }
}


export default function Modal({ menuOpen, modalIntent, setModalIntent, ...rest }: ModalProps): JSX.Element {
    const fetcher = useFetcher();
    const colorListRef = useRef<HTMLUListElement | null>(null);
    const [color, setColor] = useState(colors[0]);
    const [toggle, setToggle] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const project = { intent: 'add', projectName: '', iconColor: '' };
    const [formState, setFormState] = useState<Record<string, string>>(() => project);

    const resetFormState = useCallback(() => {
        setFormState({ intent: 'add', projectName: '', iconColor: '' });
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (inputRef.current && formState.intent === 'edit') {
            inputRef.current.focus();
        }
        if (!menuOpen) {
            resetFormState();
            timer = setTimeout(() => {
                setToggle(prev => prev ? !prev : prev);
            }, 3000);
        }
        setFormState(prev => {
            if (prev.id === modalIntent.id) {
                return prev;
            }
            return modalIntent;
        });
        if (formState.iconColor) {
            setColor(formState.iconColor)
        }
        return () => {
            clearTimeout(timer);
        }
    }, [formState.iconColor, formState.intent, menuOpen, modalIntent, resetFormState]);

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);

        e.currentTarget.reset();
        resetFormState();
        setModalIntent({});
        inputRef.current?.blur();

        if (toggle) { setToggle(prev => prev ? prev = !prev : prev); }

    }, [fetcher, resetFormState, setModalIntent, toggle])


    const handleClick = useCallback((e: React.MouseEvent) => {
        const { dataset } = e.target as HTMLLIElement;
        setColor(dataset.color ?? '');
        inputRef.current?.focus();
    }, []);

    const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLUListElement>) => {
        e.preventDefault();
        setTimeout(() => {
            if (toggle && colorListRef.current) {
                colorListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 90);
    }, [toggle]);

    const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormState(prev => ({ ...prev, [name]: value }));
    }, []);


    return (
        <div className="modal-container" {...rest}>
            <div className="modal-wrapper">
                <button type="button" className="dropdown" onClick={() => { setToggle(!toggle) }}>
                    <ProjectIcon color={color} />
                </button>
                <fetcher.Form method="post" action="/" onSubmit={handleSubmit}>
                    <label htmlFor="projectName">projectName</label>
                    <input type="hidden" name="intent" value={formState.intent} />
                    {formState.intent === 'edit' && <input type="hidden" name="id" value={formState.id} />}
                    <input ref={inputRef} type="text" name="projectName" id="projectName" placeholder={formState.intent === 'add' ? "Project name..." : 'Edit project..'}
                        maxLength={25} minLength={3} required
                        onInput={handleInput}
                        value={formState.projectName} />
                    <input type="hidden" name="iconColor" value={color} />
                </fetcher.Form>
            </div>
            <ul ref={colorListRef} className={`colors-list ${toggle ? 'open' : ''}`}
                onTransitionEnd={handleTransitionEnd}
            >{colors.map(color => <li key={color} className="color-item"
                style={{ backgroundColor: color }}
                onClick={handleClick}
                data-color={color}
            ></li>)}</ul>
        </div>
    )
}