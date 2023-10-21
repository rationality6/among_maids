export default (anims) => {
  anims.create({
    key: "catLaying",
    frames: anims.generateFrameNumbers("catLaying", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
};
