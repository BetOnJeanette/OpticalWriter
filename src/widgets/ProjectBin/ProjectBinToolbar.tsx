import { JSXElement } from "solid-js";
import { Button } from "@suid/material";

interface ProjectBinToolbarProps {

}

export function ProjectBinToolbar({}: ProjectBinToolbarProps): JSXElement {
    return (<> 
        <Button size="small" fullWidth={false}>+</Button>
    </>)
}
