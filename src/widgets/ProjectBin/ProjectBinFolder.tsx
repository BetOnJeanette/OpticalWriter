import { createSignal, For, JSXElement, Show } from "solid-js"
import { listen } from "@tauri-apps/api/event"
import { List, ListItem, ListItemText } from '@suid/material'
import { createStore } from "solid-js/store"

interface ProjectFolderProps {
    id: string;
    displayName: string;
}

interface FolderDetails {
    displayName: string,
    containedFolders: string[],
    containedSources: string[]
}

interface FolderCreated {
    newFolder: FolderDetails,
    id: string,
    parent_id: string
}

function ProjectFolder(props: ProjectFolderProps): JSXElement {
    let [Expanded, SetExpanded] = createSignal(false);

    return <>
        <ListItem>
            <ListItemText>{props.displayName}</ListItemText>
            <Show when={Expanded}>
                <ProjectFolderContents id={props.id}/>
            </Show>
        </ListItem>
    </>
}

export function ProjectFolderContents(props: {id: string}): JSXElement {
    let [Subdirs, SetSubdirs] = createStore<ProjectFolderProps[]>([]);

    listen<FolderCreated>("folder-added", (event) => {
        if (event.payload.id != props.id) return;
        let newFolderItem: ProjectFolderProps = {
            displayName: event.payload.newFolder.displayName,
            id: event.payload.id
        }
        SetSubdirs([...Subdirs, newFolderItem])
    })

    return <>
        <List>
            <For each={Subdirs}> 
                {(item, _) => (
                    <ProjectFolder id={item.id} displayName={item.displayName} /> 
                )}
            </For>
        </List>
    </>
}
