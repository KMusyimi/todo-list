import {JSX} from "react"
import {FaCheckCircle} from "react-icons/fa";

export default function SuccessMsg({successMsg}: { successMsg: string | null }): JSX.Element {

    return (<div className={"success-banner"}><p><FaCheckCircle/> {successMsg} </p></div>)
}