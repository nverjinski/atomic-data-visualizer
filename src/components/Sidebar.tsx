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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRecoilState } from "recoil";
import { visibilityState } from "../state/atoms";

const SIDEBAR_WIDTH = 250;

const labelItems = ["Prediction", "Ground Truth", "Confidence"];

export default function Sidebar() {
  const [visibility, setVisibility] = useRecoilState(visibilityState);

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
      padding: "8px 16px",
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
            "&:before": {
              display: "none",
            },
            borderBottom: "1px solid",
            borderColor: (theme) => theme.palette.voxel.border,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              minHeight: 48,
              "&.Mui-expanded": {
                minHeight: 48,
              },
            }}
          >
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
      </List>
    </Drawer>
  );
}

export { SIDEBAR_WIDTH };
