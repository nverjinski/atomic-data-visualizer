import { atom, selector } from "recoil";
import { SampleService } from "../services/SampleService";

export const visibilityState = atom({
  key: "visibilityState",
  default: {
    prediction: false,
    ground_truth: false,
    confidence: false,
  },
});

export const imageRefreshTrigger = atom({
  key: "imageRefreshTrigger",
  default: 0,
});

export const imageSelector = selector({
  key: "imageQuery",
  get: async ({ get }) => {
    get(imageRefreshTrigger); // This makes the selector re-run when the trigger is updated
    const response = await SampleService.getSamples(10000, 0);
    return response.samples;
  },
});

export const confidenceThresholdState = atom({
  key: "confidenceThresholdState",
  default: {
    low: 0.001,
    high: 0.999,
  },
});
