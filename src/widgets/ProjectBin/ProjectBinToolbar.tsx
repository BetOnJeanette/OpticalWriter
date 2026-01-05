import { JSXElement } from "solid-js";
import { Button } from "@suid/material";
import { invoke } from "@tauri-apps/api/core";
import { AiFillFolderAdd } from "solid-icons/ai"

interface ProjectBinToolbarProps {

}

export function ProjectBinToolbar({}: ProjectBinToolbarProps): JSXElement {
    return (<> 
        <Button size="small" fullWidth={false} onClick={() => invoke("request_new_file")}>+</Button>
        <Button size="small" fullWidth={false}><AiFillFolderAdd /></Button>
    </>)
}
