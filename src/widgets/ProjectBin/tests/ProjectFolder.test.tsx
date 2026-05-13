import { render } from "@solidjs/testing-library";
import { emit } from "@tauri-apps/api/event";
import { mockIPC } from "@tauri-apps/api/mocks";
import { userEvent } from "@testing-library/user-event";
import { For } from "solid-js";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { ROOT_KEY } from "../ProjectBin";
import { ProjectFolder } from "../ProjectBinFolder";
import {
	NEW_FILE_RECEIEVED,
	NEW_FOLDER_RECEIVED,
} from "../ProjectBinFolderContents";

const user = userEvent.setup();

const NEW_FOLDER_LABEL = "NewFolder";
const NEW_FILE_NAME = "NewFile";

function GetTestFolder() {
	const parent = ROOT_KEY;
	return {
		newFolder: {
			displayName: NEW_FOLDER_LABEL,
			containedFolders: [],
			containedSources: [],
		},
		id: "awawawa",
		parentId: parent,
	};
}

function GetTestFile() {
	const parent = ROOT_KEY;
	return {
		newFile: {
			path: "/",
			displayName: NEW_FILE_NAME,
		},
		id: "awawa",
		parentId: parent,
	};
}

const folders = [
	{
		id: ROOT_KEY,
		name: "root",
	},
	{
		id: "awawawa",
		name: "another folder",
	},
];

describe("Folders react to clicking for focus as expected", () => {
	let rendered: ReturnType<typeof render> | undefined;
	const curDirSetter = vi.fn((_) => 1);
	beforeAll(() => {
		mockIPC(() => {}, { shouldMockEvents: true });
		rendered = render(() => (
			<For each={folders}>
				{(folder, _) => (
					<ProjectFolder
						id={folder.id}
						displayName={folder.name}
						curSelDirSetter={curDirSetter}
					/>
				)}
			</For>
		));
	});

	test.each(
		folders,
	)("clicking on subfolder $name invokes setter with the correct folder", async (folder) => {
		if (rendered === undefined) {
			throw Error();
		}
		const curFolder = rendered.getByText(folder.name);
		await user.click(curFolder);
		expect(curDirSetter).toHaveBeenCalledWith(folder.id);
	});
});

describe("Folders react to other interactions as anticipated", () => {
	test("Closing and opening the folder updates hidden state", async () => {
		mockIPC(() => {}, { shouldMockEvents: true });
		const { getByText, getByRole } = render(() => (
			<For each={folders}>
				{(folder, _) => (
					<ProjectFolder
						id={folder.id}
						displayName={folder.name}
						curSelDirSetter={(_) => {}}
					/>
				)}
			</For>
		));

		emit(NEW_FOLDER_RECEIVED, GetTestFolder());
		emit(NEW_FILE_RECEIEVED, GetTestFile());

		const expandFolderIcon = getByRole("img", {
			name: `Expand ${folders[0].name}`,
		});

		await user.click(expandFolderIcon);

		const subFolderName = getByText(NEW_FOLDER_LABEL);
		const fileName = getByText(NEW_FILE_NAME);
		expect(expandFolderIcon).not.toBeInTheDocument();
		expect(subFolderName).toBeInTheDocument();
		expect(fileName).toBeInTheDocument();

		const collapseFolderIcon = getByRole("img", {
			name: `Collapse ${folders[0].name}`,
		});
		expect(collapseFolderIcon).toBeInTheDocument();

		await user.click(collapseFolderIcon);
		expect(collapseFolderIcon).not.toBeInTheDocument();
		expect(
			getByRole(`img`, { name: `Expand ${folders[0].name}` }),
		).toBeInTheDocument();
		expect(subFolderName).not.toBeInTheDocument();
		expect(fileName).not.toBeInTheDocument();
	});
});
