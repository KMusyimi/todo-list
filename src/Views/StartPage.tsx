import {JSX} from "react";
import {addProject, getRecommendations} from "../api";
import {ActionFunctionArgs, redirect, useLoaderData} from "react-router-dom";
import Intro from "../components/Intro";
import {checkUserProjects} from "../utils.ts";


// eslint-disable-next-line react-refresh/only-export-components
export async function introLoader() {
    const userProjects = await checkUserProjects();
    userProjects.hasNoProjects();
    return {recommendations: await getRecommendations()};
}

// eslint-disable-next-line react-refresh/only-export-components
export async function startPageAction({request}: ActionFunctionArgs): Promise<Response | undefined> {
    try {
        const formData: FormData = await request.formData();
        const projectName: FormDataEntryValue | null = formData.get('projectName');
        if (projectName) {
            const projectId = await addProject(projectName);
            let newStr = projectName as string;
            newStr = newStr.charAt(0).toUpperCase() + newStr.slice(1);
            console.log(projectId);
            return redirect(`..?message=${newStr} project added successfully to your projects`);

        }

    } catch (e) {
        console.error(e);
    }
}

export default function StartPage(): JSX.Element {
    const {recommendations} = useLoaderData<typeof introLoader>();
    return (<Intro recommendations={recommendations}/>)
}