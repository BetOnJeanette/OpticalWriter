import { createSignal, JSXElement } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { ProjectBin } from "./widgets/ProjectBin/ProjectBin";

function App(): JSXElement {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  return (
    <main class="container">
      <ProjectBin />
    </main>
  );
}

export default App;
