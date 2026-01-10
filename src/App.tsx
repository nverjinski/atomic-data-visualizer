function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-dark">
      {/* Header Section */}
      <div className="bg-gray-900 border-b border-border p-2">
        <div className="flex-col items-start py-5 px-3">
          <div className="text-3xl font-bold mb-2 text-primary-text">
            Atomic Data Visualizer
          </div>
          <div className="text-lg text-primary-text">
            An experiment in virtualization and atomic state management
          </div>
        </div>
      </div>

      {/* Content Section - Takes up remaining space */}
      <div className="flex grow bg-gray-800 p-2">
        {/* Content will go here */}
        <div className="w-full">
          <div className="text-xl font-semibold mb-4 text-primary-text">
            Data Visualization
          </div>
          <div className="text-primary-text">
            This is a data visualization of the atomic data.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
