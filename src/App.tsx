import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import { Sidebar, ResponsiveGrid } from "./components";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Header Section - Full Width */}
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

        {/* Content Section with Sidebar */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            backgroundColor: (theme) => theme.palette.voxel.gray800,
          }}
        >
          <Box sx={{ display: "flex", height: "100%" }}>
            <Sidebar />
            <ResponsiveGrid />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
