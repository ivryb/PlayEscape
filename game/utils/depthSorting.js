// depth calculation for the player — based on their Y coordinate and X position
export const getPlayerDynamicDepth = (player) => {
  return player.y;
};

// depth calculation for tiles that have a hitbox
const getMatterBodyDepth = (matterTileBody) => {
  const { min, max } = matterTileBody.body.bounds;

  const centerY = (min.y + max.y) * 0.5;

  return centerY;
};

// depth calculation for tiles that don't have a hitbox — based on their Y and X coordinates
const getTileDefaultDynamicDepth = (tile) => {
  return tile.pixelY + tile.height - tile.baseHeight / 2;
};

const getTileDynamicDepth = (tile) => {
  return tile.physics.matterBody
    ? getMatterBodyDepth(tile.physics.matterBody)
    : getTileDefaultDynamicDepth(tile);
};

export function makeDynamicDepthLayer(scene, layer) {
  layer.forEachTile((tile) => {
    if (tile.index !== -1) {
      const tileset = tile.layer.tilemapLayer.gidMap[tile.index];

      const image = scene.add.image(
        tile.pixelX,
        tile.pixelY,
        `${tileset.name}_sprite`,
        tile.index - tileset.firstgid
      );

      image.setOrigin(0, 0);

      image.setDepth(getTileDynamicDepth(tile));
    }
  });
}
