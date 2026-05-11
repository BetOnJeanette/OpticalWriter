import { render } from "@solidjs/testing-library";
import { emit } from "@tauri-apps/api/event";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { ROOT_KEY } from "../ProjectBin";
import {
	type FolderCreated,
	NEW_FOLDER_RECEIVED,
	ProjectBinFolderContents,
} from "../ProjectBinFolderContents";

describe("The folders listen to events from the backend", () => {
	beforeAll(() => {
		mockIPC(() => {}, { shouldMockEvents: true });
	});

	afterAll(() => {
		clearMocks();
	});
	test("New subfolders get added to its parent folder", async () => {
		const { getByText } = render(() => {
			return (
				<ProjectBinFolderContents
					id={ROOT_KEY}
					curSelDirSestter={vi.fn((_) => 1)}
					Expanded={() => true}
				/>
			);
		});
		const NEW_FOLDER_LABEL = "NewFolder";
		emit<FolderCreated>(NEW_FOLDER_RECEIVED, {
			newFolder: {
				displayName: NEW_FOLDER_LABEL,
				containedFolders: [],
				containedSources: [],
			},
			id: "awawawa",
			parentId: ROOT_KEY,
		});
		expect(getByText(NEW_FOLDER_LABEL)).toBeInTheDocument();
	});
});
