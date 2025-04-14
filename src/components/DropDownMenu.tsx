import {JSX, ReactNode} from "react";

interface DropDownProps  {
  ref: React.RefObject<HTMLDivElement | null>;
  children?: ReactNode;
  className?: string;
  id?: string;
} 


export default function DropdownMenu({children, ...rest}: DropDownProps): JSX.Element {
  return (<div {...rest}>{children}</div>);
}