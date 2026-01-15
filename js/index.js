const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

canvas.width = 1024 * dpr
canvas.height = 576 * dpr

console.log(canvas.width);

const layersData = {
   l_New_Layer_1: l_New_Layer_1,
   l_New_Layer_2: l_New_Layer_2,
   l_New_Layer_4: l_New_Layer_4,
   l_New_Layer_5: l_New_Layer_5,
   l_New_Layer_3: l_New_Layer_3,
};

const tilesets = {
  l_New_Layer_1: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_New_Layer_2: { imageUrl: './images/tileset.png', tileSize: 16 },
  l_New_Layer_4: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_New_Layer_5: { imageUrl: './images/tileset.png', tileSize: 16 },
  l_New_Layer_3: { imageUrl: './images/decorations.png', tileSize: 16 },
};


// Tile setup
const collisionBlocks = []
const platforms = []
const blockSize = 16 // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        }),
      )
    } else if (symbol === 2) {
      platforms.push(
        new Platform({
          x: x * blockSize,
          y: y * blockSize + blockSize,
          width: 16,
          height: 4,
        }),
      )
    }
  })
})

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  // Calculate the number of tiles per row in the tileset
  // We use Math.ceil to ensure we get a whole number of tiles
  const tilesPerRow = Math.ceil(tilesetImage.width / tileSize)

  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        // Adjust index to be 0-based for calculations
        const tileIndex = symbol - 1

        // Calculate source coordinates
        const srcX = (tileIndex % tilesPerRow) * tileSize
        const srcY = Math.floor(tileIndex / tilesPerRow) * tileSize

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16, // destination width, height
        )
      }
    })
  })
}
const renderStaticLayers = async () => {
  const offscreenCanvas = document.createElement('canvas')
  const MAP_WIDTH = layersData.l_New_Layer_1[0].length * 16
const MAP_HEIGHT = layersData.l_New_Layer_1.length * 16

offscreenCanvas.width = MAP_WIDTH
offscreenCanvas.height = MAP_HEIGHT

  const offscreenContext = offscreenCanvas.getContext('2d')

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName]
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl)
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext,
        )
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error)
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
  // collisionBlocks.forEach(block => block.draw(offscreenContext));
  // platforms.forEach((platform) => platform.draw(offscreenContext))

  return offscreenCanvas
}
// END - Tile setup

// Change xy coordinates to move player's default position
const player = new Player({
  x: 100,
  y: 100,
  size: 32,
  velocity: { x: 0, y: 0 },
})

const hearts=[
  new Heart({
    x:10,
    y:10,
    width:21,
    height:18,
    imageSrc:'./images/hearts.png',
    spriteCropbox :{
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
  new Heart({
    x:34,
    y:10,
    width:21,
    height:18,
    imageSrc:'./images/hearts.png',
    spriteCropbox :{
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
  new Heart({
    x:56,
    y:10,
    width:21,
    height:18,
    imageSrc:'./images/hearts.png',
    spriteCropbox :{
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  })
]
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

let lastTime = performance.now()
const camera={
  x:0,
  y:0,
}
const SCROLL_POST_X=500
const SCROLL_POST_Y=100
const SCROLL_POST_B=200

const SCROLL_POST_End=2760

const new_Scroll_post_x=2320
function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  // Update player position
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  //Track Scroll post distance
  if(player.x > SCROLL_POST_X && player.x< new_Scroll_post_x){
  const scrollPostDistance=player.x - SCROLL_POST_X
  camera.x=scrollPostDistance
  }
  // if(player.y < SCROLL_POST_Y && camera.y >0){
  // const scrollPostDistance=SCROLL_POST_Y - player.y
  // camera.y=scrollPostDistance
  // }
  // if(player.y> SCROLL_POST_B){
  // const scrollPostDistance=player.y - SCROLL_POST_B
  // camera.y=-scrollPostDistance
  // }

  console.log(player.x, player.y);

  if(player.x>=SCROLL_POST_End){
    const game_ended_modal=document.getElementById('game_completed')
    game_ended_modal.classList.add('active')
  }
  // Render scene
  c.save()
  // c.scale(dpr+1, dpr+1)

  c.setTransform(dpr, 0, 0, dpr, -camera.x * dpr, camera.y * dpr)
  c.clearRect(camera.x,-camera.y,canvas.width / dpr,canvas.height / dpr)

  c.drawImage(backgroundCanvas, 0, 0)
  player.draw(c)

  // for(let i=hearts.length-1;i>=0;i--){
  //   const heart = hearts[i]
  //   heart.draw(c)
  // }
  // c.fillRect(new_Scroll_post_x,150,10,200)
  // c.fillRect(300,SCROLL_POST_Y,100,10)
  // c.fillRect(300,SCROLL_POST_B,100,10)
  c.restore()

  requestAnimationFrame(() => animate(backgroundCanvas))
}

const startRendering = async () => {
  try {
    const backgroundCanvas = await renderStaticLayers()
    if (!backgroundCanvas) {
      console.error('Failed to create the background canvas')
      return
    }

    animate(backgroundCanvas)
  } catch (error) {
    console.error('Error during rendering:', error)
  }
}

startRendering()

