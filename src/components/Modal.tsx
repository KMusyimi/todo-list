import { JSX, useCallback, useEffect } from "react";
import { ActionFunctionArgs, Form, Navigation, redirect, useNavigation, useSearchParams } from "react-router-dom";
import { addProject } from "../api";
import { IoClose } from "react-icons/io5";


// eslint-disable-next-line react-refresh/only-export-components
export async function projectAction({ request }: ActionFunctionArgs): Promise<Response | undefined> {
    try {
        const formData: FormData = await request.formData();
        const projectName: FormDataEntryValue | null = formData.get('projectName');
        if (projectName) {
            const projectID = await addProject(projectName);
            let newStr = projectName as string;
            newStr = newStr.charAt(0).toUpperCase() + newStr.slice(1);

            if (projectID) {
                return redirect(`projects/${projectID}/todo?message=${newStr} project added successfully to your projects&&submitted=true`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}

export default function Modal(props: { closeModal: () => void; }): JSX.Element {
    const navigation: Navigation = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();
    const submitted = searchParams.get('submitted');

    useEffect(() => {
        if (submitted) {
            props.closeModal();
            setSearchParams((prev) => {
                prev.delete('submitted');
                return prev;
            });
        }
    }, [props, setSearchParams, submitted]);
    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const {id} = e.target as HTMLDivElement;
        if (id === 'modal-container') {
            props.closeModal();
        }

    }, [props])

    return (
        <div id= "modal-container" className = "modal-wrapper"  onClick = { handleClick } >

            <div className="modal" >
        <button type="button" className = "close-btn" onClick = { props.closeModal } > <IoClose /></button>
                <Form id="modal-form" action = "/" method = "post" className = "form form-projects" >
                    <label htmlFor="projectName" > Project Name </label>
                        <div className = "input-container" >
                            <input type="text" name = "projectName" id = "projectName" placeholder = "Write a new project..."
    maxLength = { 30} minLength = { 3} required />
        <button type="submit" disabled = { navigation.state === 'submitting' } > Add </button>
            </div>
            </Form>

            </div>
            </div>
    )
}