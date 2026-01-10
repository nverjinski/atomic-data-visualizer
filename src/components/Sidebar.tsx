import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SIDEBAR_WIDTH = 250;

const sections = [
  {
    title: "Metadata",
    items: ["Item 1", "Item 2", "Item 3"],
  },
  {
    title: "Labels",
    items: ["Item 1", "Item 2", "Item 3"],
  },
  {
    title: "Primitives",
    items: ["Item 1", "Item 2", "Item 3"],
  },
];

export default function Sidebar() {
  const handleItemClick = () => {
    // Noop - no action on click
  };

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
        {sections.map((section) => (
          <Accordion
            key={section.title}
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
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List disablePadding>
                {section.items.map((item, index) => (
                  <ListItem key={`${section.title}-${index}`} disablePadding>
                    <ListItemButton onClick={handleItemClick}>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          variant: "body2",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
    </Drawer>
  );
}

export { SIDEBAR_WIDTH };
