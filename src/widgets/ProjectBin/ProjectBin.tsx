import { JSXElement } from "solid-js"
import { ProjectBinToolbar } from "./ProjectBinToolbar"
import { ProjectBinDirectory } from "./ProjectBinDirectory"

interface ProjectBinProps {

}

export function ProjectBin({}: ProjectBinProps): JSXElement {

    return (<>
        <ProjectBinToolbar />
        <ProjectBinDirectory />
    </>)
}
