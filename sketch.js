// Pause System
let paused = false;
let pauseButton = {
  x: 0,
  y: 15,
  w: 60,
  h: 45,
};
// ================= SHOP =================
let shopOpen = false;

let shopButton = {
  x: 20,
  y: 0,
  w: 180,
  h: 50,
};

// Inventory
let inventory = {
  hiveUpgrade: 0,
  beeStorm: 0,
  healthPotion: 0,
  turret: false,
};

// Costs
let hiveUpgradeCost = 5000;
let beeStormCost = 8000;
let healthPotionCost = 6000;
let turretCost = 18000;
let honeyMultiplierCost = 12000;

// Hive upgrades
let hiveLevel = 1;
let honeyMultiplier = 1;
let honeyMultiplierLevel = 0;
let maxHoneyMultiplierLevel = 4;

// Turret
let turretCooldown = 1500;
let lastTurretShot = 0;
let healthPotionCount = 0;
let lastPotionUse = 0;
let potionCooldown = 10000;

let beehive;
let beeImage;
let round = 1;
let speedLevel = 0;
let clouds = [];
let grassBlades = [];
let bees = [];

let roundComplete = false;
let roundTarget = 15000;

let bearImage;
let birdImage;
let birds = [];

let nextBirdSpawn;
let birdWalkSpeed = 4;

let gameStarted = false;
let gameOver = false;
let introTimer = 420; // 5 seconds
let fasterTimer = 0;
let previousLevel = 0;
let scoreLevel = 0;

let bearSpawnDelay = 2500;
let birdSpawnDelay = 3500;

const BIRD_COLS = 8;
const BIRD_ROWS = 3;

const BIRD_FRAME_WIDTH = 1602.666777 / 8;
const BIRD_FRAME_HEIGHT = 616 / 3; // 197.33
let bearX;
let bearY;
// Score
let score = 0;
let highScore = 0;
let honey = 0;
let lastScoreTime = 0;

let bearFrame = 0;
let frameTimer = 0;
let bearLeaving = false;
let bearGone = false;
let nextBearSpawn;
let bearActive = false;
let bearDirection = 1;
let bearFacing = 1;
// Hive health
let hiveHealth = 100;
let bearAttacking = false;
let MAX_HIVE_HEALTH = 100;

let bears = [];

const FRAME_WIDTH = 80; // 320 / 4
const FRAME_HEIGHT = 48;

function preload() {
  birdImage = loadImage("assets/images/bird.png");
  beehive = loadImage("assets/images/beehive.png");
  beeImage = loadImage("assets/images/happy_bee.png");
  bearImage = loadImage("assets/images/bear.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textFont("Trebuchet MS");
  pauseButton.x = width - pauseButton.w - 20;
  pauseButton.y = 15;
  bearX = -100; // Start off-screen
  bearY = height * 0.75 - 20;
  nextBearSpawn = millis() + random(10000, 20000);
  nextBirdSpawn = millis() + 30000; // first bird after 30 sec
  shopButton.y = height - 70;

  // Create grass blades
  for (let x = 0; x < width; x += 5) {
    grassBlades.push({
      x: x,
      offsetX: random(-4, 4),
      height: random(8, 20),
    });
  }

  // Create clouds
  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: random(width),
      y: random(50, 200),
      size: random(60, 120),
      speed: random(0.5, 1.5),
    });
  }

  // Create bees around the hive
  for (let i = 0; i < 15; i++) {
    bees.push({
      x: width / 2 + random(-100, 100),
      y: height * 0.68 + random(-100, 100),

      targetX: width / 2 + random(-150, 150),
      targetY: height * 0.68 + random(-150, 150),

      speed: random(0.5, 2),
      size: random(25, 40),
    });
  }
}

function updateDifficulty() {
  round = floor(roundTarget / 15000);

  let roundScore = score % 15000;
  let progress = constrain(roundScore / 15000, 0, 1);

  speedLevel = floor(roundScore / 2500);

  if (speedLevel > previousLevel) {
    fasterTimer = 120;
    previousLevel = speedLevel;
  }

  // ---------- ROUND 1 ----------
  if (round == 1) {
    bearSpawnDelay = lerp(3000, 650, progress);
    birdSpawnDelay = lerp(4000, 900, progress);
  }

  // ---------- ROUND 2 ----------
  else if (round == 2) {
    bearSpawnDelay = lerp(1200, 450, progress);
    birdSpawnDelay = lerp(1700, 700, progress);
  }

  // ---------- ROUND 3 ----------
  else {
    bearSpawnDelay = lerp(800, 250, progress);
    birdSpawnDelay = lerp(1200, 450, progress);
  }

  bearWalkSpeed = 1.5 + (round - 1) * 0.35 + progress * 1.2;
  birdWalkSpeed = 4 + (round - 1) * 0.35 + progress * 1.2;
}

function draw() {
  if (!gameStarted) {
    background(125, 205, 255);

    // Sun
    noStroke();
    fill(255, 220, 80);
    circle(width - 140, 120, 110);

    // Clouds
    drawClouds();

    // Ground
    fill(60, 180, 75);
    rect(0, height * 0.75, width, height * 0.25);

    // Draw two bees
    drawStartBees();

    // Main title
    textAlign(CENTER, CENTER);

    stroke(0);
    strokeWeight(6);
    fill(255);

    textSize(62);
    text("DEFEND THE HIVE", width / 2, 120);

    // Subtitle
    noStroke();
    fill(255);

    textSize(24);
    text("Protect your hive from hungry invaders.", width / 2, 175);

    // Start panel
    fill(255, 245);
    stroke(0);
    strokeWeight(3);

    rect(width / 2 - 260, 230, 520, 170, 20);

    noStroke();
    fill(40);

    textSize(26);
    text("Press SPACE to begin your adventure!", width / 2, 275);

    textSize(20);

    text(
      "Click bears and birds to scare\n" +
        "them away before they damage\n" +
        "your beehive.",
      width / 2,
      340,
    );

    return;
  }

  if (gameOver) {
    background(25);

    fill(255, 70, 70);
    textAlign(CENTER, CENTER);

    textSize(72);
    text("GAME OVER", width / 2, height / 2 - 120);

    fill(255);

    textSize(34);
    text("Final Score: " + score, width / 2, height / 2 - 30);

    textSize(30);
    text("High Score: " + highScore, width / 2, height / 2 + 20);

    let bx = width / 2 - 170;
    let by = height / 2 + 80;
    let bw = 340;
    let bh = 65;

    let hovering =
      mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh;

    if (hovering) {
      fill(255, 220, 70);
      stroke(255);
      strokeWeight(4);
    } else {
      fill(255, 190, 40);
      noStroke();
    }

    rect(bx, by, bw, bh, 16);

    fill(40);

    textSize(26);

    text("Press SPACE to Play Again", width / 2, by + bh / 2);

    return;
  }

  if (roundComplete) {
    background(25, 35, 60);

    // Dark overlay
    fill(0, 170);
    rect(0, 0, width, height);
    let panelWidth = width * 0.42;
    let panelX = width - panelWidth;

    textAlign(CENTER, CENTER);

    fill(255, 210, 0);
    textSize(70);
    text("ROUND COMPLETE!", width / 2, height / 2 - 140);

    fill(255);
    textSize(30);

    text("Fantastic work defending your hive!", width / 2, height / 2 - 60);

    fill(220);

    textSize(22);

    text(
      "Take a breath.\nSpend your Honey on upgrades\nbefore the next round.",
      width / 2,
      height / 2 + 20,
    );

    fill(255, 190, 40);

    let hovering =
      mouseX > width / 2 - 170 &&
      mouseX < width / 2 + 170 &&
      mouseY > height / 2 + 110 &&
      mouseY < height / 2 + 175;

    if (hovering) {
      fill(255, 220, 70);
      stroke(255);
      strokeWeight(4);
    } else {
      fill(255, 190, 40);
      noStroke();
    }

    rect(width / 2 - 170, height / 2 + 110, 340, 65, 16);

    fill(40);

    textSize(28);

    text("Press ENTER for Round " + round, width / 2, height / 2 + 142);

    return;
  }

  updateDifficulty();
  if (introTimer <= 0 && millis() > nextBearSpawn) {
    let direction = random() < 0.5 ? 1 : -1;

    bears.push({
      x: direction === 1 ? -100 : width + 100,
      y: height * 0.79 - FRAME_HEIGHT,

      direction: direction,
      facing: direction,

      leaving: false,

      frame: 0,
      frameTimer: 0,

      lastAttack: 0,
    });

    nextBearSpawn = millis() + random(bearSpawnDelay * 1, bearSpawnDelay);
  }

  if (score >= roundTarget) {
    roundComplete = true;
    return;
  }

  if (introTimer <= 0 && millis() > nextBirdSpawn) {
    birds.push({
      x: random(0, width),
      y: -100,

      targetX: width / 2 + random(-120, 120),
      targetY: height * 0.73,

      direction: 1,
      facing: random(0, width) < width / 2 ? 1 : -1,

      leaving: false,

      frame: 0,
      frameTimer: 0,

      lastAttack: 0,
    });

    let level = floor((millis() - 30000) / 30000);

    nextBirdSpawn = millis() + random(birdSpawnDelay * 1, birdSpawnDelay);
  }

  // Sky
  background(135, 206, 235);

  updateScore();
  drawHiveHealthBar();
  drawHoneyUI();
  drawShopButton();
  drawRoundProgressBar();

  // Clouds
  drawClouds();

  // Grass
  fill(34, 139, 34);
  noStroke();
  rect(0, height * 0.75, width, height * 0.25);

  // Grass texture
  drawGrassTexture();

  // Bear
  drawBears();

  drawBirds();

  // Beehive
  image(beehive, width / 2, height * 0.71, 150, 150);
  drawTurret();
  drawMiniHiveHealthBar();

  // Bees
  drawBees();

  // Intro message
  if (introTimer > 0) {
    fill(0, 170);
    noStroke();

    rect(width / 2 - 340, height / 2 - 255, 680, 390, 20);

    fill(255);

    textAlign(CENTER, CENTER);

    textSize(34);

    text("HOW TO PLAY", width / 2, height / 2 - 205);

    textSize(22);

    text(
      "Protect your hive from bears and birds.\n" +
        "Click enemies to scare them away.\n" +
        "Click enemies to earn points.\n" +
        "Each round makes enemies faster.",
      width / 2,
      height / 2 - 70,
    );

    fill(255, 210, 0);

    textSize(24);

    text("CLICK ENEMIES TO SEND THEM AWAY!", width / 2, height / 2 + 35);

    introTimer--;
  }

  if (fasterTimer > 0) {
    textAlign(CENTER, CENTER);

    fill(255, 0, 0);
    stroke(0);
    strokeWeight(4);

    textSize(90);
    fill(255, 0, 0);

    text("FASTER!", width / 2, height / 2);
    textSize(40);
    text("Enemies are speeding up", width / 2, height / 2 + 80);

    fasterTimer--;
  }
  if (hiveHealth <= 0) {
    if (score > highScore) {
      highScore = score;
    }

    gameOver = true;
  }
  drawTopUI();
  drawPauseButton();

  if (shopOpen) {
    drawShop();
  }

  if (paused && !shopOpen) {
    fill(80, 80, 80, 170);
    noStroke();
    rect(0, 0, width, height);

    drawTopUI();
    drawPauseButton();

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(80);
    text("PAUSED", width / 2, height / 2);
  }
}

function drawClouds() {
  fill(255);
  noStroke();

  for (let cloud of clouds) {
    // Move left
    cloud.x -= cloud.speed;

    // Wrap around screen
    if (cloud.x < -cloud.size * 2) {
      cloud.x = width + cloud.size;
      cloud.y = random(50, 200);
    }

    // Soft round cloud
    ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
    ellipse(
      cloud.x - cloud.size * 0.3,
      cloud.y,
      cloud.size * 0.7,
      cloud.size * 0.5,
    );
    ellipse(
      cloud.x + cloud.size * 0.3,
      cloud.y,
      cloud.size * 0.7,
      cloud.size * 0.5,
    );
    ellipse(
      cloud.x,
      cloud.y - cloud.size * 0.15,
      cloud.size * 0.8,
      cloud.size * 0.5,
    );
  }
}

function drawStartBees() {
  drawBee(170, 140, 1);
  drawBee(width - 250, 220, 0.8);
}

function drawBee(x, y, s) {
  push();

  translate(x, y);

  scale(s);

  stroke(0);
  strokeWeight(2);

  // wings
  fill(230);

  ellipse(-10, -12, 18, 28);
  ellipse(10, -12, 18, 28);

  // body
  fill(255, 210, 0);

  ellipse(0, 0, 38, 26);

  strokeWeight(3);

  line(-8, -12, -8, 12);
  line(0, -13, 0, 13);
  line(8, -12, 8, 12);

  // head
  fill(0);

  circle(-20, 0, 12);

  // eye
  fill(255);

  circle(-22, -2, 3);

  pop();
}

function drawShop() {
  let panelWidth = width * 0.42;
  let panelX = width - panelWidth;

  fill(0, 170);
  rect(0, 0, width, height);

  fill(92, 62, 28);
  noStroke();
  rect(panelX, 0, panelWidth, height);

  stroke(70, 45, 20);
  strokeWeight(2);

  for (let y = 0; y < height; y += 55) {
    line(panelX, y, panelX + panelWidth, y);
  }

  noStroke();

  fill(255);

  textAlign(CENTER);

  textSize(36);

  text("HIVE SHOP", panelX + width / 4, 60);

  textSize(18);

  text("Spend Honey to defend your hive.", panelX + width / 4, 95);
  fill(255, 210, 0);
  textSize(24);
  textAlign(CENTER);
  text("Honey: 🍯 " + floor(honey), panelX + width / 4, 125);

  drawUpgradeCard(
    panelX + 35,
    170,
    "Hive Upgrade",
    "Increase max health by 20 (Max 200).",
    hiveUpgradeCost,
  );

  drawUpgradeCard(
    panelX + 35,
    300,
    "Bee Storm",
    "Store one Bee Storm for later use.",
    beeStormCost,
  );

  drawUpgradeCard(
    panelX + 35,
    430,
    "Health Potion",
    "Store one full heal.",
    healthPotionCost,
  );

  drawUpgradeCard(
    panelX + 35,
    560,
    "Turret",
    "Automatically shoots enemies.",
    turretCost,
  );

  drawUpgradeCard(
    panelX + 35,
    690,
    "Honey Multiplier",
    "Increase honey earned by 25%.",
    honeyMultiplierCost,
  );

  let closeHover =
    mouseX > panelX + panelWidth - 65 &&
    mouseX < panelX + panelWidth - 20 &&
    mouseY > 20 &&
    mouseY < 65;

  if (closeHover) {
    fill(220, 80, 80);
    stroke(255);
    strokeWeight(3);
  } else {
    fill(165, 55, 55);
    noStroke();
  }
  noStroke();

  rect(panelX + panelWidth - 65, 20, 45, 45, 10);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);

  text("X", panelX + panelWidth - 42, 42);
}

function drawUpgradeCard(x, y, title, desc, cost) {
  let canBuy = honey >= cost;
  let hovering =
    mouseX > x && mouseX < x + 360 && mouseY > y && mouseY < y + 100;

  if (canBuy) {
    if (hovering) {
      fill(255, 240, 170);
    } else {
      fill(232, 213, 171);
    }
  } else {
    fill(120);
  }

  stroke(95, 70, 35);
  strokeWeight(3);

  let grow = hovering && canBuy ? 6 : 0;
  if (hovering && canBuy) {
    stroke(255, 220, 0);
    strokeWeight(5);
  }
  rect(x - grow / 2, y - grow / 2, 360 + grow, 100 + grow, 15);

  noStroke();

  fill(30);

  textAlign(LEFT);

  textSize(22);

  text(title, x + 20, y + 28);

  textSize(15);

  text(desc, x + 20, y + 55);

  textSize(18);

  text("Cost: " + cost + " Honey", x + 20, y + 82);
}

function drawGrassTexture() {
  let groundY = height * 0.75;

  stroke(30, 120, 30);
  strokeWeight(2);

  for (let blade of grassBlades) {
    let sway = sin(frameCount * 0.05 + blade.x * 0.08) * 5;

    line(
      blade.x,
      groundY,
      blade.x + blade.offsetX + sway,
      groundY - blade.height,
    );
  }
}

function drawBees() {
  let hiveX = width / 2;
  let hiveY = height * 0.71;

  for (let bee of bees) {
    // Move toward target
    let dx = bee.targetX - bee.x;
    let dy = bee.targetY - bee.y;

    let distance = dist(bee.x, bee.y, bee.targetX, bee.targetY);

    if (distance > 1) {
      bee.x += (dx / distance) * bee.speed;
      bee.y += (dy / distance) * bee.speed;
    }
    // Add buzzing jitter
    bee.x += random(-0.5, 0.5);
    bee.y += random(-0.5, 0.5);

    // Pick a new random target near hive
    if (distance < 15) {
      bee.targetX = hiveX + random(-150, 150);
      bee.targetY = hiveY + random(-150, 150);
    }

    image(beeImage, bee.x, bee.y, bee.size, bee.size);
  }
}

function drawRoundProgressBar() {
  let progress = (score % 15000) / 15000;

  let w = 430;
  let h = 18;

  let x = width / 2 - w / 2;

  // moved lower
  let y = 115;

  // Label
  textAlign(CENTER, CENTER);
  textSize(17);
  noStroke();
  fill(255);

  text(
    "Round " + round + "   " + floor(progress * 100) + "%",
    width / 2,
    y - 18,
  );

  // Background
  fill(40, 40, 40, 220);
  rect(x, y, w, h, 12);

  // Progress
  fill(255, 195, 40);
  rect(x, y, w * progress, h, 12);

  // Border
  noFill();
  stroke(255);
  strokeWeight(2);
  rect(x, y, w, h, 12);
}

function drawBears() {
  for (let i = bears.length - 1; i >= 0; i--) {
    let bear = bears[i];
    let hiveX = width / 2;

    // Animation
    bear.frameTimer++;

    if (bear.frameTimer > 10) {
      bear.frame = (bear.frame + 1) % 4;
      bear.frameTimer = 0;
    }

    // Walking
    if (!bear.leaving) {
      if (bear.direction === 1) {
        if (bear.x < hiveX - 120) bear.x += bearWalkSpeed;
      } else {
        if (bear.x > hiveX + 120) bear.x -= bearWalkSpeed;
      }
    }

    // Leaving
    else {
      if (bear.direction === 1) bear.x -= bearWalkSpeed * 1.5;
      else bear.x += bearWalkSpeed * 1.5;
    }

    // Attack hive
    let distanceToHive = abs(bear.x - hiveX);

    if (!bear.leaving && distanceToHive <= 120) {
      if (millis() - bear.lastAttack > 1500) {
        hiveHealth -= 5;
        hiveHealth = max(0, hiveHealth);

        bear.lastAttack = millis();
      }
    }

    // Draw sprite
    push();

    translate(bear.x, bear.y);

    if (bear.facing === -1) scale(-1, 1);

    image(
      bearImage,
      0,
      0,
      140,
      90,
      bear.frame * FRAME_WIDTH,
      0,
      FRAME_WIDTH,
      FRAME_HEIGHT,
    );

    pop();

    // Remove offscreen
    if (bear.x < -200 || bear.x > width + 200) {
      bears.splice(i, 1);
    }
  }
}

function drawBirds() {
  let hiveX = width / 2;

  for (let i = birds.length - 1; i >= 0; i--) {
    let bird = birds[i];

    // Animate sprite
    bird.frameTimer++;

    if (bird.frameTimer > 6) {
      bird.frame = (bird.frame + 1) % 24;
      bird.frameTimer = 0;
    }

    // Move toward hive
    if (!bird.leaving) {
      let dx = bird.targetX - bird.x;
      let dy = bird.targetY - bird.y;

      let distance = dist(bird.x, bird.y, bird.targetX, bird.targetY);

      if (distance > 5) {
        bird.x += (dx / distance) * birdWalkSpeed;
        bird.y += (dy / distance) * birdWalkSpeed;
      }
    }

    // Leaving
    else {
      bird.y -= birdWalkSpeed * 1.5;

      if (bird.facing === 1) bird.x += birdWalkSpeed;
      else bird.x -= birdWalkSpeed;
    }

    // Damage hive
    let hiveY = height * 0.73;

    let distanceToHive = dist(bird.x, bird.y, hiveX, hiveY);

    if (!bird.leaving && distanceToHive < 100) {
      if (millis() - bird.lastAttack > 2000) {
        hiveHealth -= 5;
        hiveHealth = max(0, hiveHealth);

        bird.lastAttack = millis();
      }
    }
    // Always face hive while attacking
    if (!bird.leaving) {
      // Face toward hive
      if (bird.targetX > bird.x) bird.facing = 1;
      else bird.facing = -1;
    } else {
      // Face away from hive
      if (bird.targetX > bird.x) bird.facing = -1;
      else bird.facing = 1;
    }
    // Draw bird
    push();

    translate(bird.x, bird.y);

    if (bird.facing === -1) scale(-1, 1);

    let row = floor(bird.frame / 8);
    let col = bird.frame % 8;

    image(
      birdImage,

      0,
      0,
      120,
      120,

      col * BIRD_FRAME_WIDTH,
      row * BIRD_FRAME_HEIGHT,

      BIRD_FRAME_WIDTH,
      BIRD_FRAME_HEIGHT,
    );

    pop();

    // Remove offscreen
    if (bird.x < -200 || bird.x > width + 200) birds.splice(i, 1);
  }
}

function drawHoneyUI() {
  let w = 180;
  let h = 46;

  let x = 320;
  let y = 15;

  // Honey coloured box
  fill(245, 190, 35);
  stroke(160, 110, 20);
  strokeWeight(3);
  rect(x, y, w, h, 12);

  // Text
  fill(80, 50, 0);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("🍯 " + honey, x + w / 2, y + h / 2);
}

function drawShopButton() {
  let w = 160;
  let h = 48;

  shopButton.x = width - w - 100; // leaves room for pause button
  shopButton.y = 18;
  shopButton.w = w;
  shopButton.h = h;

  let hovering =
    mouseX > shopButton.x &&
    mouseX < shopButton.x + w &&
    mouseY > shopButton.y &&
    mouseY < shopButton.y + h;

  if (hovering) {
    stroke(255);
    strokeWeight(4);
    fill(230, 170, 60);
  } else {
    stroke(255);
    strokeWeight(2);
    fill(191, 130, 40);
  }

  rect(shopButton.x, shopButton.y, w, h, 12);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);

  text("SHOP", shopButton.x + w / 2, shopButton.y + h / 2);
}

function mousePressed() {
  if (shopOpen) {
    let panelWidth = width * 0.42;
    let panelX = width - panelWidth;

    if (
      mouseX > panelX + panelWidth - 65 &&
      mouseX < panelX + panelWidth - 20 &&
      mouseY > 20 &&
      mouseY < 65
    ) {
      shopOpen = false;
      paused = false;
      loop();
      return;
    }
  }

  if (
    mouseX > pauseButton.x &&
    mouseX < pauseButton.x + pauseButton.w &&
    mouseY > pauseButton.y &&
    mouseY < pauseButton.y + pauseButton.h
  ) {
    paused = !paused;

    if (paused) {
      redraw();
      noLoop();
    } else {
      loop();
    }

    return;
  }

  if (
    mouseX > shopButton.x &&
    mouseX < shopButton.x + shopButton.w &&
    mouseY > shopButton.y &&
    mouseY < shopButton.y + shopButton.h
  ) {
    shopOpen = !shopOpen;

    if (shopOpen) {
      paused = true;
      noLoop();
      redraw();
    } else {
      paused = false;
      loop();
    }

    return;
  }

  // ---------- SHOP PURCHASES ----------

  let panelWidth = width * 0.42;
  let panelX = width - panelWidth;

  // Hive Upgrade
  if (
    shopOpen &&
    mouseX > panelX + 35 &&
    mouseX < panelX + 395 &&
    mouseY > 140 &&
    mouseY < 240
  ) {
    if (honey >= hiveUpgradeCost && MAX_HIVE_HEALTH < 200) {
      honey -= hiveUpgradeCost;

      MAX_HIVE_HEALTH += 20;

      hiveHealth += 20;
      redraw();

      if (hiveHealth > MAX_HIVE_HEALTH) {
        hiveHealth = MAX_HIVE_HEALTH;
      }

      hiveUpgradeCost += 5000;
    }

    return;
  }

  // Turret
  if (
    shopOpen &&
    mouseX > panelX + 35 &&
    mouseX < panelX + 395 &&
    mouseY > 530 &&
    mouseY < 630
  ) {
    if (!inventory.turret && honey >= turretCost) {
      honey -= turretCost;

      inventory.turret = true;
    }

    return;
  }

  // Honey Multiplier
  if (
    shopOpen &&
    mouseX > panelX + 35 &&
    mouseX < panelX + 395 &&
    mouseY > 660 &&
    mouseY < 760
  ) {
    if (
      honey >= honeyMultiplierCost &&
      honeyMultiplierLevel < maxHoneyMultiplierLevel
    ) {
      honey -= honeyMultiplierCost;

      honeyMultiplierLevel++;

      honeyMultiplier += 0.25;

      honeyMultiplierCost += 8000;
    }

    return;
  }

  // Bears
  for (let bear of bears) {
    if (
      mouseX > bear.x - FRAME_WIDTH / 2 &&
      mouseX < bear.x + FRAME_WIDTH / 2 &&
      mouseY > bear.y - FRAME_HEIGHT / 2 &&
      mouseY < bear.y + FRAME_HEIGHT / 2
    ) {
      if (!bear.leaving) {
        bear.leaving = true;
        bear.facing *= -1;
        score += 100;
        honey += 100 * honeyMultiplier;
      }
    }
  }

  // Birds
  for (let bird of birds) {
    if (
      mouseX > bird.x - 60 &&
      mouseX < bird.x + 60 &&
      mouseY > bird.y - 60 &&
      mouseY < bird.y + 60
    ) {
      if (!bird.leaving) {
        bird.leaving = true;
        score += 150;
        honey += 150 * honeyMultiplier;

        if (bird.x < width / 2) bird.facing = -1;
        else bird.facing = 1;
      }
    }
  }
}

function drawHiveHealthBar() {
  let barWidth = 260;
  let barHeight = 28;

  let x = width / 2 - barWidth / 2;
  let y = 20;

  // Background
  fill(40, 40, 40, 180);
  noStroke();
  rect(x, y, barWidth, barHeight, 16);

  // Health
  fill(0, 200, 0);
  rect(x, y, barWidth * (hiveHealth / MAX_HIVE_HEALTH), barHeight, 16);

  // Border
  noFill();
  stroke(255);
  strokeWeight(2);
  rect(x, y, barWidth, barHeight, 16);

  // Text
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(
    "Beehive Health: " + hiveHealth + " / " + MAX_HIVE_HEALTH,
    width / 2,
    y + barHeight / 2,
  );
}

function drawMiniHiveHealthBar() {
  let hiveX = width / 2;
  let hiveY = height * 0.71;

  let barWidth = 80;
  let barHeight = 10;

  // Background
  fill(80);
  rect(hiveX - barWidth / 2, hiveY - 95, barWidth, barHeight);

  // Health
  fill(0, 200, 0);
  rect(
    hiveX - barWidth / 2,
    hiveY - 95,
    barWidth * (hiveHealth / MAX_HIVE_HEALTH),
    barHeight,
  );

  // Border
  noFill();
  stroke(0);
  rect(hiveX - barWidth / 2, hiveY - 95, barWidth, barHeight);

  noStroke();
}

function updateScore() {
  // Score is now earned by clicking enemies.
}

function drawTopUI() {
  fill(40, 40, 40, 180);
  stroke(255);
  strokeWeight(2);

  // Round box
  rect(20, 18, 125, 40, 10);

  // Score box
  rect(155, 18, 145, 40, 10);

  noStroke();
  fill(255);

  textAlign(CENTER, CENTER);
  textSize(17);

  text("Round " + round, 20 + 125 / 2, 18 + 40 / 2);

  text("Score " + score, 155 + 145 / 2, 18 + 40 / 2);
}

function drawPauseButton() {
  let hovering =
    mouseX > pauseButton.x &&
    mouseX < pauseButton.x + pauseButton.w &&
    mouseY > pauseButton.y &&
    mouseY < pauseButton.y + pauseButton.h;

  if (hovering) {
    stroke(255);
    strokeWeight(4);
    fill(255, 220, 60);
  } else {
    noStroke();
    fill(255, 180, 0);
  }
  rect(pauseButton.x, pauseButton.y, pauseButton.w, pauseButton.h, 12);

  fill(50);

  if (!paused) {
    // Pause bars
    rect(pauseButton.x + 20, pauseButton.y + 10, 5, 25, 2);
    rect(pauseButton.x + 35, pauseButton.y + 10, 5, 25, 2);
  } else {
    // Play icon
    triangle(
      pauseButton.x + 22,
      pauseButton.y + 10,
      pauseButton.x + 22,
      pauseButton.y + 35,
      pauseButton.x + 42,
      pauseButton.y + 22.5,
    );
  }
}

function keyPressed() {
  console.log(key, keyCode);
  if (roundComplete && keyCode === ENTER) {
    roundComplete = false;

    roundTarget += 10000;

    // Reset "FASTER" checkpoints
    previousLevel = -1;
    speedLevel = 0;

    bears = [];
    birds = [];

    // Small break before enemies return
    nextBearSpawn = millis() + 2000;
    nextBirdSpawn = millis() + 3000;
  }

  // Start game
  if (!gameStarted && key === " " && !gameOver) {
    gameStarted = true;
    introTimer = 300;
  }

  // Restart after game over
  else if (gameOver && key === " ") {
    score = 0;
    honey = 0;
    hiveHealth = 100;

    bears = [];
    birds = [];

    gameOver = false;

    scoreLevel = 0;
    previousLevel = 0;
    fasterTimer = 0;
    introTimer = 300;

    nextBearSpawn = millis() + 5000;
    nextBirdSpawn = millis() + 8000;
  }
}

function drawTurret() {
  if (!inventory.turret) return;

  fill(80);

  rect(width / 2 - 12, height * 0.67, 24, 45, 5);

  fill(50);

  rect(width / 2 - 4, height * 0.63, 8, 20, 3);
}
