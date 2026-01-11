import { useEffect, useState, useCallback, useRef } from "react";
import { Grid } from "react-window";
import type { CellComponentProps } from "react-window";
import { Box, CircularProgress, Typography } from "@mui/material";
import { SampleService } from "../services/SampleService";
import LabelOverlay from "./LabelOverlay";
import type { LabelDataType } from "./LabelOverlay";

interface Sample {
  id: number;
  url: string;
  labels: LabelDataType[];
}

interface ContainerSize {
  width: number;
  height: number;
}

const MIN_COLUMN_WIDTH = 200;
const GAP = 4;

export default function ResponsiveGrid() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch all samples
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        setLoading(true);
        const response = await SampleService.getSamples(10000, 0);
        setSamples(response.samples as Sample[]);
        setError(null);
      } catch (err) {
        setError("Failed to load samples");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  // Measure container size
  useEffect(() => {
    if (loading) return;

    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    return () => ro.disconnect();
  }, [loading]);

  // Calculate columns based on container width
  const columnCount = Math.max(
    1,
    Math.floor(containerSize.width / MIN_COLUMN_WIDTH)
  );

  // Calculate actual column width by distributing available space
  const actualColumnWidth = Math.floor(containerSize.width / columnCount);
  const actualRowHeight = actualColumnWidth; // Keep square aspect ratio

  const rowCount = Math.ceil(samples.length / columnCount);

  // Cell renderer
  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: CellComponentProps) => {
      const index = rowIndex * columnCount + columnIndex;
      const sample = samples[index];

      if (!sample) {
        return <div style={style} />;
      }

      // Calculate image size (cell size minus gap)
      const imageSize = actualColumnWidth - GAP * 2;

      return (
        <div
          style={{
            ...style,
            padding: GAP,
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              width: imageSize,
              height: imageSize,
              backgroundColor: "background.paper",
              borderRadius: 1,
              overflow: "hidden",
              boxShadow: 2,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: 4,
              },
              position: "relative",
            }}
          >
            <img
              src={sample.url}
              alt={`Sample ${sample.id}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              //loading="lazy"
            />
            {sample.labels.map((label) => (
              <LabelOverlay key={label.type} labelData={label} />
            ))}
          </Box>
        </div>
      );
    },
    [samples, columnCount, actualColumnWidth]
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Loading samples...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100%",
        minWidth: 0,
        flexGrow: 1,
        overflow: "hidden",
      }}
    >
      {containerSize.width > 0 && containerSize.height > 0 && (
        <Grid
          cellComponent={Cell}
          cellProps={{}}
          columnCount={columnCount}
          columnWidth={actualColumnWidth}
          style={{
            height: containerSize.height,
            width: containerSize.width,
          }}
          rowCount={rowCount}
          rowHeight={actualRowHeight}
          overscanCount={9}
        />
      )}
    </Box>
  );
}
