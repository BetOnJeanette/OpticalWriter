import { listen } from "@tauri-apps/api/event";
import { JSXElement } from "solid-js";

interface ProjectBinDirectoryProps { 

}

type NewFiles = {
    files: string[];
}
export function ProjectBinDirectory({}: ProjectBinDirectoryProps): JSXElement {
    listen<NewFiles>("files-added", (event) => console.log(event.payload));

    return (<>
    
    </>)
}
