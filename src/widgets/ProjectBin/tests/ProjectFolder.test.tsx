import { render } from "@solidjs/testing-library";
import { mockIPC } from "@tauri-apps/api/mocks";
import { userEvent } from "@testing-library/user-event";
import { For } from "solid-js";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { ROOT_KEY } from "../ProjectBin";
import { ProjectFolder } from "../ProjectBinFolder";

const user = userEvent.setup();

describe("Make sure folders render as expected", () => {
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
	)("clicking on subfolder %s invokes setter with the correct folder", async (folder) => {
		if (getByText === undefined) {
			throw Error();
		}
		const curFolder = getByText(folder.name);
		await user.click(curFolder);
		expect(curDirSetter).toHaveBeenCalledWith(folder.id);
	});
});
