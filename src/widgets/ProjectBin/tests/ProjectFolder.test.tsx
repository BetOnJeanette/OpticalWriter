import { render } from "@solidjs/testing-library";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ROOT_KEY } from "../ProjectBin";
import { ProjectFolder } from "../ProjectBinFolder";

const user = userEvent.setup();

function invokeSpy() {
	return vi.spyOn(window.__TAURI_INTERNALS__, "invoke");
}

describe("Make sure folders render as expected", () => {
    afterEach(() => {
        clearMocks();
    })

    test("clicking on subfolder invokes setter with the correct folder", async () => {
        mockIPC(() => {}, { shouldMockEvents: true });
        const rootLabel = "root";
        const otherLabel = "Another folder";
        const curDirSetter = vi.fn((_) => 1);
        const { getByText } = render(() => (
            <>
                <ProjectFolder id={ROOT_KEY} displayName={rootLabel} curSelDirSetter={curDirSetter}/> 
                <ProjectFolder id={"awawaa"} displayName={otherLabel} curSelDirSetter={curDirSetter}/> 
            </>
        ));
        const projectRoot = getByText(rootLabel); 
        const otherFolder = getByText(otherLabel);

        await user.click(otherFolder);
        expect(curDirSetter).toHaveBeenCalledWith("awawaa");
        
        await user.click(projectRoot);
        expect(curDirSetter).toHaveBeenCalledWith(ROOT_KEY);
    });
})
