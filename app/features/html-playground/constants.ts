import type { PlaygroundCode } from "./types";

export const PLAYGROUND_STORAGE_KEY = "phaicom-html-playground";

export const DEFAULT_CODE: PlaygroundCode = {
  html: `<h1>Hello World</h1>
<p>Edit the HTML, CSS or JavaScript and press Run.</p>

<button id="hello-btn">
  Click me
</button>`,
  css: `body {
  font-family: system-ui, sans-serif;
  padding: 32px;
}

h1 {
  color: #2563eb;
}

button {
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}`,
  javascript: `document
  .getElementById("hello-btn")
  ?.addEventListener("click", () => {
    alert("Hello from the playground!");
  });`,
};
