import { FormEvent, JSX, useCallback, useState } from "react";
import { ActionFunctionArgs, Navigation, redirect, useFetcher, useNavigation } from "react-router-dom";
import { addProject } from "../api";
import { colors } from "../utils";
import { ProjectIcon } from "./Svg";


// eslint-disable-next-line react-refresh/only-export-components
export async function projectAction({ request }: ActionFunctionArgs): Promise<Response | undefined> {
    try {
        const formData: FormData = await request.formData();
        const projectName = formData.get('projectName') as string;
        const payload = Object.fromEntries(formData)
        if (projectName) {
            const projectID = await addProject(payload);
            let newStr = projectName;
            newStr = newStr.charAt(0).toUpperCase() + newStr.slice(1);

            if (projectID) {
                console.log(projectID)
                return redirect(`projects/${projectID}/todo?message=${newStr} project added successfully to your projects`);
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

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetcher.submit(e.currentTarget);

        e.currentTarget.reset();
        if (toggle) { setToggle(prev => prev ? prev = !prev : prev); }
    }, [fetcher, toggle])


    const handleClick = useCallback((e: React.MouseEvent) => {
        const { dataset } = e.target as HTMLLIElement;
        setColor(dataset.color ?? '');
    }, []);

    return (
        <>
            <div className="modal-container">
                <button type="button" className="dropdown" onClick={() => { setToggle(!toggle) }}>
                    <ProjectIcon color={color} />
                </button>
                <ul className={`colors-list ${toggle ? 'open' : ''}`}>{colors.map(color => <li key={color} className="color-item"
                    style={{ backgroundColor: color }}
                    onClick={handleClick}
                    data-color={color}></li>)}</ul>
                <fetcher.Form method="post" action="/" onSubmit={handleSubmit}>
                    <label htmlFor="projectName">projectName</label>
                    <input type="text" name="projectName" id="projectName" placeholder="Project name..."
                        maxLength={25} minLength={3} required disabled={status === 'loading'} />
                    <input type="hidden" name="iconColor" value={color} />
                </fetcher.Form>
            </div>

        </>
    )
}