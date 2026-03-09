import { listen } from "@tauri-apps/api/event";
import { createStore } from "solid-js/store";
import { For, type JSXElement, Show, Setter, Accessor } from "solid-js";
import { ProjectFolder, ProjectFolderProps} from "./ProjectBinFolder";
import { FileDetails, ProjectBinFile } from "./ProjectBinFile";

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

export function ProjectBinFolderContents(props: ProjectFolderContentsProps): JSXElement {
	const [Subdirs, SetSubdirs] = createStore<ProjectFolderProps[]>([]);
    const [Files, SetFiles] = createStore<{[key:string]: FileDetails}>({});
    if (props.Expanded === null || props.Expanded === undefined) {
        props.Expanded = () => { return true; }
    }
	listen<FolderCreated>("folder-added", (event) => {
		if (event.payload.parentId !== props.id) return;
		const newFolderItem: ProjectFolderProps = {
			displayName: event.payload.newFolder.displayName,
			id: event.payload.id,
            curSelDirSetter: props.curSelDirSestter
		};
		SetSubdirs(Subdirs.length, newFolderItem);
	});

    listen<FileAdded>("file-added", (event) => {
        if (event.payload.parentId !== props.id) return;
        SetFiles(event.payload.id, event.payload.newFile);
    })

	return (
        <div id="project-bin-contents">
            <Show when={props.Expanded()}>
                <For each={Subdirs}>{(item, _) =>
                    (<ProjectFolder
                        id={item.id}
                        displayName={item.displayName}
                        curSelDirSetter={props.curSelDirSestter}/>)}
                </For>
                <For each={Object.keys(Files)}>{(key, _) =>
                    (<ProjectBinFile id={key} details={Files[key]} />)}
                </For>
            </Show>
        </div>
	);
}
