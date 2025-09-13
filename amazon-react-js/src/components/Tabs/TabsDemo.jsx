import Tabs from "./Tabs";

const sampleTabs = [
  {
    label: "Home",
    content: (
      <div>
        <h3>Home Content</h3>
        <p>This is the home tab content.</p>
      </div>
    ),
  },
  {
    label: "About",
    content: (
      <div>
        <h3>About Content</h3>
        <p>This is the about tab content.</p>
      </div>
    ),
  },
  {
    label: "Contact",
    content: (
      <div>
        <h3>Contact Content</h3>
        <p>This is the contact tab content.</p>
      </div>
    ),
  },
];

export default function TabsDemo() {
  return (
    <div>
      <h2>Tabs</h2>
      <Tabs tabs={sampleTabs} />
    </div>
  );
}
