import { useRecoilValue } from "recoil";
import { visibilityState, confidenceThresholdState } from "../state/atoms";

export type LabelDataType = {
  type: "prediction" | "ground_truth" | "confidence";
  box: number[];
  label: string;
  confidence?: number;
};
type LabelOverlayProps = {
  labelData: LabelDataType;
};

const LabelOverlay = ({ labelData }: LabelOverlayProps) => {
  const visibility = useRecoilValue(visibilityState);
  const confidenceThreshold = useRecoilValue(confidenceThresholdState);

  if (!visibility.confidence) return null;
  if (
    labelData.confidence &&
    (labelData.confidence < confidenceThreshold.low ||
      labelData.confidence > confidenceThreshold.high)
  )
    return null;

  return (
    <>
      {visibility.confidence && labelData.confidence ? (
        <span className="absolute bottom-0 left-0 bg-red-900 text-white text-xs px-1 py-0 rounded-full font-medium">
          {labelData.confidence.toFixed(3)}
        </span>
      ) : null}
    </>
  );
};
export default LabelOverlay;
