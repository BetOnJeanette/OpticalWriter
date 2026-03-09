import { Typography } from "@suid/material";
import type { JSXElement } from "solid-js";

interface ProjectBinFileProps {
	details: FileDetails;
	id: string;
}

export interface FileDetails {
	path: string;
	displayName: string;
}

export function ProjectBinFile(props: ProjectBinFileProps): JSXElement {
	return (
		<div id={props.id}>
			<Typography>{props.details.displayName}</Typography>
		</div>
	);
}
