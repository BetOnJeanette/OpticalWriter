import { JSXElement, Setter } from "solid-js";
import { ProjectBinFolderContents } from "./ProjectBinFolderContents";
import { ROOT_KEY } from "./ProjectBin";

interface ProjectBinDirectoryProps { 
    curSelDirSetter: Setter<string>;
}

export function ProjectBinDirectory({curSelDirSetter}: ProjectBinDirectoryProps): JSXElement {
    return (<ProjectBinFolderContents id={ROOT_KEY} curSelDirSestter={curSelDirSetter}/>)
}
