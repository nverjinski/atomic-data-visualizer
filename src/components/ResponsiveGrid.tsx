import { useEffect, useState, useCallback, useRef } from "react";
import { Grid } from "react-window";
import type { CellComponentProps } from "react-window";
import { Box, CircularProgress, Typography } from "@mui/material";
import { SampleService } from "../services/SampleService";
import LabelOverlay from "./LabelOverlay";
import type { LabelDataType } from "./LabelOverlay";
import { useRecoilValue } from "recoil";
import { imageSelector } from "../state/atoms";

interface Sample {
  id: number;
  url: string;
  labels: LabelDataType[];
}

interface ContainerSize {
  width: number;
  height: number;
}

const MIN_COLUMN_WIDTH = 100;
const GAP = 2;

export default function ResponsiveGrid() {
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const samples = useRecoilValue(imageSelector) as Sample[];

  // Measure container size
  useEffect(() => {
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
  }, []);

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
      const [imageFailed, setImageFailed] = useState(false);
      const [retryCount, setRetryCount] = useState(0);
      const index = rowIndex * columnCount + columnIndex;
      const sample = samples[index];

      // Handle image errors with automatic retry
      const handleImageError = useCallback(() => {
        setImageFailed(true);
        if (retryCount < 2) {
          // Retry up to 2 times with 1 second delay
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 1000);
        }
      }, [retryCount]);

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
              key={retryCount} // Force remount on retry
              src={sample.url}
              alt={`Sample ${sample.id}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={handleImageError}
              onLoad={() => {
                setImageFailed(false);
              }}
              //loading="lazy"
            />
            {imageFailed && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #404040 0%, #000000 100%)",
                  //filter: "blur(4px)",
                  display: "block",
                }}
              />
            )}
            {sample.labels.map((label) => (
              <LabelOverlay key={label.type} labelData={label} />
            ))}
          </Box>
        </div>
      );
    },
    [samples, columnCount, actualColumnWidth]
  );

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
          overscanCount={5} // setting this high will look better, but using a priority queue is smarter
        />
      )}
    </Box>
  );
}
