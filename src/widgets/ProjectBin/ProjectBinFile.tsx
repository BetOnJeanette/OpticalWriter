import { JSXElement } from "solid-js";
import { Typography } from "@suid/material";

interface ProjectBinFileProps {
    details: FileDetails,
    id: string
}

export interface FileDetails {
    path: string;
    displayName: string;
}



export function ProjectBinFile(props: ProjectBinFileProps): JSXElement{
    return (<div id={props.id}>
        <Typography>{props.details.displayName}</Typography>
    </div>)
}
