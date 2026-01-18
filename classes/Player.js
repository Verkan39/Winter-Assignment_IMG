const X_VELOCITY = 200
const JUMP_POWER = 250
const GRAVITY = 580

class Player {
  constructor({ x, y, size, velocity = { x: 0, y: 0 } }) {
    this.x = x
    this.y = y
    this.width = size
    this.height = size
    this.maxJumps=3;
    this.jumpCount=0;
    this.velocity = velocity
    this.isOnGround = false
    this.isImageloaded=false
    this.image=new Image()
    this.image.onload=()=>{
      this.isImageloaded=true
    }
    this.image.src='./images/player.png'
    this.elapsedTime=0
    this.currentFrame=0
    this.sprites={
      idle:{
        x:0,
        y:0,
        width:32,
        height:32,
        frames:4,
      },
      run:{
        x:0,
        y:32,
        width:32,
        height:32,
        frames:6,
      },
      jump:{
        x:0,
        y:32*5,
        width:32,
        height:32,
        frames:1,
      },
      fall:{
        x:32,
        y:32*5,
        width:32,
        height:32,
        frames:1,
      },
    }
    this.currentSprite=this.sprites.run
    this.facing = 'right'
    this.hitBox={
      x:0,
      y:0,
      width:20,
      height:20,
    }
  }

  draw(c) {
    // Red square debug code
    // initial hitbox
    // c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    // c.fillRect(this.x, this.y, this.width, this.height)

    // //new hitbox
    // c.fillStyle='rgba(0,0,225,0.5)'
    // c.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height)

    if(this.isImageloaded===true){
      let ScaleX=1
      let x=this.x

      if(this.facing==='left'){
        ScaleX=-1
        x=-this.x - this.width
      }
      c.save()
      c.scale(ScaleX,1)
      c.drawImage(
        this.image,
        this.currentSprite.x + this.currentFrame * this.currentSprite.width,
        this.currentSprite.y,
        this.currentSprite.width,
        this.currentSprite.height,
        x,
        this.y,
        this.width,
        this.height)
        c.restore()
      }
  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    //updating animation frames
    this.elapsedTime+=deltaTime
    const secondsInterval=0.1
    if(this.elapsedTime>secondsInterval){
      this.currentFrame=(this.currentFrame+1)% this.currentSprite.frames
      this.elapsedTime-=secondsInterval
    }

    //updating hitbox position
    this.hitBox.x=this.x+6
    this.hitBox.y=this.y+12

    this.applyGravity(deltaTime)

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime)
    this.checkForHorizontalCollisions(collisionBlocks)

    // Check for any platform collisions
    this.checkPlatformCollisions(platforms, deltaTime)

    // Update vertical position and check collisions
    this.updateVerticalPosition(deltaTime)
    this.checkForVerticalCollisions(collisionBlocks)

    this.determineFacingDirection()
    this.switchSprites()
  }

  determineFacingDirection(){
    if(this.velocity.x>0){
      this.facing='right'
    }
    else if(this.velocity.x<0){
      this.facing='left'
    }
  }
  switchSprites(){
    if(this.isOnGround && this.velocity.x===0 && this.currentSprite!==this.sprites.idle){
      this.currentFrame=0
      this.currentSprite=this.sprites.idle
    }
    else if(this.isOnGround && this.velocity.x!==0 && this.currentSprite!==this.sprites.run){
      this.currentFrame=0
      this.currentSprite=this.sprites.run
    }
    else if(!this.isOnGround && this.velocity.y<0 && this.currentSprite!==this.sprites.jump){
      this.currentFrame=0
      this.currentSprite=this.sprites.jump
    }
    else if(!this.isOnGround && this.velocity.y>0 && this.currentSprite!==this.sprites.fall){
      this.currentFrame=0
      this.currentSprite=this.sprites.fall
    }
  }

  jump() {
    if(this.jumpCount<this.maxJumps){
      if(this.jumpCount==1) this.velocity.y=-JUMP_POWER*0.9
      else if(this.jumpCount==2) this.velocity.y=-JUMP_POWER*0.7
      else this.velocity.y = -JUMP_POWER  
      this.jumpCount++
      this.isOnGround=false
    }
  }
  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime
    this.hitBox.x+= this.velocity.x * deltaTime
  }

  updateVerticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime
    this.hitBox.y+= this.velocity.y * deltaTime
  }

  applyGravity(deltaTime) {
    this.velocity.y += GRAVITY * deltaTime
  }

  handleInput(keys) {
    this.velocity.x = 0

    if (keys.d.pressed) {
      this.velocity.x = X_VELOCITY
    } else if (keys.a.pressed) {
      this.velocity.x = -X_VELOCITY
    }
  }

  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // Check if a collision exists on all axes
      if (
        this.hitBox.x <= collisionBlock.x + collisionBlock.width &&
        this.hitBox.x + this.hitBox.width >= collisionBlock.x &&
        this.hitBox.y + this.hitBox.height >= collisionBlock.y &&
        this.hitBox.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going left
        if (this.velocity.x < -0) {
          this.hitBox.x = collisionBlock.x + collisionBlock.width + buffer
          this.x=this.hitBox.x -6
          break
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.hitBox.x = collisionBlock.x - this.hitBox.width - buffer
          this.x=this.hitBox.x -6
          break
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // If a collision exists
      if (
        this.hitBox.x <= collisionBlock.x + collisionBlock.width &&
        this.hitBox.x + this.hitBox.width >= collisionBlock.x &&
        this.hitBox.y + this.hitBox.height >= collisionBlock.y &&
        this.hitBox.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going up
        if (this.velocity.y < 0) {
          this.velocity.y = 0
          this.hitBox.y = collisionBlock.y + collisionBlock.height + buffer
          this.y=this.hitBox.y -12
          break
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y - this.height - buffer
          this.hitBox.y=collisionBlock.y - this.hitBox.height - buffer
          this.isOnGround = true
          this.jumpCount=0;
          break
        }
      }
    }
  }

  checkPlatformCollisions(platforms, deltaTime) {
    const buffer = 0.0001
    for (let platform of platforms) {
      if (platform.checkCollision(this, deltaTime)) {
        this.velocity.y = 0
        this.y = platform.y - this.height - buffer
        this.isOnGround = true
        this.jumpCount=0;
        return
      }
    }
    this.isOnGround = false
  }
}