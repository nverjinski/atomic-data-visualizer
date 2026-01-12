import { useState, useEffect, useCallback, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { performanceStatsState } from "../state/performanceAtoms";
import type { Sample } from "./ResponsiveGrid";
import { Box } from "@mui/material";
import { LabelOverlay, ConfidenceOverlay } from "./index";

// Module-level cache that persists across component unmounts/remounts
const imageCache = new Map<string, string>();

interface ImageProps {
  imageSample: Sample;
  imageSize: number;
  scrollContainer?: HTMLElement;
}

const LazyImage = ({
  imageSample: sample,
  imageSize,
  scrollContainer,
}: ImageProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  // Initialize with cached image if available
  const [imgSrc, setImgSrc] = useState<string | null>(
    () => imageCache.get(sample.url) || null
  );

  const setStats = useSetRecoilState(performanceStatsState);

  const abortControllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Core loading logic with retry capability
   * Handles the manual fetch to allow for AbortController cancellation
   */
  const loadImage = useCallback(
    async (signal: AbortSignal, attempt = 0) => {
      try {
        const res = await fetch(sample.url, { signal });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);

        // Cache the loaded image
        imageCache.set(sample.url, objectUrl);

        setImgSrc(objectUrl);
        setImageFailed(false);
        setStats((s) => ({ ...s, fullyLoaded: s.fullyLoaded + 1 }));
      } catch (err: any) {
        if (err.name === "AbortError") {
          setStats((s) => ({ ...s, canceled: s.canceled + 1 }));
          return;
        }

        // Network Retry Logic
        if (attempt < 2) {
          setTimeout(() => loadImage(signal, attempt + 1), 1500);
        } else {
          setImageFailed(true);
        }
      }
    },
    [sample.url, setStats]
  );

  useEffect(() => {
    // If image is already cached, no need to observe - just display it
    if (imgSrc) {
      return;
    }

    // Wait for scrollContainer to be available before creating observer
    if (!scrollContainer) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // In Viewport - start loading if not already loading
          if (!abortControllerRef.current) {
            const controller = new AbortController();
            abortControllerRef.current = controller;
            setStats((s) => ({ ...s, totalRequested: s.totalRequested + 1 }));
            loadImage(controller.signal);
          }
        } else {
          // Not in Viewport - abort if still loading
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
          }
        }
      },
      {
        root: scrollContainer, // Explicitly use Grid's scroll container
        rootMargin: "500px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [sample.url, loadImage, setStats, imgSrc, scrollContainer]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: imageSize,
        height: imageSize,
        backgroundColor: "background.paper",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 4,
        },
        position: "relative",
      }}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={`Sample ${sample.id}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      {imageFailed && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #404040 0%, #000000 100%)",
          }}
        />
      )}

      {sample.labels.map((label, idx) => (
        <>
          <LabelOverlay
            key={`label-${sample.id}-${label.type}-${idx}`}
            labelData={label}
          />
          <ConfidenceOverlay
            key={`confidence-${sample.id}-${label.type}-${idx}`}
            labelData={label}
          />
        </>
      ))}
    </Box>
  );
};

export default LazyImage;
