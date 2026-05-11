import { render } from "@solidjs/testing-library";
import { mockIPC } from "@tauri-apps/api/mocks";
import { userEvent } from "@testing-library/user-event";
import { For } from "solid-js";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { ROOT_KEY } from "../ProjectBin";
import { ProjectFolder } from "../ProjectBinFolder";

const user = userEvent.setup();

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
	let getByText: Function | undefined;
	const curDirSetter = vi.fn((_) => 1);
	beforeAll(() => {
		mockIPC(() => {}, { shouldMockEvents: true });
		const rendered = render(() => (
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
		getByText = rendered.getByText;
	});

	test.each(
		folders,
	)("clicking on subfolder $name invokes setter with the correct folder", async (folder) => {
		if (getByText === undefined) {
			throw Error();
		}
		const curFolder = getByText(folder.name);
		await user.click(curFolder);
		expect(curDirSetter).toHaveBeenCalledWith(folder.id);
	});
});

describe("Folders react to other interactions as anticipated", () => { 
	test("Closing and opening the folder changes the icon", async () => {
		const { getByRole } = render(() => (
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

		const expandFolderIcon = getByRole("img", {
			name: `Expand ${folders[0].name}`,
		});

		await user.click(expandFolderIcon);
		expect(expandFolderIcon).not.toBeInTheDocument();

		const collapseFolderIcon = getByRole("img", {
			name: `Collapse ${folders[0].name}`,
		});
		expect(collapseFolderIcon).toBeInTheDocument();

		await user.click(collapseFolderIcon);
		expect(collapseFolderIcon).not.toBeInTheDocument();
		expect(
			getByRole(`img`, { name: `Expand ${folders[0].name}` }),
		).toBeInTheDocument();
	});
});
