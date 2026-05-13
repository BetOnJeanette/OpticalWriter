import { render } from "@solidjs/testing-library";
import { emit } from "@tauri-apps/api/event";
import { mockIPC } from "@tauri-apps/api/mocks";
import { type UserEvent, userEvent } from "@testing-library/user-event";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { ProjectBin, ROOT_KEY } from "../ProjectBin";
import {
	type FolderCreated,
	NEW_FOLDER_RECEIVED,
} from "../ProjectBinFolderContents";
import {
	NEW_FILE_COMMAND,
	NEW_FOLDER_COMMAND,
	NEW_FOLDER_TITLE,
} from "../ProjectBinToolbar";

describe("Clicking on a folder updates where to add new items in the project bin", () => {
	let rendered: ReturnType<typeof render> | undefined;
	const FOLDER_NAMES = ["folder1", "folder2"];
	let user: UserEvent | undefined;

	beforeAll(() => {
		user = userEvent.setup();
		mockIPC(() => {}, { shouldMockEvents: true });
		rendered = render(() => <ProjectBin />);

		FOLDER_NAMES.forEach((folder) => {
			emit<FolderCreated>(NEW_FOLDER_RECEIVED, {
				newFolder: {
					displayName: folder,
					containedFolders: [],
					containedSources: [],
				},
				parentId: ROOT_KEY,
				id: folder,
			});
		});
	});

	test.each(
		FOLDER_NAMES,
	)("Clicking on %s before adding a folder results in %s being the parent", async (folder) => {
		const spy = vi.spyOn(window.__TAURI_INTERNALS__, "invoke");
		if (user === undefined || rendered === undefined) throw Error();
		await user.click(rendered.getByText(folder));
		await user.click(rendered.getByRole("button", { name: NEW_FOLDER_TITLE }));
		expect(spy).toBeCalledWith(
			NEW_FOLDER_COMMAND,
			{
				selectedFolderId: folder,
			},
			undefined,
		);
	});

	test.each(
		FOLDER_NAMES,
	)("Clicking on %s before adding a file results in %s being the parent", async (folder) => {
		const spy = vi.spyOn(window.__TAURI_INTERNALS__, "invoke");
		if (user === undefined || rendered === undefined) throw Error();
		await user.click(rendered.getByText(folder));
		await user.click(rendered.getByRole("button", { name: "+" }));
		expect(spy).toBeCalledWith(
			NEW_FILE_COMMAND,
			{
				selectedFolderId: folder,
			},
			undefined,
		);
	});
});
