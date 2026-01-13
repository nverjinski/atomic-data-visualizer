import { atom, atomFamily, selector } from "recoil";
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
    low: 0,
    high: 1,
  },
});

export const selectedImagesState = atomFamily({
  key: "selectedImageState",
  default: false,
});

export const selectedImageCount = selector({
  key: "selectedImageCount",
  get: ({ get }) => {
    const samples = get(imageSelector);
    return samples.filter((sample) => get(selectedImagesState(sample.id)))
      .length;
  },
});

export const filterImagesState = atom({
  key: "filterImagesState",
  default: false,
});

export const filteredImagesByConfidenceSelector = selector({
  key: "filteredImagesByConfidence",
  get: ({ get }) => {
    const images = get(imageSelector);
    const thresholds = get(confidenceThresholdState);

    return images.filter((image) => {
      // The first label always has the confidence value
      const firstLabel = image.labels[0];
      if (!firstLabel || firstLabel.confidence === undefined) {
        return true; // Keep images without confidence values
      }

      // Keep images where confidence is within range
      return (
        firstLabel.confidence >= thresholds.low &&
        firstLabel.confidence <= thresholds.high
      );
    });
  },
});
