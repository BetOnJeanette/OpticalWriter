import { JSXElement, Setter } from "solid-js";
import { ProjectFolderContents } from "./ProjectBinFolder";
import { ROOT_KEY } from "./ProjectBin";

interface ProjectBinDirectoryProps { 
    curSelDirSetter: Setter<string>;
}

export function ProjectBinDirectory({curSelDirSetter}: ProjectBinDirectoryProps): JSXElement {
    return (<ProjectFolderContents id={ROOT_KEY} curSelDirSestter={curSelDirSetter}/>)
}
