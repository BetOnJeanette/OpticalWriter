import { cleanup, render, screen } from "@solidjs/testing-library";
import { emit } from "@tauri-apps/api/event";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { createSignal } from "solid-js";
import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	test,
	vi,
} from "vitest";
import { ROOT_KEY } from "../ProjectBin";
import {
	type FileAdded,
	type FolderCreated,
	NEW_FILE_RECEIEVED,
	NEW_FOLDER_RECEIVED,
	ProjectBinFolderContents,
} from "../ProjectBinFolderContents";

const NEW_FOLDER_LABEL = "NewFolder";
const NEW_FILE_NAME = "NewFile";

function GetTestFolder(parent?: string) {
	if (parent === undefined) parent = ROOT_KEY;
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

function GetTestFile(parent?: string) {
	if (parent === undefined) parent = ROOT_KEY;
	return {
		newFile: {
			path: "/",
			displayName: NEW_FILE_NAME,
		},
		id: "awawa",
		parentId: parent,
	};
}

describe("Folders listen to events from the backend", () => {
	const PARENT_FOLDERS = [ROOT_KEY, "AnotherFolder"];

	beforeAll(() => {
		mockIPC(() => {}, { shouldMockEvents: true });
	});

	afterAll(() => {
		clearMocks();
	});

	afterEach(() => {
		cleanup();
	});

	test.each(
		PARENT_FOLDERS,
	)("New subfolders get added if its parent folder, %s, matches the observed ROOT_KEY", async (parent) => {
		const { getByText } = render(() => {
			return (
				<ProjectBinFolderContents
					id={ROOT_KEY}
					curSelDirSestter={vi.fn((_) => 1)}
					Expanded={() => true}
				/>
			);
		});
		emit<FolderCreated>(NEW_FOLDER_RECEIVED, GetTestFolder(parent));
		if (parent === ROOT_KEY) {
			expect(getByText(NEW_FOLDER_LABEL)).toBeInTheDocument();
		} else {
			const newFolder = screen.queryByText(NEW_FOLDER_LABEL);
			expect(newFolder).not.toBeInTheDocument();
		}
	});
	test.each(
		PARENT_FOLDERS,
	)("New files get added if its parent folder, %s, matches the observed ROOT_KEY", async (parent) => {
		const { getByText } = render(() => {
			return (
				<ProjectBinFolderContents
					id={ROOT_KEY}
					curSelDirSestter={vi.fn((_) => 1)}
					Expanded={() => true}
				/>
			);
		});
		emit<FileAdded>(NEW_FILE_RECEIEVED, GetTestFile(parent));
		if (parent === ROOT_KEY) {
			expect(getByText(NEW_FILE_NAME)).toBeInTheDocument();
		} else {
			const newFolder = screen.queryByText(NEW_FILE_NAME);
			expect(newFolder).not.toBeInTheDocument();
		}
	});
});

describe("Collapsed state is respected", () => {
	const [isExpanded, setExpanded] = createSignal<boolean>(false);

	let rendered: ReturnType<typeof render> | undefined;

	beforeAll(() => {
		mockIPC(() => {}, { shouldMockEvents: true });
		rendered = render(() => (
			<ProjectBinFolderContents
				id={ROOT_KEY}
				curSelDirSestter={(_) => {}}
				Expanded={isExpanded}
			/>
		));

		emit<FileAdded>(NEW_FILE_RECEIEVED, GetTestFile());
		emit<FolderCreated>(NEW_FOLDER_RECEIVED, GetTestFolder());
	});

	test("Contents are shown when expanded", () => {
		setExpanded(true);
		expect(rendered?.getByText(NEW_FOLDER_LABEL)).toBeInTheDocument();
		expect(rendered?.getByText(NEW_FILE_NAME)).toBeInTheDocument();
	});

	test("Contents are hiddent when contracted", () => {
		setExpanded(false);
		expect(screen.queryByText(NEW_FOLDER_LABEL)).not.toBeInTheDocument();
		expect(screen.queryByText(NEW_FILE_NAME)).not.toBeInTheDocument();
	});
});
