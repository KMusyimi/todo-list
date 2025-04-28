import { CSSProperties, JSX, ReactNode } from "react";

interface MainProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}


export default function Main({ children, ...rest }: MainProps): JSX.Element {
  return (
    <main id = {'main'} {...rest }>
      { children }
    </main>)
}