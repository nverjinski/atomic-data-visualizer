import { useMemo } from "react";
import {
  Drawer,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRecoilState, useRecoilValue } from "recoil";
import { visibilityState } from "../state/atoms";
import { performanceStatsState } from "../state/performanceAtoms";
import { ConfidenceThresholdSlider } from "./index";

type PerformanceStats = {
  totalRequested: number;
  canceled: number;
  fullyLoaded: number;
};

const SIDEBAR_WIDTH = 250;

const labelItems = ["Prediction", "Ground Truth", "Confidence"];
const performanceItems: Array<{ label: string; key: keyof PerformanceStats }> =
  [
    { label: "Total Requested", key: "totalRequested" },
    { label: "Canceled", key: "canceled" },
    { label: "Fully Loaded", key: "fullyLoaded" },
  ];

export default function Sidebar() {
  const [visibility, setVisibility] = useRecoilState(visibilityState);
  const performanceStats = useRecoilValue(performanceStatsState);

  // Create stable change handlers to prevent re-renders
  const changeHandlers = useMemo(
    () => ({
      prediction: (
        event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
      ) => setVisibility((prev) => ({ ...prev, prediction: checked })),
      ground_truth: (
        event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
      ) => setVisibility((prev) => ({ ...prev, ground_truth: checked })),
      confidence: (
        event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
      ) => setVisibility((prev) => ({ ...prev, confidence: checked })),
    }),
    [setVisibility]
  );

  // Memoize the sx object to prevent recreation on every render
  const formControlSx = useMemo(
    () => ({
      width: "100%",
      margin: 0,
      paddingX: "4px",
      paddingY: "4px",
      "& .MuiFormControlLabel-label": {
        fontSize: "0.875rem",
      },
    }),
    []
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          borderRight: "1px solid",
          borderColor: (theme) => theme.palette.voxel.border,
          position: "relative",
        },
      }}
    >
      <List sx={{ width: "100%", p: 0 }}>
        <Accordion
          defaultExpanded
          disableGutters
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            borderBottom: "1px solid",
            borderColor: (theme) => theme.palette.voxel.border,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight={600}>
              Labels
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List disablePadding>
              {labelItems.map((item) => {
                const key = item
                  .toLowerCase()
                  .replace(" ", "_") as keyof typeof visibility;
                const checked = visibility[key];
                const onChange = changeHandlers[key];

                return (
                  <ListItem key={item} disablePadding>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={onChange}
                          size="small"
                        />
                      }
                      label={item}
                      sx={formControlSx}
                    />
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion
          defaultExpanded
          disableGutters
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            borderBottom: "1px solid",
            borderColor: (theme) => theme.palette.voxel.border,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight={600}>
              Filters
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <ConfidenceThresholdSlider />
          </AccordionDetails>
        </Accordion>
        <Accordion
          defaultExpanded
          disableGutters
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            borderBottom: "1px solid",
            borderColor: (theme) => theme.palette.voxel.border,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight={600}>
              Performance
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List disablePadding>
              {performanceItems.map((item) => {
                const value = performanceStats[item.key];

                return (
                  <ListItem key={item.label} disablePadding>
                    <Box
                      sx={{
                        width: "100%",
                        padding: "8px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary"
                      >
                        {value}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      </List>
    </Drawer>
  );
}

export { SIDEBAR_WIDTH };
