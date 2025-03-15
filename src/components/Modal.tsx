import {JSX} from "react";
import {ActionFunctionArgs, Form, Navigation, redirect, useNavigation, useSearchParams} from "react-router-dom";
import {addProject} from "../api";
import {FaCheckCircle} from "react-icons/fa";


// eslint-disable-next-line react-refresh/only-export-components
export async function projectAction({request}: ActionFunctionArgs): Promise<Response | undefined> {
    try {
        const formData: FormData = await request.formData();
        const projectName: FormDataEntryValue | null = formData.get('projectName');
        if (projectName) {
            const projectID = await addProject(projectName);
            let newStr = projectName as string;
            newStr = newStr.charAt(0).toUpperCase() + newStr.slice(1);

            if (projectID) {
                return redirect(`${projectID}/todos?message=${newStr} has been successfully added to your projects.`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}

export default function Modal(props: { closeModal: () => void; }): JSX.Element {
    const navigation: Navigation = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();
    const successMsg = searchParams.get('message');

    function handleCloseBtn() {
        
        props.closeModal();
        setSearchParams(prev => {
            prev.delete('message');
            return prev
        })
    }


    return (
        <div className="modal">
            <header>
                <h1>{!successMsg ? 'Add new project' : `Success`}{successMsg && <FaCheckCircle/>}</h1>
            </header>
            {
                !successMsg ?
                    <Form id="modal-form" action="/" method="post" className="form form-projects">
                        <label htmlFor="projectName"> Project Name </label>
                        < input type="text" name="projectName" id="projectName" placeholder="Enter project name"
                                maxLength={30} minLength={3} required/>
                        <div className="btn-wrapper">
                            <button type="button" onClick={props.closeModal}> cancel
                            </button>
                            < button type="submit" disabled={navigation.state === 'submitting'}> add project</button>
                        </div>
                    </Form> :
                    <>
                        <p>{successMsg ? successMsg : 'waiting'} </p>
                        < button type="button" onClick={handleCloseBtn}> close</button>
                    </>
            }

        </div>
    )
}