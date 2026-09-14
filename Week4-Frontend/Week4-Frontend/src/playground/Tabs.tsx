import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * Tabs implemented against the WAI-ARIA APG "Tabs" pattern (automatic activation):
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Requirements this satisfies:
 * - role="tablist" on the container, role="tab" on each tab, role="tabpanel" on each panel
 * - aria-selected reflects the active tab; inactive tabs are not in the tab order
 *   (roving tabindex: only the active tab has tabIndex 0, others get -1)
 * - aria-controls / id links each tab to its panel; aria-labelledby links each
 *   panel back to its tab
 * - ArrowLeft/ArrowRight move focus AND selection between tabs (automatic
 *   activation), Home/End jump to first/last tab, focus wraps around
 * - Tab key moves focus out of the tablist entirely, into the active panel
 */

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  label: string; // accessible name for the tablist
}

export function Tabs({ tabs, label }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectIndex(index: number) {
    const clamped = (index + tabs.length) % tabs.length; // wrap around
    setActiveIndex(clamped);
    tabRefs.current[clamped]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        selectIndex(activeIndex + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        selectIndex(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        selectIndex(0);
        break;
      case "End":
        event.preventDefault();
        selectIndex(tabs.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tabs-list">
        {tabs.map((tab, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className="tab"
              onClick={() => setActiveIndex(index)}
              onKeyDown={handleKeyDown}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={index !== activeIndex}
          tabIndex={0}
          className="tab-panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
