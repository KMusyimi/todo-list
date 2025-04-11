import {JSX} from "react";
import {getRecommendations} from "../api";
import {useLoaderData} from "react-router-dom";
import Intro from "../components/Start.tsx";
import {checkUserProjects} from "../utils.ts";


// eslint-disable-next-line react-refresh/only-export-components
export async function introLoader() {
    const userProjects = await checkUserProjects();
    userProjects.hasNoProjects();
    return {recommendations: await getRecommendations()};
}

export default function StartPage(): JSX.Element {
    const {recommendations} = useLoaderData<typeof introLoader>();
    return (<Intro recommendations={recommendations}/>)
}