import { atom, selector, selectorFamily } from "recoil";
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


// Somewhat Expensive! This iterates through 10k objects in the atom family.
// If any change, we iterate through all of them again
/*
export const selectedImageCountState = selector({
  key: "selectedImageCountState",
  get: ({ get }) => {
    const samples = get(imageSelector);
    return samples.filter((sample) => get(selectedImagesState(sample.id)))
      .length;
  },
});
*/

// Atom that tracks an immutable Set. We use this to maintain an O(1) lookup time
// as opposed to an O(n) lookup time of an array or the resubscription overhead of an
// atom family.
export const selectedIdsState = atom({
  key: "selectedIdsState",
  default: new Set<number>(),
});

// Clean selector that provides a getter and a setter that references and updates
// the selectedIdsState
export const isSelectedState = selectorFamily<boolean, number>({
  key: 'isSelectedState',
  get: (id) => ({ get }) => {
    const selectedIds = get(selectedIdsState);
    return selectedIds.has(id);
  },
  set: (id) => ({set}, newValue)=> {
    set(selectedIdsState, (prev)=>{
      const next = new Set(prev);
      if(newValue){
        next.add(id);
      }
      else{
        next.delete(id);
      }
      return next;
    })
  }
});

export const selectedImageCountState = selector({
  key: "selectedImageCountState",
  get: ({get}) => get(selectedIdsState).size,
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
