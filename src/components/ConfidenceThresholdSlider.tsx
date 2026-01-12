import { Box, Typography, Slider } from "@mui/material";
import { useRecoilState } from "recoil";
import { confidenceThresholdState } from "../state/atoms";

const ConfidenceThresholdSlider = () => {
  const [confidenceThreshold, setConfidenceThreshold] = useRecoilState(
    confidenceThresholdState
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Confidence Threshold:
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {confidenceThreshold.low.toFixed(3)} -{" "}
        {confidenceThreshold.high.toFixed(3)}
      </Typography>
      <Slider
        value={[confidenceThreshold.low, confidenceThreshold.high]}
        onChange={(event, newValue) => {
          const [low, high] = newValue as number[];
          setConfidenceThreshold({ low, high });
        }}
        min={0}
        max={1}
        step={0.001}
        valueLabelDisplay="auto"
        marks={[
          { value: 0, label: "0" },
          { value: 0.5, label: "0.5" },
          { value: 1, label: "1" },
        ]}
      />
    </Box>
  );
};

export default ConfidenceThresholdSlider;
