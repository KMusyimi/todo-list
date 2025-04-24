import { CSSProperties, JSX, ReactNode } from "react";

interface MainProps {
  children: ReactNode;
  style?: CSSProperties;
}


export default function Main({ children, ...rest }: MainProps): JSX.Element {
  return (
    <main className= {'main'} id = {'main'} {...rest }>
      { children }
    </main>)
}