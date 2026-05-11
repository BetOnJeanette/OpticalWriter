import { render } from "@solidjs/testing-library";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { userEvent } from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { ROOT_KEY } from "../ProjectBin";
import {
	NEW_FILE_COMMAND,
	NEW_FOLDER_COMMAND,
	NEW_FOLDER_TITLE,
	ProjectBinToolbar,
} from "../ProjectBinToolbar";

const user = userEvent.setup();

describe("Make sure the buttons function as expected", () => {
	beforeAll(() => {
		mockIPC(() => {});
	});

	afterAll(() => {
		clearMocks();
	});

	test.each([
		ROOT_KEY,
		"aNestedFolderId",
	])("calls to add file at %s", async (currentFolder: string) => {
		const spy = vi.spyOn(window.__TAURI_INTERNALS__, "invoke");
		const { getByRole } = render(() => (
			<ProjectBinToolbar curSelFold={() => currentFolder} />
		));
		const addFileButton = getByRole("button", { name: "+" });
		await user.click(addFileButton);
		expect(spy).toBeCalledWith(
			NEW_FILE_COMMAND,
			{
				selectedFolderId: currentFolder,
			},
			undefined,
		);
	});
	test.each([
		ROOT_KEY,
		"aNestedFolderId",
	])("calls to add folder at %s", async (currentFolder: string) => {
		const spy = vi.spyOn(window.__TAURI_INTERNALS__, "invoke");
		const { getByRole } = render(() => (
			<ProjectBinToolbar curSelFold={() => currentFolder} />
		));
		const addFolderButton = getByRole("button", { name: NEW_FOLDER_TITLE });
		await user.click(addFolderButton);
		expect(spy).toBeCalledWith(
			NEW_FOLDER_COMMAND,
			{
				selectedDirId: currentFolder,
			},
			undefined,
		);
	});
});
