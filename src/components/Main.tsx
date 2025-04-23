import { JSX, ReactNode } from "react";

export default function Main({children}: {children: ReactNode}): JSX.Element{
  return (<main className={'main'} id={'main'}>
    {children}   
    </main>)
}