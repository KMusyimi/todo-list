import {JSX, useState} from "react";
import {Outlet} from "react-router-dom";
import Modal from "./Modal";
import Nav from "./Nav";
// TODO: break into components
export default function Layout(): JSX.Element {
    const [displayModal, setDisplayModal]= useState(false);

    function closeModal(): void {
        if (displayModal) {
            setDisplayModal(!displayModal);
        }
    }
    return (
        <>
            <div className="nav-container">
                <header>
                    <h1>To-do App </h1>
                </header>
                <button
                    id={'add-project'}
                    className={'add-btn'}
                    type={'button'}
                    onClick={() => {setDisplayModal(true)}}>+ add project</button>

                <Nav closeModal={closeModal}/>
            </div>
            {displayModal && <Modal closeModal={closeModal}/>}
            <main>
                <Outlet/>
            </main>
        </>)
}