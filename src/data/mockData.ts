export const samples = Array.from({ length: 10000 }).map((_, i) => ({
  id: i,
  url: `https://picsum.photos/200/200?random=${i}`,
  labels: [
    {
      type: "prediction",
      box: [Math.random() * 100, Math.random() * 100, 50, 50],
      label: "car",
      confidence: Math.random(),
    },
    {
      type: "ground_truth",
      box: [Math.random() * 100, Math.random() * 100, 45, 45],
      label: "car",
      confidence: Math.random(),
    },
  ],
}));
