import { ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Button,
  Typography,
  Box,
  Paper,
  Container,
} from "@mui/material";
import { DataObject as DataObjectIcon } from "@mui/icons-material";
import theme from "./theme";
import { Sidebar } from "./components";

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
            overflow: "auto",
            backgroundColor: (theme) => theme.palette.voxel.gray800,
          }}
        >
          <Box sx={{ display: "flex", minHeight: "100%" }}>
            <Sidebar />
            <Container maxWidth="lg" disableGutters sx={{ p: 2, flexGrow: 1 }}>
              <Box sx={{ py: 4 }}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, mb: 3, backgroundColor: "background.paper" }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <DataObjectIcon />
                    Material-UI Integration
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Your app now supports Material-UI components! This Paper
                    component demonstrates the dark theme integration.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button variant="contained" color="primary">
                      Primary Button
                    </Button>
                    <Button variant="outlined" color="secondary">
                      Secondary Button
                    </Button>
                    <Button variant="text">Text Button</Button>
                  </Box>
                </Paper>

                {/* Original Content */}
                <div className="text-xl font-semibold mb-4 text-primary-text">
                  Data Visualization
                </div>
                <div className="text-primary-text">
                  This is a data visualization of the atomic data.
                </div>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
