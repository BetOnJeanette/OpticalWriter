import { listen } from "@tauri-apps/api/event";
import {
	type Accessor,
	For,
	type JSXElement,
	type Setter,
	Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { type FileDetails, ProjectBinFile } from "./ProjectBinFile";
import { ProjectFolder, type ProjectFolderProps } from "./ProjectBinFolder";

export const NEW_FOLDER_RECEIVED = "folder-added";
export const NEW_FILE_RECEIEVED = "file-added";

interface ProjectFolderContentsProps {
	id: string;
	curSelDirSestter: Setter<string>;
	Expanded?: Accessor<boolean>;
}

interface FolderDetails {
	displayName: string;
	containedFolders: string[];
	containedSources: string[];
}

interface FolderCreated {
	newFolder: FolderDetails;
	id: string;
	parentId: string;
}

interface FileAdded {
	newFile: FileDetails;
	id: string;
	parentId: string;
}

export function ProjectBinFolderContents(
	props: ProjectFolderContentsProps,
): JSXElement {
	const [Subdirs, SetSubdirs] = createStore<ProjectFolderProps[]>([]);
	const [Files, SetFiles] = createStore<{ [key: string]: FileDetails }>({});
	if (props.Expanded === null || props.Expanded === undefined) {
		props.Expanded = () => {
			return true;
		};
	}
	listen<FolderCreated>(NEW_FOLDER_RECEIVED, (event) => {
		if (event.payload.parentId !== props.id) return;
		const newFolderItem: ProjectFolderProps = {
			displayName: event.payload.newFolder.displayName,
			id: event.payload.id,
			curSelDirSetter: props.curSelDirSestter,
		};
		SetSubdirs(Subdirs.length, newFolderItem);
	});

	listen<FileAdded>(NEW_FILE_RECEIEVED, (event) => {
		if (event.payload.parentId !== props.id) return;
		SetFiles(event.payload.id, event.payload.newFile);
	});

	return (
		<div id="project-bin-contents">
			<Show when={props.Expanded()}>
				<For each={Subdirs}>
					{(item, _) => (
						<ProjectFolder
							id={item.id}
							displayName={item.displayName}
							curSelDirSetter={props.curSelDirSestter}
						/>
					)}
				</For>
				<For each={Object.keys(Files)}>
					{(key, _) => <ProjectBinFile id={key} details={Files[key]} />}
				</For>
			</Show>
		</div>
	);
}
