import { render } from "@solidjs/testing-library";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { afterAll, beforeAll, describe, test, vi } from "vitest";
import { ROOT_KEY } from "../ProjectBin";
import { ProjectBinFolderContents } from "../ProjectBinFolderContents";

describe("The folders listen to events from the backend", () => {
	beforeAll(() => {
		mockIPC(() => {}, { shouldMockEvents: true });
	});

	afterAll(() => {
		clearMocks();
	});

	test("New subfolders get added", () => {
		const { getByRole } = render(() => {
			<ProjectBinFolderContents
				id={ROOT_KEY}
				curSelDirSestter={vi.fn((_) => 1)}
				Expanded={() => true}
			/>;
		});
	});
});
