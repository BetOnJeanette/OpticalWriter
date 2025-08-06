/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

window.__TAURI_ISOLATION_HOOK__ = (payload) => {
    return payload;
}

render(() => <App />, document.getElementById("root") as HTMLElement);
