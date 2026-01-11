import { useState, useCallback } from "react";
import type { Sample } from "./ResponsiveGrid";
import { Box } from "@mui/material";
import { LabelOverlay } from "./index";

interface ImageProps {
  imageSample: Sample;
  imageSize: number;
}

const LazyImage = ({ imageSample: sample, imageSize }: ImageProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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

  return (
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
        //loading="lazy" // we're implementing our own lazy loading
      />
      {imageFailed && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #404040 0%, #000000 100%)",
            //filter: "blur(4px)",
            display: "block",
          }}
        />
      )}
      {sample.labels.map((label) => (
        <LabelOverlay key={label.type} labelData={label} />
      ))}
    </Box>
  );
};

export default LazyImage;
