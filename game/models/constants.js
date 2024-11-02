export const characterStates = ["walk", "idle"];

export const characterAngles = [
  "000",
  "045",
  "090",
  "135",
  "180",
  "225",
  "270",
  "315",
];

export const getAngle = (up, down, left, right) => {
  if (up && right) return "045";
  if (up && left) return "315";
  if (down && right) return "135";
  if (down && left) return "225";
  if (up) return "000";
  if (down) return "180";
  if (left) return "270";
  if (right) return "090";
  return "180";
};
