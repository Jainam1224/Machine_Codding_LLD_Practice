import Accordion from "./Accordion";

const sampleItems = [
  {
    title: "What is React?",
    content:
      "React is a JavaScript library for building user interfaces, particularly web applications.",
  },
  {
    title: "What are hooks?",
    content:
      "Hooks are functions that let you use state and other React features in functional components.",
  },
  {
    title: "What is JSX?",
    content:
      "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.",
  },
];

export default function AccordionDemo() {
  return (
    <div>
      <h2>Accordion</h2>
      <Accordion items={sampleItems} />
    </div>
  );
}
