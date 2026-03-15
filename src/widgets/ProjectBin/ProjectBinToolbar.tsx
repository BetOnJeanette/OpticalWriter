import { Button } from "@suid/material";
import { invoke } from "@tauri-apps/api/core";
import { AiFillFolderAdd } from "solid-icons/ai";
import type { Accessor, JSXElement } from "solid-js";

type ProjectBinToolbarProps = {
	curSelFold: Accessor<string>;
};

export const NEW_FILE_COMMAND = "request_new_file";
export const NEW_FOLDER_COMMAND = "add_folder";
export const NEW_FOLDER_TITLE = "Create Folder in Bin";

export function ProjectBinToolbar({
	curSelFold,
}: ProjectBinToolbarProps): JSXElement {
	return (
		<>
			<Button
				size="small"
				fullWidth={false}
				onClick={() =>
					invoke(NEW_FILE_COMMAND, { selectedFolderId: curSelFold() })
				}
				id="fileAdd"
			>
				+
			</Button>
			<Button
				size="small"
				fullWidth={false}
				onClick={() =>
					invoke(NEW_FOLDER_COMMAND, { selectedDirId: curSelFold() })
				}
			>
				<AiFillFolderAdd title={NEW_FOLDER_TITLE} />
			</Button>
		</>
	);
}
