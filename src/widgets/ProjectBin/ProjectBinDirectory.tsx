import { listen } from "@tauri-apps/api/event";
import { JSXElement, Setter } from "solid-js";
import { ProjectFolderContents } from "./ProjectBinFolder";
import { ROOT_KEY } from "./ProjectBin";

interface ProjectBinDirectoryProps { 
    curSelDirSetter: Setter<string>;
}

type NewFiles = {
    files: string[];
}


export function ProjectBinDirectory({curSelDirSetter}: ProjectBinDirectoryProps): JSXElement {
    listen<NewFiles>("file-added", (event) => console.log(event.payload));

    return (<ProjectFolderContents id={ROOT_KEY} curSelDirSestter={curSelDirSetter}/>)
}
