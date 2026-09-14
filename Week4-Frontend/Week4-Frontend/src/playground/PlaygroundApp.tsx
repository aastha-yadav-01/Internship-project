import { useState } from "react";
import { Modal } from "./Modal";
import { Tabs, type TabItem } from "./Tabs";
import { Disclosure } from "./Disclosure";
import "./playground.css";

const tabItems: TabItem[] = [
  { id: "profile", label: "Profile", content: <p>Profile panel content.</p> },
  { id: "settings", label: "Settings", content: <p>Settings panel content.</p> },
  { id: "billing", label: "Billing", content: <p>Billing panel content.</p> },
];

export function PlaygroundApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="playground-app">
      <h1>Accessible Components Playground</h1>

      <section>
        <h2>Modal</h2>
        <button type="button" onClick={() => setIsModalOpen(true)}>
          Open modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          titleId="demo-modal-title"
          title="Example dialog"
        >
          <p>Try Tab, Shift+Tab, and Escape. Focus should stay trapped in here.</p>
          <input type="text" placeholder="Focusable input" />
        </Modal>
      </section>

      <section>
        <h2>Tabs</h2>
        <Tabs tabs={tabItems} label="Account settings" />
      </section>

      <section>
        <h2>Disclosure</h2>
        <Disclosure summary="What is this playground for?">
          <p>
            It's three hand-built components tested against the ARIA Authoring
            Practices Guide, before comparing them to shadcn/ui's versions.
          </p>
        </Disclosure>
      </section>
    </main>
  );
}
