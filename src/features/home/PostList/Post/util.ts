export const calculate = (x: number, maxX: number) => {
  const intercept = 3;
  const [y1, y2, y3] = [intercept, 0, -intercept];

  const slope1 = (y2 - y1) / (maxX / 2);
  const slope2 = (y3 - y2) / (maxX / 2);

  if (x <= maxX / 2) {
    return slope1 * x + (y1 - slope1 * 0);
  } else {
    return slope2 * x + (y2 - slope2 * (maxX / 2));
  }
};
