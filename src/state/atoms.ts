import { atom } from "recoil";

export const visibilityState = atom({
  key: "visibilityState",
  default: {
    prediction: false,
    ground_truth: false,
    confidence: false,
  },
});
