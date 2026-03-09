import { createSignal, type JSXElement } from "solid-js";
import { ProjectBinDirectory } from "./ProjectBinDirectory";
import { ProjectBinToolbar } from "./ProjectBinToolbar";

export const ROOT_KEY = "root";

export function ProjectBin(): JSXElement {
	const [selectedDir, UpdateSelectedDir] = createSignal<string>(ROOT_KEY);

	return (
		<>
			<ProjectBinToolbar curSelFold={selectedDir} />
			<ProjectBinDirectory curSelDirSetter={UpdateSelectedDir} />
		</>
	);
}
