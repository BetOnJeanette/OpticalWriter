import { Button } from "@suid/material";
import { invoke } from "@tauri-apps/api/core";
import { AiFillFolderAdd } from "solid-icons/ai";
import type { Accessor, JSXElement } from "solid-js";

type ProjectBinToolbarProps = {
	curSelFold: Accessor<string>;
};

export function ProjectBinToolbar({
	curSelFold,
}: ProjectBinToolbarProps): JSXElement {
	return (
		<>
			<Button
				size="small"
				fullWidth={false}
				onClick={() =>
					invoke("request_new_file", { selectedFolderId: curSelFold() })
				}
			>
				+
			</Button>
			<Button
				size="small"
				fullWidth={false}
				onClick={() => invoke("add_folder", { selectedDirId: curSelFold() })}
			>
				<AiFillFolderAdd />
			</Button>
		</>
	);
}
