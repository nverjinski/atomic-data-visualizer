import { useRecoilValue } from "recoil";
import { visibilityState } from "../state/atoms";

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

  if (!visibility[labelData.type as keyof typeof visibility]) return null;

  const [x, y, w, h] = labelData.box;

  return (
    <>
      <div
        className={`absolute border-2 pointer-events-none ${
          labelData.type === "prediction"
            ? "border-red-500"
            : "border-green-500"
        }`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${w}%`,
          height: `${h}%`,
        }}
      >
        {/*<span className="label-text">{labelData.label}</span>*/}
      </div>
    </>
  );
};
export default LabelOverlay;
