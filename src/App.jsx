import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-7xl p-10">
        <h1 className="text-4xl font-bold text-teal-brand">Page content here</h1>
      </div>
    </div>
  );
}

export default App;