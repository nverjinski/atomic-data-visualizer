import { atom } from "recoil";

export const performanceStatsState = atom({
  key: "performanceStatsState",
  default: {
    totalRequested: 0,
    canceled: 0,
    fullyLoaded: 0,
  },
});
