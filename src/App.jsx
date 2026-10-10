import Logo from "./components/Logo";

function App() {
  return (
    <div className="p-10">
      <Logo />
      <div className="mt-6 bg-teal-brand p-6">
        <Logo light />
      </div>
    </div>
  );
}

export default App;