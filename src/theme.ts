import { createTheme } from "@mui/material/styles";

// Create a dark theme that matches your Voxel51 colors from index.css
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff6b35", // --color-primary
    },
    secondary: {
      main: "#ff8c42", // --color-secondary
    },
    background: {
      default: "#18191b", // --color-dark
      paper: "#1d1d1d", // --color-gray-900
    },
    text: {
      primary: "#ffffff", // --color-primary-text
      secondary: "#b8b8b8", // --color-secondary-text
    },
    // Extended colors from index.css
    grey: {
      900: "#1d1d1d", // --color-gray-900
      800: "#262626", // --color-gray-800
      700: "#2a2a2a", // --color-gray-700
    },
    divider: "#2d2d2d", // --color-border
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#18191b",
        },
      },
    },
  },
});

// Extend the theme with custom colors
declare module "@mui/material/styles" {
  interface Palette {
    voxel: {
      primary: string;
      secondary: string;
      dark: string;
      darkBlue: string;
      gray900: string;
      gray800: string;
      gray700: string;
      border: string;
      primaryText: string;
      secondaryText: string;
      mutedText: string;
    };
  }
  interface PaletteOptions {
    voxel?: {
      primary?: string;
      secondary?: string;
      dark?: string;
      darkBlue?: string;
      gray900?: string;
      gray800?: string;
      gray700?: string;
      border?: string;
      primaryText?: string;
      secondaryText?: string;
      mutedText?: string;
    };
  }
}

// Add custom colors to the theme
const extendedTheme = createTheme(theme, {
  palette: {
    voxel: {
      primary: "#ff6b35", // --color-primary
      secondary: "#ff8c42", // --color-secondary
      dark: "#18191b", // --color-dark
      darkBlue: "#1a1a2e", // --color-dark-blue
      gray900: "#1d1d1d", // --color-gray-900
      gray800: "#262626", // --color-gray-800
      gray700: "#2a2a2a", // --color-gray-700
      border: "#2d2d2d", // --color-border
      primaryText: "#ffffff", // --color-primary-text
      secondaryText: "#b8b8b8", // --color-secondary-text
      mutedText: "#888888", // --color-muted-text
    },
  },
});

export default extendedTheme;
