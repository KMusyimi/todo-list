import {JSX} from "react"
import {FaCheck} from "react-icons/fa";

export default function SuccessMsg({successMsg}: { successMsg: string | null }): JSX.Element {

    return (<div className={"success-banner"}><p><FaCheck /> {successMsg} </p></div>)
}