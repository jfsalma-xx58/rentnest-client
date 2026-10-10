import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 p-10">
        <h1 className="text-4xl font-bold text-teal-brand">Page content here</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App;