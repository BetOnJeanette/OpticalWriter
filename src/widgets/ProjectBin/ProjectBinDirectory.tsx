import type { JSXElement, Setter } from "solid-js";
import { ROOT_KEY } from "./ProjectBin";
import { ProjectBinFolderContents } from "./ProjectBinFolderContents";

interface ProjectBinDirectoryProps {
	curSelDirSetter: Setter<string>;
}

export function ProjectBinDirectory({
	curSelDirSetter,
}: ProjectBinDirectoryProps): JSXElement {
	return (
		<ProjectBinFolderContents
			id={ROOT_KEY}
			curSelDirSestter={curSelDirSetter}
		/>
	);
}
