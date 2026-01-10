export const samples = Array.from({ length: 10000 }).map((_, i) => ({
  id: i,
  url: `https://picsum.photos/id/${i % 1000}/400/400`, // Cycles through 1000 images
  labels: [
    {
      type: "prediction",
      box: [Math.random() * 100, Math.random() * 100, 50, 50],
      label: "car",
    },
    {
      type: "ground_truth",
      box: [Math.random() * 100, Math.random() * 100, 45, 45],
      label: "car",
    },
  ],
}));
