import { atom } from "recoil";

export const visibilityState = atom({
  key: "visibilityState",
  default: {
    prediction: true,
    ground_truth: true,
    confidence: true,
  },
});
