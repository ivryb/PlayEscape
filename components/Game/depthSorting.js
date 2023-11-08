export const getMatterBodyDepth = (matterTileBody) => {
  const { min, max } = matterTileBody.body.bounds;

  return (min.y + max.y) / 2;
};

export const getTileDefaultDynamicDepth = (tile) => {
  return tile.pixelY + tile.height - tile.baseHeight / 2;
};

export const getTileDynamicDepth = (tile) => {
  return tile.physics.matterBody
    ? getMatterBodyDepth(tile.physics.matterBody)
    : getTileDefaultDynamicDepth(tile);
};

export const getPlayerDynamicDepth = (player) => {
  return player.y + 15;
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

// Previous experiments

// export const getMatterBodyDepth = (matterTileBody) => {
// return Math.sqrt(min.x ** 2 + min.y ** 2);
// const avgX = (min.x + max.x) / 2;
// return max.y;
// const avgY = (min.y + max.y) / 2;
// return Math.sqrt(max.x ** 2 + max.y ** 2);
// };

// export const getTileDefaultDynamicDepth = (tile) => {
// const avgY = tile.pixelY + tile.height - tile.baseHeight / 2;
// const avgX = tile.pixelX + tile.width / 2;

// return Math.sqrt(avgX ** 2 + avgY ** 2);
// return Math.sqrt(
// (tile.pixelY + tile.height - tile.baseHeight / 2) ** 2 +
// (tile.pixelX + tile.width / 2) ** 2
// };

// export const getTileDynamicDepth = (tile) => {
// if (tile.physics.matterBody) {
//   return tile.physics.matterBody.body.bounds.max.y;
// }

// return tile.pixelY + tile.height - tile.baseHeight / 2;
// };

// export const getPlayerDynamicDepth = (player) => {
// return Math.sqrt((player.x + 15) ** 2 + (player.y + 15) ** 2);
// return Math.sqrt(this.player.y ** 2 + this.player.x ** 2)
// };
