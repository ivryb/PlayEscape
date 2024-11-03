const tileWidth = 256;
const tileHeight = 128;

export const convertObjectCoordinates = (obj) => {
  const offsetY = tileHeight * 3;
  const offsetX = tileWidth / 2;

  const tileY = obj.y / tileHeight;
  const tileX = obj.x / tileHeight;

  const x = offsetX + (tileX - tileY) * tileWidth * 0.5;
  const y = offsetY + (tileX + tileY) * tileHeight * 0.5;

  return Object.assign(obj, { x, y });
};
