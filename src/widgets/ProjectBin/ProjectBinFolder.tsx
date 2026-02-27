import { Typography } from "@suid/material";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "solid-icons/ai";
import { listen } from "@tauri-apps/api/event";
import { createSignal, For, type JSXElement, Show, Setter } from "solid-js";
import { createStore } from "solid-js/store";

interface ProjectFolderProps {
	id: string;
	displayName: string;
    curSelDirSetter: Setter<string>;
}

interface ProjectFolderContentsProps { 
    id: string;
    curSelDirSestter: Setter<string>;
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

interface FileDetails {
    path: string;
    displayName: string;
}

interface FileAdded {
    newFile: FileDetails;
    id: string;
    parentId: string;
}

function ProjectFolder(props: ProjectFolderProps): JSXElement {
	const [Expanded, SetExpanded] = createSignal(false);

	return (
		<div onclick={() => props.curSelDirSetter(props.id)}>
                <Show when={Expanded()} fallback={<AiOutlineCaretRight onclick={() => SetExpanded(true)}/>}>
                    <AiOutlineCaretDown onclick={() => SetExpanded(false)}/>
                </Show>
				<Typography variant="body1">{props.displayName}</Typography>
				<Show when={Expanded}>
					<ProjectFolderContents curSelDirSestter={props.curSelDirSetter} id={props.id} />
				</Show>
		</div>
	);
}

export function ProjectFolderContents(props: ProjectFolderContentsProps): JSXElement {
	const [Subdirs, SetSubdirs] = createStore<ProjectFolderProps[]>([]);
    const [Files, SetFiles] = createStore<{[key:string]: FileDetails}>({});

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
		<>
            <For each={Subdirs}>
                {(item, _) => (
                    <ProjectFolder id={item.id} displayName={item.displayName} curSelDirSetter={props.curSelDirSestter}/>
                )}
            </For>
            <For each={Object.entries(Files)}>{(item, _) =>(
                <div id={item[0].toString()}>
                   <Typography variant="body1">{item[1].displayName}</Typography> 
                </div>
            )}</For>
		</>
	);
}
