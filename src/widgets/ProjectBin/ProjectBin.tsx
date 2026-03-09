import { createSignal, JSXElement } from "solid-js"
import { ProjectBinToolbar } from "./ProjectBinToolbar"
import { ProjectBinDirectory } from "./ProjectBinDirectory"

interface ProjectBinProps {

}

export const ROOT_KEY = "root";

export function ProjectBin({}: ProjectBinProps): JSXElement {
    const [selectedDir, UpdateSelectedDir] = createSignal<string>(ROOT_KEY);

    return (<>
        <ProjectBinToolbar curSelFold={selectedDir}/>
        <ProjectBinDirectory curSelDirSetter={UpdateSelectedDir} />
    </>)
}
