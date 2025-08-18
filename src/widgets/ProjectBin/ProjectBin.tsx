import { JSXElement } from "solid-js"
import { ProjectBinToolbar } from "./ProjectBinToolbar"
import { invoke } from "@tauri-apps/api/core";

interface ProjectBinProps {

}

export function ProjectBin({}: ProjectBinProps): JSXElement {

    return (<>
        <ProjectBinToolbar />
    </>)
}
