import { Typography } from "@suid/material";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "solid-icons/ai";
import { createSignal, type JSXElement, type Setter, Show } from "solid-js";
import { ProjectBinFolderContents } from "./ProjectBinFolderContents";

export interface ProjectFolderProps {
	id: string;
	displayName: string;
	curSelDirSetter: Setter<string>;
}

export function ProjectFolder(props: ProjectFolderProps): JSXElement {
	const [Expanded, SetExpanded] = createSignal(false);

	return (
		<div onclick={() => props.curSelDirSetter(props.id)}>
			<Show
				when={Expanded()}
				fallback={
					<AiOutlineCaretRight
						onclick={() => SetExpanded(true)}
						title={`Expand ${props.displayName}`}
						role="img"
					/>
				}
			>
				<AiOutlineCaretDown
					onclick={() => SetExpanded(false)}
					title={`Collapse ${props.displayName}`}
					role="img"
				/>
			</Show>
			<Typography variant="body1">{props.displayName}</Typography>
			<ProjectBinFolderContents
				curSelDirSestter={props.curSelDirSetter}
				id={props.id}
				Expanded={Expanded}
			/>
		</div>
	);
}
