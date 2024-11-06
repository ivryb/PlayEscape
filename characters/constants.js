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

export const getAngleFromMovement = (up, down, left, right) => {
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

export const getAngleString = (angle) => {
  return angle.toString().padStart(3, "0");
};

export const convertFreeAngle = (angle) => {
  let normalizedAngle = angle;

  // Convert angle to closest 45-degree increment (0, 45, 90, 135, etc.)
  normalizedAngle = Math.round(normalizedAngle / 45) * 45;

  // Normalize angle to be between 0 and 360
  normalizedAngle = ((normalizedAngle % 360) + 360) % 360;

  return getAngleString(normalizedAngle);
};
