import TabSystem from "./components/TabSystem";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1>Amazon LLD Interview Practice</h1>
        <p>React.js Components for Technical Interview</p>
      </header>

      <main>
        <TabSystem />
      </main>
    </div>
  );
}

export default App;
