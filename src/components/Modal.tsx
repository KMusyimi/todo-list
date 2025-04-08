import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { ActionFunctionArgs, Navigation, redirect, useFetcher, useNavigation } from "react-router-dom";
import { addProject } from "../api";
import { colors } from "../utils";


// eslint-disable-next-line react-refresh/only-export-components
export async function projectAction({ request }: ActionFunctionArgs): Promise<Response | undefined> {
    try {
        const formData: FormData = await request.formData();
        const projectName = formData.get('projectName') as string;
        const payload = Object.fromEntries(formData)
        if (projectName) {
            const projectID = await addProject(payload);
            let newStr = projectName ;
            newStr = newStr.charAt(0).toUpperCase() + newStr.slice(1);

            if (projectID) {
                return redirect(`projects/${projectID}/todo?message=${newStr} project added successfully to your projects&&submitted=true`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}


export default function Modal(): JSX.Element {
    const fetcher = useFetcher();

    const [color, setColor] = useState(colors[0]);
    const [toggle, setToggle] = useState(false);

    const navigation: Navigation = useNavigation();
    const status = navigation.state;
    const inputRef = useRef<HTMLInputElement | null>(null);
    
    useEffect(() => {
        if (status === 'loading') {
            if (inputRef.current) {
                inputRef.current.value = '';
                setToggle(false)
            }
        }
    }, [status]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        const { dataset } = e.target as HTMLLIElement;
        setColor(dataset.color ?? '');
    }, []);
    
    return (
        <>
            <div className="modal-container">
                <button type="button" className="dropdown" onClick={()=>{setToggle(!toggle)}}
                    style={{color: color}}       >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.997817" y="0.997817" width="22.0044" height="22.0044" rx="4.98909"
                            stroke="currentColor"
                            strokeWidth="1.99563" />
                    </svg>

                </button>
                <ul className={`colors-list ${toggle ? 'open': ''}`}>{colors.map(color => <li key={color} className="color-item"
                    style={{ backgroundColor: color }}
                    onClick={handleClick}
                    data-color={color}></li>)}</ul>
                <fetcher.Form method="post" action="/">
                    <label htmlFor="projectName">projectName</label>
                    <input ref={inputRef} type="text" name="projectName" id="projectName" placeholder="Project name..."
                        maxLength={25} minLength={3} required disabled={status === 'loading'} />
                    <input type="hidden" name="avatarColor" value={color} />
                </fetcher.Form>
            </div>

        </>
    )
}