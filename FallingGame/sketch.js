// Pole obsahuje všechny právě aktivní objekty na canvasu.
// Použití společného pole umožňuje zpracovat různé potomkovské třídy stejným cyklem.
let objects = [];

// Slovník obrázků odděluje názvy assetů od konkrétních instancí p5.Image.
let images = {};

// Hráč je samostatný objekt, protože jeho pohyb řídí uživatel místo gravitace.
let player;

/**
 * Načte obrázky před spuštěním canvasu.
 *
 * p5.js volá preload() automaticky a počká na dokončení loadImage(),
 * takže objekty mohou při prvním vykreslení bezpečně použít připravené obrázky.
 */
function preload() {
  // Klíče flake, drop a soot používá createObject() při výběru typu částice.
  images["flake"] = loadImage("./images/snowflake.svg");
  images["drop"] = loadImage("./images/raindrop.svg");
  images["soot"] = loadImage("./images/soot.svg");
  images["player"] = loadImage("./images/snowman.png");
}

/**
 * Inicializuje scénu po načtení p5.js a všech obrázků.
 */
function setup() {
  // Rozměr canvasu odpovídá zadání z lekce.
  createCanvas(800, 600);

  // Souřadnice objektu budou označovat jeho střed.
  imageMode(CENTER);

  // x je levý okraj hráče, proto od středu canvasu odečteme polovinu velikosti.
  player = new Player(
    width / 2 - 25,
    height - 70,
    50,
    images["player"]
  );
}

/**
 * Hlavní smyčka p5.js, která se opakuje přibližně 60krát za sekundu.
 */
function draw() {
  // Každý snímek nejprve překreslíme pozadí, aby za objekty nezůstávaly stopy.
  background(30, 50, 70);

  // Každý třicátý snímek přidáme nový objekt nad horní okraj canvasu.
  if (frameCount % 30 === 0) {
    createObject();
  }

  // Ovládání se zpracovává v každém snímku kvůli plynulému pohybu při držení klávesy.
  updatePlayer();

  // Pole procházíme odzadu, protože během průchodu můžeme některé objekty odstranit.
  for (let i = objects.length - 1; i >= 0; i--) {
    const object = objects[i];

    // Nejprve aktualizujeme polohu, aby kolize odpovídala právě vznikajícímu snímku.
    object.update();

    // Hráč může objekt sebrat nebo zasáhnout. Po kolizi se objekt odstraní
    // a continue zabrání jeho dalšímu vykreslení v tomto průchodu.
    if (player.collide(object)) {
      objects.splice(i, 1);
      continue;
    }

    // Polymorfismus: každý typ objektu sám rozhodne, jak se vykreslí.
    object.draw();

    // Objekt odstraníme až poté, co celý opustí canvas, aby nebylo pole zbytečně velké.
    if (object.y > height + object.size) {
      objects.splice(i, 1);
    }
  }

  // Hráče kreslíme po padajících objektech, aby byl v popředí scény.
  player.draw();

  drawStatistics();
}

/**
 * Předá aktuální stav šipek hráči.
 *
 * keyIsDown() vrací true po celou dobu, kdy je klávesa stisknutá. To je
 * vhodnější než keyPressed() pro spojitý pohyb, protože draw() může hráče
 * posouvat v každém animačním snímku.
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
 * Vytvoří jednu náhodnou instanci vločky, kapky nebo sazí.
 */
function createObject() {
  // Objekt začíná nad canvasem a během dalších snímků do něj spadne.
  const x = random(width);
  const y = random(-200, -20);
  const size = random(10, 40);

  // floor(random(3)) vrací pouze hodnoty 0, 1 nebo 2.
  const type = floor(random(3));

  // Každá větev vytvoří jinou potomkovskou třídu se správným obrázkem.
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
 * Vypíše aktuální počet všech objektů a počet jednotlivých typů.
 */
function drawStatistics() {
  // Nastavení textu se provádí před všemi voláními text().
  fill(255);
  noStroke();
  textSize(16);

  // Skóre je uloženo uvnitř hráče, proto ho čteme přes player.score.
  text("Počet objektů: " + objects.length, 20, 30);
  text("Skóre: " + player.score, 20, 50);
}
