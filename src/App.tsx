import { JSXElement } from "solid-js";
import "./App.css";
import { ProjectBin } from "./widgets/ProjectBin/ProjectBin";

function App(): JSXElement {
  return (
    <main class="container">
      <ProjectBin />
    </main>
  );
}

export default App;
