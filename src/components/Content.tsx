import {JSX} from 'react';
import {Outlet} from 'react-router-dom';


export default function Main(): JSX.Element {
    return (
        <main className="main">
            <Outlet/>
        </main>
    );
}
