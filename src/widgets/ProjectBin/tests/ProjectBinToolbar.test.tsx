import { render } from "@solidjs/testing-library";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ROOT_KEY } from "../ProjectBin";
import { NEW_FILE_COMMAND, ProjectBinToolbar } from "../ProjectBinToolbar";

const user = userEvent.setup();

afterEach(() => {
	clearMocks();
});

describe("Make sure the buttons function as expected", () => {
	test.each([
		ROOT_KEY,
		"aNestedFolderId",
	])("calls to add file at %s", async (currentFolder: string) => {
		mockIPC(() => {}, { shouldMockEvents: true });
		const { getByRole } = render(() => (
			<ProjectBinToolbar curSelFold={() => currentFolder} />
		));
		const addFileButton = getByRole("button", { name: "+" });
		const spy = vi.spyOn(window.__TAURI_INTERNALS__, "invoke");
		await user.click(addFileButton);
		expect(spy).toBeCalledWith(
			NEW_FILE_COMMAND,
			{
				selectedFolderId: currentFolder,
			},
			undefined,
		);
	});
});
