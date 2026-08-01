// Herní stavy určují, která část programu se má v daném snímku aktualizovat
// a vykreslit. Textové konstanty zabraňují opakování stejných řetězců v kódu.
const STATE_START = "start";
const STATE_PLAYING = "playing";
const STATE_HELP = "help";
const STATE_END = "end";

// Herní pravidla jsou soustředěna na jednom místě, aby se snadno upravovala.
const GAME_DURATION = 60;
const OBJECT_INTERVAL = 30;

// Číselné kódy slouží jako záloha pro prohlížeče, které nepředají očekávaný text key.
const ENTER_KEY_CODE = 13;
const ESCAPE_KEY_CODE = 27;

// Aplikace začíná na úvodní obrazovce, nikoli okamžitě v aktivní hře.
let gameState = STATE_START;

// Pole obsahuje všechny právě aktivní padající objekty.
let objects = [];

// Slovník obrázků odděluje názvy assetů od konkrétních instancí p5.Image.
let images = {};

// Slovník zvuků funguje stejně jako slovník obrázků.
let sounds = {};

// Hráč je samostatný objekt, protože jeho pohyb řídí uživatel místo gravitace.
let player;

// Časové údaje používáme pro odpočet a pro pozastavení během nápovědy.
let startTime = 0;
let elapsedTime = 0;
let remainingTime = GAME_DURATION;
let pauseStartTime = 0;

// Nastavení zvuku a rekord přetrvávají mezi snímky. Rekord navíc ukládáme
// do localStorage prostřednictvím funkcí getItem() a storeItem() z p5.js.
let soundEnabled = true;
let highScore = 0;

/**
 * Načte všechny obrázky a zvuky před spuštěním canvasu.
 *
 * p5.js volá preload() automaticky a počká na dokončení loadImage() i
 * loadSound(). Díky tomu jsou assety připravené dříve, než začne setup().
 */
function preload() {
  // Padající objekty používají stejné obrázky jako v předchozích lekcích.
  images["flake"] = loadImage("./images/snowflake.svg");
  images["drop"] = loadImage("./images/raindrop.svg");
  images["soot"] = loadImage("./images/soot.svg");

  // Pozadí je volitelné. drawBackground() má připravenou barevnou zálohu.
  images["background"] = loadImage("./images/christmas.jpg");

  // Obrázek hráče se vykreslí dovnitř jeho obdélníku.
  images["player"] = loadImage("./images/snowman.png");

  // Každý zvuk má vlastní klíč, podle kterého ho volá playSound().
  sounds["collect"] = loadSound("./sounds/collect.mp3");
  sounds["hit"] = loadSound("./sounds/hit.mp3");
  sounds["start"] = loadSound("./sounds/start.mp3");
  sounds["end"] = loadSound("./sounds/end.mp3");
}

/**
 * Inicializuje canvas, hráče, uložený rekord a hlasitost zvuků.
 */
function setup() {
  createCanvas(800, 600);

  // Padající obrázky mají střed v x/y, hráčův obdélník používá levý horní roh.
  imageMode(CENTER);
  rectMode(CORNER);

  player = new Player(
    width / 2 - 25,
    height - 70,
    50,
    images["player"]
  );

  // getItem() vrací null, pokud v prohlížeči zatím žádný rekord není uložený.
  const savedScore = getItem("winterHighScore");

  if (savedScore !== null) {
    highScore = savedScore;
  }

  // Efekty mají rozdílnou hlasitost, aby krátký zásah nebyl příliš výrazný.
  sounds["collect"].setVolume(0.4);
  sounds["hit"].setVolume(0.5);
  sounds["start"].setVolume(0.5);
  sounds["end"].setVolume(0.6);
}

/**
 * Hlavní smyčka p5.js.
 *
 * Každý herní stav má vlastní odpovědnost. Úvodní, nápověda a koncová
 * obrazovka se pouze vykreslují; aktivní hra navíc aktualizuje čas, hráče
 * a padající objekty.
 */
function draw() {
  if (gameState === STATE_START) {
    drawStartScreen();
  } else if (gameState === STATE_PLAYING) {
    updateGame();
    drawGame();
  } else if (gameState === STATE_HELP) {
    // Při nápovědě scénu stále vidíme, ale updateGame() se nespouští.
    drawGame();
    drawHelp();
  } else if (gameState === STATE_END) {
    drawEndScreen();
  }
}

/**
 * Aktualizuje jednu iteraci aktivní hry.
 */
function updateGame() {
  updateTimer();

  // Po vypršení času přejdeme na koncovou obrazovku a tento snímek ukončíme.
  if (remainingTime <= 0) {
    endGame();
    return;
  }

  updatePlayer();
  updateObjects();
}

/**
 * Přepočítá uplynulý a zbývající čas hry.
 *
 * startTime je čas zahájení aktuální hry. Při pauze ho closeHelp() posune
 * o délku pauzy, takže čas nápovědy se do limitu nezapočítá.
 */
function updateTimer() {
  elapsedTime = millis() - startTime;
  remainingTime = max(
    0,
    GAME_DURATION - elapsedTime / 1000
  );
}

/**
 * Předá aktuální stav šipek hráči.
 *
 * keyIsDown() vrací true po celou dobu držení klávesy, proto je vhodné
 * pro plynulý pohyb zpracovávaný v každém animačním snímku.
 */
function updatePlayer() {
  if (keyIsDown(LEFT_ARROW)) {
    player.update("left");
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.update("right");
  }
}

/**
 * Vytvoří nové objekty, posune je, vyhodnotí kolize a odstraní neaktivní prvky.
 */
function updateObjects() {
  // Nový objekt přibude jednou za OBJECT_INTERVAL snímků.
  if (frameCount % OBJECT_INTERVAL === 0) {
    createObject();
  }

  // Procházíme odzadu, protože při kolizi nebo opuštění canvasu používáme splice().
  for (let i = objects.length - 1; i >= 0; i--) {
    const object = objects[i];

    // Nejdříve aktualizujeme polohu, aby kolize odpovídala vykreslenému snímku.
    object.update();

    // Player.collide() vrací typ kolize, nikoli pouze true/false.
    const collisionType = player.collide(object);

    if (collisionType !== null) {
      // Saze jsou zásah, vločka a kapka jsou pozitivní sběr.
      if (collisionType === "soot") {
        playSound("hit");
      } else {
        playSound("collect");
      }

      objects.splice(i, 1);
      // Po odstranění objektu už v této iteraci nesmíme volat draw().
      continue;
    }

    // Pokud objekt nebyl sebrán, vykreslíme jeho aktuální stav.
    // Konkrétní potomek sám určí způsob vykreslení pomocí polymorfismu.
    object.draw();

    // Objekty mimo scénu už nemají žádný herní význam.
    if (object.y > height + object.size) {
      objects.splice(i, 1);
    }
  }
}

/**
 * Vytvoří jeden nový padající objekt náhodného typu.
 *
 * Všechny typy ukládáme do stejného pole, protože mají společné metody
 * update() a draw(). Konkrétní třída se vybere až podle náhodné hodnoty type.
 */
function createObject() {
  // Objekt začíná nad horní hranicí, aby do scény plynule přiletěl.
  const x = random(width);
  const y = random(-200, -20);
  const size = random(10, 40);
  const type = floor(random(3));

  // Každá větev předá konstruktoru odpovídající obrázek a vytvoří instanci
  // jedné z potomkovských tříd FallingObject.
  switch (type) {
    case 0:
      objects.push(new Snowflake(x, y, size, images["flake"]));
      break;

    case 1:
      objects.push(new Raindrop(x, y, size, images["drop"]));
      break;

    case 2:
      objects.push(new Soot(x, y, size, images["soot"]));
      break;
  }
}

/**
 * Vykreslí herní scénu ve stabilním pořadí vrstev.
 */
function drawGame() {
  drawBackground();
  drawObjects();
  player.draw();
  drawHUD();
}

/**
 * Vykreslí zimní obrázek na pozadí, případně použije barevnou zálohu.
 */
function drawBackground() {
  if (images["background"]) {
    image(
      images["background"],
      width / 2,
      height / 2,
      width,
      height
    );
  } else {
    background(40, 70, 100);
  }
}

/**
 * Vykreslí všechny dosud aktivní padající objekty.
 */
function drawObjects() {
  for (const object of objects) {
    object.draw();
  }
}

/**
 * Vykreslí informační panel s herním stavem a ovládáním.
 */
function drawHUD() {
  push();

  // Poloprůhledný panel zachová čitelnost textu nad zimním pozadím.
  fill(0, 170);
  noStroke();
  rect(12, 12, 235, 110, 12);

  textAlign(LEFT, TOP);
  textSize(18);

  fill(255);
  text("Skóre: " + player.score, 28, 25);

  // Čas mění barvu podle naléhavosti, aby konec hry byl na první pohled vidět.
  fill(getTimeColor());
  text(
    "Čas: " + remainingTime.toFixed(1) + " s",
    28,
    52
  );

  fill(255);
  textSize(14);
  text(
    soundEnabled
      ? "M – vypnout zvuk"
      : "M – zapnout zvuk",
    28,
    82
  );
  text("H – nápověda", 28, 102);

  pop();
}

/**
 * Vrátí barvu časového údaje podle zbývajícího času.
 *
 * @returns {p5.Color} Barva pro text času.
 */
function getTimeColor() {
  if (remainingTime <= 5) {
    return color(255, 70, 70);
  }

  if (remainingTime <= 15) {
    return color(255, 190, 70);
  }

  return color(255);
}

/**
 * Připraví hráče, prázdné pole a čas pro novou hru.
 */
function startGame() {
  objects = [];

  player.score = 0;
  player.x = width / 2 - player.size / 2;
  player.y = height - player.size - 20;

  startTime = millis();
  elapsedTime = 0;
  remainingTime = GAME_DURATION;

  gameState = STATE_PLAYING;
  playSound("start");
}

/**
 * Ukončí hru, případně uloží nový rekord a zobrazí koncovou obrazovku.
 */
function endGame() {
  // Rekord ukládáme pouze při jeho překonání.
  if (player.score > highScore) {
    highScore = player.score;
    storeItem("winterHighScore", highScore);
  }

  gameState = STATE_END;
  playSound("end");
}

/**
 * Otevře nápovědu a zaznamená okamžik začátku pauzy.
 */
function openHelp() {
  pauseStartTime = millis();
  gameState = STATE_HELP;
}

/**
 * Zavře nápovědu a prodlouží startTime o dobu, kdy byla hra pozastavená.
 */
function closeHelp() {
  const pauseDuration = millis() - pauseStartTime;

  startTime += pauseDuration;
  gameState = STATE_PLAYING;
}

/**
 * Přehraje pojmenovaný zvuk, pokud je povolený a byl načtený.
 *
 * Kontrola existence chrání aplikaci před chybou při případném selhání
 * načítání assetu. Přepínač soundEnabled umožňuje zvuk kdykoli umlčet.
 *
 * @param {string} name Klíč zvuku ve slovníku sounds.
 */
function playSound(name) {
  if (soundEnabled && sounds[name]) {
    sounds[name].play();
  }
}

/**
 * Vykreslí úvodní obrazovku s pravidly a ovládáním.
 */
function drawStartScreen() {
  drawBackground();

  fill(0, 185);
  noStroke();
  rect(60, 45, width - 120, height - 90, 22);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(42);
  text("Winter Is Coming!", width / 2, 95);

  textSize(21);
  text(
    "Sbírej vločky a kapky.\nVyhýbej se sazím.",
    width / 2,
    175
  );

  drawRuleItem(
    width / 2,
    260,
    color(220, 245, 255),
    "Vločka",
    "+2 body"
  );
  drawRuleItem(
    width / 2,
    315,
    color(80, 170, 255),
    "Kapka",
    "+1 bod"
  );
  drawRuleItem(
    width / 2,
    370,
    color(50),
    "Saze",
    "-3 body"
  );

  fill(255);
  textSize(17);
  text(
    "Pohyb: ← →    Nápověda: H    Zvuk: M",
    width / 2,
    435
  );

  textSize(24);
  text("Stiskni ENTER", width / 2, 505);

  textSize(15);
  text("Nejvyšší skóre: " + highScore, width / 2, 545);
}

/**
 * Vykreslí jednu položku pravidel na úvodní obrazovce.
 *
 * @param {number} x Střed celé položky.
 * @param {number} y Vertikální poloha položky.
 * @param {p5.Color} itemColor Barva kruhu reprezentujícího objekt.
 * @param {string} label Název objektu.
 * @param {string} points Bodová hodnota objektu.
 */
function drawRuleItem(x, y, itemColor, label, points) {
  push();

  fill(itemColor);
  stroke(255);
  strokeWeight(1);
  circle(x - 120, y, 32);

  fill(255);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(18);
  text(label, x - 85, y);
  text(points, x + 65, y);

  pop();
}

/**
 * Vykreslí překryv s pravidly a klávesovými zkratkami.
 */
function drawHelp() {
  push();

  fill(0, 220);
  noStroke();
  rect(80, 70, width - 160, height - 140, 22);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(34);
  text("Nápověda", width / 2, 125);

  textSize(20);
  text(
    "← →  pohyb hráče\n\n" +
      "Vločka: +2 body\n" +
      "Kapka: +1 bod\n" +
      "Saze: -3 body\n\n" +
      "H – návrat do hry\n" +
      "M – zapnout nebo vypnout zvuk",
    width / 2,
    height / 2 + 20
  );

  pop();
}

/**
 * Vykreslí výsledek hry a nabídne restart nebo návrat na začátek.
 */
function drawEndScreen() {
  drawBackground();

  fill(0, 210);
  noStroke();
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(44);
  text("Konec hry", width / 2, 120);

  textSize(30);
  text("Skóre: " + player.score, width / 2, 230);

  textSize(22);
  text("Nejvyšší skóre: " + highScore, width / 2, 285);

  textSize(20);
  text("ENTER – nová hra", width / 2, 390);
  text("ESC – hlavní nabídka", width / 2, 430);
  text("M – zvuk", width / 2, 470);
}

/**
 * Zpracuje klávesové zkratky podle aktuálního herního stavu.
 *
 * Po obsloužení akce používáme return, aby jeden stisk nespustil více
 * přechodů mezi stavy najednou.
 */
function keyPressed() {
  // Přepínač zvuku funguje na všech obrazovkách.
  if (key === "m" || key === "M") {
    soundEnabled = !soundEnabled;
    return;
  }

  // Enter ověřujeme textem i číselným kódem. Tím funguje při různých
  // implementacích KeyboardEventu i v různých prohlížečích.
  const isEnter = key === "Enter" || keyCode === ENTER_KEY_CODE;
  const isEscape = key === "Escape" || keyCode === ESCAPE_KEY_CODE;

  if (gameState === STATE_START && isEnter) {
    startGame();
    return;
  }

  if (gameState === STATE_PLAYING && (key === "h" || key === "H")) {
    openHelp();
    return;
  }

  if (gameState === STATE_HELP && (key === "h" || key === "H")) {
    closeHelp();
    return;
  }

  if (gameState === STATE_END && isEnter) {
    startGame();
    return;
  }

  if (gameState === STATE_END && isEscape) {
    gameState = STATE_START;
    return false;
  }
}
