import { useRecoilValue } from "recoil";
import { visibilityState } from "../state/atoms";

export type LabelDataType = {
  type: "prediction" | "ground_truth" | "confidence";
  box: number[];
  label: string;
  confidence: number;
};
type LabelOverlayProps = {
  labelData: LabelDataType;
};

const LabelOverlay = ({ labelData }: LabelOverlayProps) => {
  const visibility = useRecoilValue(visibilityState);

  if (!visibility[labelData.type as keyof typeof visibility]) return null;

  const [x, y, w, h] = labelData.box;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
        border:
          labelData.type === "prediction" ? "2px solid red" : "2px solid green",
        pointerEvents: "none", // Ensures clicks go through to the image
      }}
    >
      <span className="label-text">{labelData.label}</span>
    </div>
  );
};
export default LabelOverlay;
