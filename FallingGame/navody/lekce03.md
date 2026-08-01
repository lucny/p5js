# Lekce 3: Herní stavy, čas, uživatelské rozhraní a zvuk

## Cíl lekce

V předchozích dvou lekcích jsme vytvořili základ herní aplikace.

V první lekci jsme naprogramovali:

* rodičovskou třídu `FallingObject`,
* třídy `Snowflake`, `Raindrop` a `Soot`,
* pole padajících objektů,
* automatické vytváření a odstraňování objektů,
* dědičnost a polymorfismus.

Ve druhé lekci jsme přidali:

* třídu `Player`,
* ovládání klávesami,
* kolize,
* bodování,
* odstraňování sebraných objektů,
* možnost hry jednoho nebo dvou hráčů.

Hra už má základní mechaniku, ale zatím se spustí okamžitě po načtení stránky. Chybí jí jasný začátek, pravidla, časový limit, závěrečné vyhodnocení a možnost nové hry.

Ve třetí lekci aplikaci dokončíme.

Přidáme:

* úvodní obrazovku,
* herní stavy,
* zahájení hry stiskem klávesy,
* měření času,
* informační panel,
* rychlou nápovědu,
* ukončení hry,
* závěrečnou obrazovku,
* určení vítěze,
* restart hry,
* zvukové efekty,
* základní správu zvuků,
* oddělení herní logiky od uživatelského rozhraní.

---

# 1. Problém současné verze

Dosavadní hra začne okamžitě po spuštění programu.

Funkce `draw()` rovnou:

* vytváří padající objekty,
* zpracovává pohyb hráče,
* kontroluje kolize,
* mění skóre,
* vykresluje scénu.

Uživatel nemá čas přečíst si pravidla ani připravit se.

Po skončení hry bychom mohli použít:

```javascript
noLoop();
```

Tím se ale funkce `draw()` úplně zastaví.

Toto řešení má několik nevýhod:

* obtížně se vytváří restart,
* závěrečná obrazovka už není animovaná,
* nelze snadno přecházet mezi více obrazovkami,
* logika hry a uživatelské rozhraní jsou smíchány dohromady.

Lepším řešením jsou herní stavy.

---

# 2. Co je herní stav

Herní stav označuje, v jaké fázi se aplikace právě nachází.

Naše hra bude mít tři základní stavy:

```text
START
PLAYING
END
```

Jejich význam:

| Stav      | Význam                         |
| --------- | ------------------------------ |
| `START`   | úvodní obrazovka a pravidla    |
| `PLAYING` | vlastní průběh hry             |
| `END`     | závěrečná obrazovka a výsledky |

V každém stavu se program chová jinak.

Na úvodní obrazovce:

* nevytváříme objekty,
* nepohybujeme hráči,
* nepočítáme herní čas.

Během hry:

* vytváříme objekty,
* ovládáme hráče,
* kontrolujeme kolize,
* měníme skóre.

Na závěrečné obrazovce:

* hra se už neaktualizuje,
* zobrazíme výsledky,
* nabídneme restart.

---

# 3. Konstanty herních stavů

Na začátek `sketch.js` přidáme:

```javascript
const STATE_START = "start";
const STATE_PLAYING = "playing";
const STATE_END = "end";
```

Potom vytvoříme proměnnou:

```javascript
let gameState = STATE_START;
```

Po spuštění programu se hra nachází ve stavu:

```javascript
STATE_START
```

Použití konstant je výhodné, protože se vyhneme opakovanému zapisování textových hodnot.

Místo:

```javascript
gameState = "playing";
```

použijeme:

```javascript
gameState = STATE_PLAYING;
```

Tím snížíme riziko překlepu.

---

# 4. Rozdělení funkce `draw()`

Funkci `draw()` upravíme tak, aby podle stavu zavolala odpovídající část programu.

```javascript
function draw() {
  if (gameState === STATE_START) {
    drawStartScreen();
  } else if (
    gameState === STATE_PLAYING
  ) {
    updateGame();
    drawGame();
  } else if (
    gameState === STATE_END
  ) {
    drawEndScreen();
  }
}
```

Funkce `draw()` už nebude obsahovat všechny podrobnosti hry.

Bude fungovat jako rozcestník:

```text
START   → drawStartScreen()
PLAYING → updateGame() + drawGame()
END     → drawEndScreen()
```

---

# 5. Oddělení aktualizace a vykreslování

Dosud jsme ve funkci `draw()` často současně:

* měnili stav,
* vykreslovali objekty,
* kontrolovali kolize,
* počítali čas.

Nyní rozdělíme program na dvě části.

## Aktualizace

Funkce:

```javascript
updateGame()
```

bude:

* vytvářet objekty,
* zpracovávat vstup,
* měnit polohu objektů,
* kontrolovat kolize,
* měřit čas,
* kontrolovat konec hry.

## Vykreslování

Funkce:

```javascript
drawGame()
```

bude:

* kreslit pozadí,
* kreslit padající objekty,
* kreslit hráče,
* kreslit informační panel.

Toto rozdělení je důležité pro přehlednost programu.

---

# 6. První úvodní obrazovka

Vytvoříme funkci:

```javascript
function drawStartScreen() {
  background(25, 45, 75);

  fill(255);
  noStroke();

  textAlign(CENTER, CENTER);

  textSize(42);
  text(
    "Winter Is Coming!",
    width / 2,
    100
  );

  textSize(24);
  text(
    "Sbírej vločky a kapky.\nVyhýbej se sazím.",
    width / 2,
    220
  );

  textSize(18);
  text(
    "Pohyb: šipky vlevo a vpravo",
    width / 2,
    320
  );

  textSize(22);
  text(
    "Stiskni ENTER pro zahájení hry",
    width / 2,
    430
  );
}
```

Používáme:

```javascript
textAlign(CENTER, CENTER);
```

Souřadnice textu nyní označují jeho střed.

Řetězec:

```javascript
"Sbírej vločky a kapky.\nVyhýbej se sazím."
```

obsahuje znak:

```text
\n
```

Ten vytvoří nový řádek.

---

# 7. Barevné znázornění pravidel

Pravidla můžeme zobrazit názorněji.

```javascript
function drawStartScreen() {
  background(25, 45, 75);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(42);
  text(
    "Winter Is Coming!",
    width / 2,
    80
  );

  textSize(20);
  text(
    "Sbírej dobré objekty a vyhýbej se sazím.",
    width / 2,
    145
  );

  drawRuleItem(
    width / 2,
    220,
    color(220, 245, 255),
    "Vločka",
    "+2 body"
  );

  drawRuleItem(
    width / 2,
    280,
    color(80, 170, 255),
    "Kapka",
    "+1 bod"
  );

  drawRuleItem(
    width / 2,
    340,
    color(50),
    "Saze",
    "-3 body"
  );

  fill(255);
  textSize(18);
  text(
    "Pohyb: ← →",
    width / 2,
    410
  );

  textSize(22);
  text(
    "ENTER – začít hru",
    width / 2,
    470
  );
}
```

Pomocná funkce:

```javascript
function drawRuleItem(
  x,
  y,
  itemColor,
  label,
  points
) {
  fill(itemColor);
  circle(x - 110, y, 32);

  fill(255);
  textSize(18);
  textAlign(LEFT, CENTER);

  text(label, x - 75, y);
  text(points, x + 70, y);

  textAlign(CENTER, CENTER);
}
```

Tím znovu využíváme vlastní funkci s parametry.

---

# 8. Spuštění hry klávesou ENTER

Událostní funkci `keyPressed()` rozšíříme:

```javascript
function keyPressed() {
  if (
    gameState === STATE_START &&
    keyCode === ENTER
  ) {
    startGame();
  }
}
```

Podmínka ověřuje současně:

1. jsme na úvodní obrazovce,
2. uživatel stiskl `ENTER`.

Teprve potom se spustí hra.

---

# 9. Funkce `startGame()`

Vytvoříme samostatnou funkci:

```javascript
function startGame() {
  gameState = STATE_PLAYING;
}
```

Zatím pouze změní stav.

Funkce `draw()` začne při dalším snímku volat:

```javascript
updateGame();
drawGame();
```

Místo:

```javascript
drawStartScreen();
```

---

# 10. Proč potřebujeme inicializaci nové hry

Při prvním spuštění by jednoduchá změna stavu stačila.

Při restartu ale potřebujeme obnovit celý herní stav:

* odstranit staré objekty,
* vynulovat skóre,
* vrátit hráče na počáteční polohu,
* nastavit nový čas začátku,
* obnovit stavy kláves,
* skrýt nápovědu.

Proto funkci `startGame()` postupně rozšíříme.

---

# 11. Konstanty časového limitu

Na začátek programu přidáme:

```javascript
const GAME_DURATION = 60;
```

Hodnota je uvedena v sekundách.

Dále vytvoříme:

```javascript
let startTime = 0;
let elapsedTime = 0;
let remainingTime = GAME_DURATION;
```

Proměnné mají tento význam:

| Proměnná        | Význam               |
| --------------- | -------------------- |
| `startTime`     | okamžik zahájení hry |
| `elapsedTime`   | dosud uplynulý čas   |
| `remainingTime` | zbývající čas        |

---

# 12. Funkce `millis()`

p5.js poskytuje funkci:

```javascript
millis()
```

Ta vrací počet milisekund od spuštění aplikace.

Například:

```text
1000 ms = 1 sekunda
5000 ms = 5 sekund
60000 ms = 60 sekund
```

Při spuštění hry uložíme:

```javascript
startTime = millis();
```

Později vypočítáme:

```javascript
elapsedTime =
  millis() - startTime;
```

Tím získáme dobu od začátku aktuální hry.

---

# 13. Rozšířená funkce `startGame()`

```javascript
function startGame() {
  objects = [];

  player.score = 0;

  player.x =
    width / 2 -
    player.size / 2;

  player.y =
    height -
    player.size -
    20;

  startTime = millis();
  elapsedTime = 0;
  remainingTime = GAME_DURATION;

  gameState = STATE_PLAYING;
}
```

Při každé nové hře:

* pole objektů je vyprázdněno,
* skóre je vynulováno,
* hráč je vrácen na začátek,
* čas se začne měřit znovu.

---

# 14. Měření času během hry

Ve funkci `updateGame()` přidáme:

```javascript
elapsedTime =
  millis() - startTime;
```

Protože `elapsedTime` je v milisekundách, převedeme jej na sekundy:

```javascript
let elapsedSeconds =
  elapsedTime / 1000;
```

Zbývající čas:

```javascript
remainingTime =
  GAME_DURATION -
  elapsedSeconds;
```

Aby nevznikla záporná hodnota:

```javascript
remainingTime = max(
  0,
  GAME_DURATION -
    elapsedSeconds
);
```

---

# 15. Kontrola konce hry

Ve funkci `updateGame()`:

```javascript
if (remainingTime <= 0) {
  endGame();
}
```

Funkce:

```javascript
function endGame() {
  gameState = STATE_END;
}
```

Pouze změní herní stav.

Není nutné volat:

```javascript
noLoop();
```

Funkce `draw()` se bude spouštět dál, ale místo hry začne vykreslovat závěrečnou obrazovku.

---

# 16. První verze `updateGame()`

```javascript
function updateGame() {
  updateTimer();

  if (remainingTime <= 0) {
    endGame();
    return;
  }

  updatePlayer();
  updateObjects();
}
```

Použili jsme:

```javascript
return;
```

Jakmile čas vyprší, funkce se ukončí a v daném snímku už neaktualizuje hráče ani objekty.

---

# 17. Samostatná funkce pro čas

```javascript
function updateTimer() {
  elapsedTime =
    millis() - startTime;

  remainingTime = max(
    0,
    GAME_DURATION -
      elapsedTime / 1000
  );
}
```

Funkce má jednu jasnou odpovědnost:

> aktualizovat hodnoty související s časem

---

# 18. Samostatná funkce pro ovládání hráče

```javascript
function updatePlayer() {
  if (keyIsDown(LEFT_ARROW)) {
    player.update("left");
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.update("right");
  }
}
```

Tato funkce již vznikla ve druhé lekci.

Nyní ji voláme pouze ve stavu:

```javascript
STATE_PLAYING
```

Na úvodní ani závěrečné obrazovce se hráč nepohybuje.

---

# 19. Samostatná funkce pro objekty

```javascript
function updateObjects() {
  if (frameCount % 30 === 0) {
    createObject();
  }

  for (
    let i = objects.length - 1;
    i >= 0;
    i--
  ) {
    let object = objects[i];

    object.update();

    if (player.collide(object)) {
      objects.splice(i, 1);
      continue;
    }

    if (
      object.y >
      height + object.size
    ) {
      objects.splice(i, 1);
    }
  }
}
```

Všimněme si, že zde objekty zatím nevykreslujeme.

Funkce pouze:

* vytváří,
* aktualizuje,
* kontroluje,
* odstraňuje.

---

# 20. Vykreslení herní scény

```javascript
function drawGame() {
  drawBackground();
  drawObjects();
  player.draw();
  drawHUD();
}
```

Zkratka HUD znamená:

```text
Head-Up Display
```

Jde o informační vrstvu hry, například:

* skóre,
* čas,
* počet životů,
* herní cíle,
* stav energie.

---

# 21. Vykreslení pozadí

Pokud máme obrázek pozadí:

```javascript
function drawBackground() {
  image(
    images["background"],
    width / 2,
    height / 2,
    width,
    height
  );
}
```

Pokud obrázek není k dispozici, můžeme použít barvu:

```javascript
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
```

---

# 22. Vykreslení objektů

```javascript
function drawObjects() {
  for (let object of objects) {
    object.draw();
  }
}
```

Používáme cyklus:

```javascript
for...of
```

Protože při vykreslování objekty neodstraňujeme, nepotřebujeme index ani průchod odzadu.

---

# 23. První informační panel

```javascript
function drawHUD() {
  fill(0, 150);
  noStroke();

  rect(
    10,
    10,
    210,
    75,
    10
  );

  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);

  text(
    "Skóre: " + player.score,
    25,
    22
  );

  text(
    "Čas: " +
      remainingTime.toFixed(1) +
      " s",
    25,
    50
  );
}
```

Metoda:

```javascript
toFixed(1)
```

zobrazí číslo s jedním desetinným místem.

Například:

```text
18.4726 → "18.5"
```

Výsledkem je textový řetězec.

---

# 24. Zobrazení času pomocí `nf()`

p5.js nabízí také:

```javascript
nf()
```

Použití:

```javascript
nf(
  remainingTime,
  1,
  1
)
```

Parametry znamenají:

* minimální počet číslic před desetinnou čárkou,
* počet desetinných míst.

Text:

```javascript
"Čas: " +
nf(remainingTime, 1, 1) +
" s"
```

je vhodnou alternativou k `toFixed()`.

---

# 25. Barevná změna času

Když se čas blíží ke konci, můžeme změnit barvu.

```javascript
function getTimeColor() {
  if (remainingTime <= 5) {
    return color(255, 60, 60);
  }

  if (remainingTime <= 15) {
    return color(255, 190, 60);
  }

  return color(255);
}
```

Ve funkci `drawHUD()`:

```javascript
fill(getTimeColor());

text(
  "Čas: " +
    remainingTime.toFixed(1) +
    " s",
  25,
  50
);
```

Funkce `getTimeColor()` vrací barvu podle zbývajícího času.

---

# 26. Přidání rychlé nápovědy

Nápovědu zobrazíme při držení klávesy `H`.

Ve funkci `drawGame()`:

```javascript
function drawGame() {
  drawBackground();
  drawObjects();
  player.draw();
  drawHUD();

  if (keyIsDown(72)) {
    drawHelp();
  }
}
```

Kód:

```text
72
```

odpovídá klávese `H`.

---

# 27. Funkce `drawHelp()`

```javascript
function drawHelp() {
  push();

  fill(0, 210);
  noStroke();

  rect(
    80,
    80,
    width - 160,
    height - 160,
    20
  );

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(30);
  text(
    "Rychlá nápověda",
    width / 2,
    135
  );

  textSize(19);
  text(
    "← →  pohyb hráče\n\n" +
    "Vločka: +2 body\n" +
    "Kapka: +1 bod\n" +
    "Saze: -3 body\n\n" +
    "Uvolni H pro návrat do hry",
    width / 2,
    height / 2 + 20
  );

  pop();
}
```

Nápověda hru nezastavuje. Objekty pod ní stále padají.

To může být záměr, ale také problém.

---

# 28. Pozastavení hry při nápovědě

Přidáme nový stav:

```javascript
const STATE_HELP = "help";
```

Stavy budou:

```javascript
const STATE_START = "start";
const STATE_PLAYING = "playing";
const STATE_HELP = "help";
const STATE_END = "end";
```

Funkce `draw()`:

```javascript
function draw() {
  if (gameState === STATE_START) {
    drawStartScreen();
  } else if (
    gameState === STATE_PLAYING
  ) {
    updateGame();
    drawGame();
  } else if (
    gameState === STATE_HELP
  ) {
    drawGame();
    drawHelp();
  } else if (
    gameState === STATE_END
  ) {
    drawEndScreen();
  }
}
```

Ve stavu `STATE_HELP` se hra vykresluje, ale neaktualizuje.

---

# 29. Přepínání nápovědy

V `keyPressed()`:

```javascript
function keyPressed() {
  if (
    gameState === STATE_START &&
    keyCode === ENTER
  ) {
    startGame();
    return;
  }

  if (
    gameState === STATE_PLAYING &&
    (key === "h" || key === "H")
  ) {
    gameState = STATE_HELP;
    return;
  }

  if (
    gameState === STATE_HELP &&
    (key === "h" || key === "H")
  ) {
    gameState = STATE_PLAYING;
  }
}
```

Klávesa `H` nyní funguje jako přepínač.

---

# 30. Problém času při pozastavení

Pokud pouze změníme stav na `STATE_HELP`, funkce `millis()` stále běží.

Po návratu do hry by se do uplynulého času započítala i doba strávená v nápovědě.

Máme dvě možnosti:

1. nápověda čas nezastavuje,
2. nápověda funguje jako skutečná pauza.

Pro jednodušší verzi můžeme přijmout první variantu.

Pro přesnější řešení přidáme čas pauzy.

---

# 31. Uložení začátku pauzy

Přidáme:

```javascript
let pauseStartTime = 0;
```

Při otevření nápovědy:

```javascript
pauseStartTime = millis();
gameState = STATE_HELP;
```

Při návratu:

```javascript
let pauseDuration =
  millis() - pauseStartTime;

startTime += pauseDuration;

gameState = STATE_PLAYING;
```

Posunutím `startTime` dopředu odstraníme dobu pauzy z měření.

---

# 32. Funkce pro otevření a zavření nápovědy

```javascript
function openHelp() {
  pauseStartTime = millis();
  gameState = STATE_HELP;
}
```

```javascript
function closeHelp() {
  let pauseDuration =
    millis() - pauseStartTime;

  startTime += pauseDuration;

  gameState = STATE_PLAYING;
}
```

Událost:

```javascript
if (
  gameState === STATE_PLAYING &&
  (key === "h" || key === "H")
) {
  openHelp();
  return;
}

if (
  gameState === STATE_HELP &&
  (key === "h" || key === "H")
) {
  closeHelp();
  return;
}
```

---

# 33. Závěrečná obrazovka pro jednoho hráče

Nejprve vytvoříme jednoduchou variantu.

```javascript
function drawEndScreen() {
  background(20, 35, 55);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(42);
  text(
    "Konec hry",
    width / 2,
    130
  );

  textSize(28);
  text(
    "Výsledné skóre: " +
      player.score,
    width / 2,
    250
  );

  textSize(20);
  text(
    "ENTER – nová hra",
    width / 2,
    390
  );

  text(
    "ESC – úvodní obrazovka",
    width / 2,
    430
  );
}
```

---

# 34. Restart z koncové obrazovky

Do `keyPressed()`:

```javascript
if (
  gameState === STATE_END &&
  keyCode === ENTER
) {
  startGame();
  return;
}
```

Funkce `startGame()` obnoví:

* objekty,
* skóre,
* polohu,
* čas,
* stav hry.

Díky tomu není nutné znovu načítat stránku.

---

# 35. Návrat na úvodní obrazovku

```javascript
if (
  gameState === STATE_END &&
  keyCode === ESCAPE
) {
  gameState = STATE_START;
  return false;
}
```

`return false` může zabránit některým výchozím reakcím prohlížeče na klávesu.

---

# 36. Závěrečná obrazovka pro dva hráče

Pokud používáme dva hráče, potřebujeme určit vítěze.

```javascript
function getWinnerText() {
  if (
    player1.score >
    player2.score
  ) {
    return "Vyhrává červený hráč!";
  }

  if (
    player2.score >
    player1.score
  ) {
    return "Vyhrává modrý hráč!";
  }

  return "Remíza!";
}
```

Funkce vrací text podle výsledku.

---

# 37. Funkce `drawEndScreen()` pro dva hráče

```javascript
function drawEndScreen() {
  drawBackground();

  fill(0, 190);
  noStroke();

  rect(
    0,
    0,
    width,
    height
  );

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(40);
  text(
    "Konec hry",
    width / 2,
    100
  );

  drawResultCard(
    width / 2 - 110,
    230,
    player1.color,
    "Hráč 1",
    player1.score
  );

  drawResultCard(
    width / 2 + 110,
    230,
    player2.color,
    "Hráč 2",
    player2.score
  );

  textSize(28);
  text(
    getWinnerText(),
    width / 2,
    350
  );

  textSize(18);
  text(
    "ENTER – nová hra",
    width / 2,
    430
  );

  text(
    "ESC – hlavní nabídka",
    width / 2,
    465
  );
}
```

---

# 38. Karta výsledku

```javascript
function drawResultCard(
  x,
  y,
  cardColor,
  playerName,
  score
) {
  push();

  rectMode(CENTER);

  fill(cardColor);
  stroke(255);
  strokeWeight(2);

  rect(
    x,
    y,
    170,
    120,
    15
  );

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);

  textSize(18);
  text(
    playerName,
    x,
    y - 28
  );

  textSize(34);
  text(
    score,
    x,
    y + 20
  );

  pop();
}
```

Funkce se použije pro oba hráče s jinými parametry.

---

# 39. Nejvyšší skóre

Pro hru jednoho hráče můžeme přidat:

```javascript
let highScore = 0;
```

Ve funkci `endGame()`:

```javascript
function endGame() {
  highScore = max(
    highScore,
    player.score
  );

  gameState = STATE_END;
}
```

Na závěrečné obrazovce:

```javascript
text(
  "Nejvyšší skóre: " +
    highScore,
  width / 2,
  310
);
```

Hodnota zůstane zachována, dokud uživatel neobnoví stránku.

---

# 40. Uložení rekordu do prohlížeče

p5.js nabízí:

```javascript
storeItem()
getItem()
```

Ve funkci `setup()`:

```javascript
let savedScore =
  getItem("winterHighScore");

if (savedScore !== null) {
  highScore = savedScore;
}
```

Při překonání rekordu:

```javascript
if (player.score > highScore) {
  highScore = player.score;

  storeItem(
    "winterHighScore",
    highScore
  );
}
```

Data jsou uložena v lokálním úložišti prohlížeče.

Tento krok je vhodný jako rozšiřující úkol.

---

# 41. Přidání zvukových efektů

Do programu přidáme zvuky pro:

* získání kladného bodu,
* zásah sazemi,
* zahájení hry,
* konec hry.

Proměnné:

```javascript
let sounds = {};
```

Ve funkci `preload()`:

```javascript
sounds["collect"] =
  loadSound(
    "./sounds/collect.mp3"
  );

sounds["hit"] =
  loadSound(
    "./sounds/hit.mp3"
  );

sounds["start"] =
  loadSound(
    "./sounds/start.mp3"
  );

sounds["end"] =
  loadSound(
    "./sounds/end.mp3"
  );
```

---

# 42. Knihovna `p5.sound`

Aby funkce:

```javascript
loadSound()
```

a metoda:

```javascript
play()
```

fungovaly, musí být připojena knihovna:

```html
<script
  src="https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/addons/p5.sound.min.js">
</script>
```

Pokud je již v `index.html`, není nutné nic dalšího přidávat.

---

# 43. Zvuk při spuštění hry

```javascript
function startGame() {
  objects = [];

  player.score = 0;

  player.x =
    width / 2 -
    player.size / 2;

  player.y =
    height -
    player.size -
    20;

  startTime = millis();
  elapsedTime = 0;
  remainingTime = GAME_DURATION;

  gameState = STATE_PLAYING;

  playSound("start");
}
```

Pomocná funkce:

```javascript
function playSound(name) {
  if (
    sounds[name] &&
    !sounds[name].isPlaying()
  ) {
    sounds[name].play();
  }
}
```

---

# 44. Proč vytvořit funkci `playSound()`

Bez pomocné funkce bychom psali:

```javascript
sounds["start"].play();
```

Pokud by se zvuk nepodařilo načíst, vznikla by chyba.

Podmínka:

```javascript
if (sounds[name])
```

ověří, zda zvuk existuje.

Podmínka:

```javascript
!sounds[name].isPlaying()
```

zabraňuje některým nežádoucím překryvům.

U krátkých efektů ale někdy chceme povolit opakované přehrání. Potom můžeme použít jednodušší verzi:

```javascript
function playSound(name) {
  if (sounds[name]) {
    sounds[name].play();
  }
}
```

---

# 45. Zvuk podle typu kolize

Ve druhé lekci metoda `collide()` přímo měnila skóre.

Abychom mohli přehrát správný zvuk, můžeme metodu upravit tak, aby vracela podrobnější výsledek.

Místo:

```javascript
true
false
```

může vracet:

```text
"snowflake"
"raindrop"
"soot"
null
```

---

# 46. Upravená metoda `collide()`

```javascript
collide(object) {
  let collision =
    collideRectCircle(
      this.x,
      this.y,
      this.size,
      this.size,
      object.x,
      object.y,
      object.size
    );

  if (!collision) {
    return null;
  }

  if (
    object instanceof Snowflake
  ) {
    this.score += 2;
    return "snowflake";
  }

  if (
    object instanceof Raindrop
  ) {
    this.score += 1;
    return "raindrop";
  }

  if (
    object instanceof Soot
  ) {
    this.score -= 3;
    return "soot";
  }

  return null;
}
```

Návratová hodnota nyní obsahuje informaci o typu kolize.

---

# 47. Zpracování výsledku kolize

Ve funkci `updateObjects()`:

```javascript
let collisionType =
  player.collide(object);

if (collisionType !== null) {
  if (collisionType === "soot") {
    playSound("hit");
  } else {
    playSound("collect");
  }

  objects.splice(i, 1);
  continue;
}
```

Tím oddělujeme:

* změnu skóre ve třídě hráče,
* zvukovou reakci v hlavním programu.

---

# 48. Čistší varianta: výsledek jako objekt

Metoda může vracet objekt:

```javascript
return {
  collided: true,
  type: "snowflake",
  points: 2
};
```

Při žádné kolizi:

```javascript
return {
  collided: false,
  type: null,
  points: 0
};
```

Použití:

```javascript
let result =
  player.collide(object);

if (result.collided) {
  console.log(result.type);
  console.log(result.points);
}
```

Tato varianta je pružnější, ale pro základní lekci je návrat textového řetězce jednodušší.

---

# 49. Zvuk konce hry

```javascript
function endGame() {
  gameState = STATE_END;

  playSound("end");
}
```

Je důležité, aby se `endGame()` zavolala jen jednou.

Proto ji voláme při přechodu ze stavu `PLAYING` do `END`.

Ve stavu `END` už se `updateGame()` nespouští.

---

# 50. Omezení hlasitosti

Po načtení můžeme nastavit hlasitost:

```javascript
sounds["collect"].setVolume(0.4);
sounds["hit"].setVolume(0.5);
sounds["start"].setVolume(0.5);
sounds["end"].setVolume(0.6);
```

Hodnoty jsou obvykle v rozsahu:

```text
0.0 až 1.0
```

---

# 51. Zapnutí a vypnutí zvuku

Přidáme:

```javascript
let soundEnabled = true;
```

Funkci upravíme:

```javascript
function playSound(name) {
  if (
    soundEnabled &&
    sounds[name]
  ) {
    sounds[name].play();
  }
}
```

V `keyPressed()`:

```javascript
if (
  key === "m" ||
  key === "M"
) {
  soundEnabled =
    !soundEnabled;

  return;
}
```

Výraz:

```javascript
soundEnabled = !soundEnabled;
```

přepne hodnotu:

```text
true → false
false → true
```

---

# 52. Zobrazení stavu zvuku

V HUD:

```javascript
let soundText =
  soundEnabled
    ? "Zvuk: zapnutý"
    : "Zvuk: vypnutý";
```

Použili jsme ternární operátor:

```javascript
podmínka ? hodnotaAno : hodnotaNe
```

Celý zápis:

```javascript
text(
  soundEnabled
    ? "Zvuk: zapnutý"
    : "Zvuk: vypnutý",
  25,
  75
);
```

---

# 53. První komplexní `keyPressed()`

```javascript
function keyPressed() {
  if (
    key === "m" ||
    key === "M"
  ) {
    soundEnabled =
      !soundEnabled;

    return;
  }

  if (
    gameState === STATE_START &&
    keyCode === ENTER
  ) {
    startGame();
    return;
  }

  if (
    gameState === STATE_PLAYING &&
    (key === "h" || key === "H")
  ) {
    openHelp();
    return;
  }

  if (
    gameState === STATE_HELP &&
    (key === "h" || key === "H")
  ) {
    closeHelp();
    return;
  }

  if (
    gameState === STATE_END &&
    keyCode === ENTER
  ) {
    startGame();
    return;
  }

  if (
    gameState === STATE_END &&
    keyCode === ESCAPE
  ) {
    gameState = STATE_START;
    return false;
  }
}
```

Událost nyní reaguje různě podle aktuálního stavu.

Stejná klávesa může mít v různých stavech jiný význam.

---

# 54. Proč záleží na pořadí podmínek

Podmínky se vyhodnocují postupně shora dolů.

Po úspěšném zpracování používáme:

```javascript
return;
```

Tím zabráníme tomu, aby jeden stisk klávesy provedl více akcí.

Například `ENTER` na koncové obrazovce spustí novou hru a už se nebude testovat další část funkce.

---

# 55. Aktualizovaná struktura programu

Hlavní části `sketch.js` budou:

```text
1. konstanty
2. globální proměnné
3. preload()
4. setup()
5. draw()
6. herní stavy
7. aktualizace hry
8. vykreslení hry
9. uživatelské rozhraní
10. tvorba objektů
11. zvuk
12. události klávesnice
```

Takové členění je podstatně přehlednější než jedna velmi dlouhá funkce `draw()`.

---

# 56. Výsledné konstanty a proměnné

```javascript
const STATE_START = "start";
const STATE_PLAYING = "playing";
const STATE_HELP = "help";
const STATE_END = "end";

const GAME_DURATION = 60;
const OBJECT_INTERVAL = 30;

let gameState = STATE_START;

let objects = [];
let images = {};
let sounds = {};

let player;

let startTime = 0;
let elapsedTime = 0;
let remainingTime = GAME_DURATION;

let pauseStartTime = 0;

let soundEnabled = true;
let highScore = 0;
```

---

# 57. Výsledná funkce `preload()`

```javascript
function preload() {
  images["flake"] =
    loadImage(
      "./images/snowflake.svg"
    );

  images["drop"] =
    loadImage(
      "./images/raindrop.svg"
    );

  images["soot"] =
    loadImage(
      "./images/soot.svg"
    );

  images["background"] =
    loadImage(
      "./images/christmas.jpg"
    );

  images["player"] =
    loadImage(
      "./images/snowman.png"
    );

  sounds["collect"] =
    loadSound(
      "./sounds/collect.mp3"
    );

  sounds["hit"] =
    loadSound(
      "./sounds/hit.mp3"
    );

  sounds["start"] =
    loadSound(
      "./sounds/start.mp3"
    );

  sounds["end"] =
    loadSound(
      "./sounds/end.mp3"
    );
}
```

---

# 58. Výsledná funkce `setup()`

```javascript
function setup() {
  createCanvas(800, 600);

  imageMode(CENTER);
  rectMode(CORNER);

  player = new Player(
    width / 2 - 25,
    height - 70,
    50,
    images["player"]
  );

  let savedScore =
    getItem("winterHighScore");

  if (savedScore !== null) {
    highScore = savedScore;
  }

  sounds["collect"].setVolume(0.4);
  sounds["hit"].setVolume(0.5);
  sounds["start"].setVolume(0.5);
  sounds["end"].setVolume(0.6);
}
```

---

# 59. Výsledná funkce `draw()`

```javascript
function draw() {
  if (gameState === STATE_START) {
    drawStartScreen();
  } else if (
    gameState === STATE_PLAYING
  ) {
    updateGame();
    drawGame();
  } else if (
    gameState === STATE_HELP
  ) {
    drawGame();
    drawHelp();
  } else if (
    gameState === STATE_END
  ) {
    drawEndScreen();
  }
}
```

---

# 60. Výsledná aktualizace hry

```javascript
function updateGame() {
  updateTimer();

  if (remainingTime <= 0) {
    endGame();
    return;
  }

  updatePlayer();
  updateObjects();
}
```

---

# 61. Aktualizace času

```javascript
function updateTimer() {
  elapsedTime =
    millis() - startTime;

  remainingTime = max(
    0,
    GAME_DURATION -
      elapsedTime / 1000
  );
}
```

---

# 62. Aktualizace hráče

```javascript
function updatePlayer() {
  if (keyIsDown(LEFT_ARROW)) {
    player.update("left");
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.update("right");
  }
}
```

---

# 63. Aktualizace objektů

```javascript
function updateObjects() {
  if (
    frameCount %
      OBJECT_INTERVAL ===
    0
  ) {
    createObject();
  }

  for (
    let i = objects.length - 1;
    i >= 0;
    i--
  ) {
    let object = objects[i];

    object.update();

    let collisionType =
      player.collide(object);

    if (collisionType !== null) {
      if (collisionType === "soot") {
        playSound("hit");
      } else {
        playSound("collect");
      }

      objects.splice(i, 1);
      continue;
    }

    if (
      object.y >
      height + object.size
    ) {
      objects.splice(i, 1);
    }
  }
}
```

---

# 64. Výsledná herní scéna

```javascript
function drawGame() {
  drawBackground();
  drawObjects();
  player.draw();
  drawHUD();
}
```

---

# 65. Vykreslení pozadí

```javascript
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
```

---

# 66. Vykreslení objektů

```javascript
function drawObjects() {
  for (let object of objects) {
    object.draw();
  }
}
```

---

# 67. Výsledný HUD

```javascript
function drawHUD() {
  push();

  fill(0, 170);
  noStroke();

  rect(
    12,
    12,
    235,
    110,
    12
  );

  textAlign(LEFT, TOP);
  textSize(18);

  fill(255);
  text(
    "Skóre: " + player.score,
    28,
    25
  );

  fill(getTimeColor());
  text(
    "Čas: " +
      remainingTime.toFixed(1) +
      " s",
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

  text(
    "H – nápověda",
    28,
    102
  );

  pop();
}
```

---

# 68. Barva časového údaje

```javascript
function getTimeColor() {
  if (remainingTime <= 5) {
    return color(255, 70, 70);
  }

  if (remainingTime <= 15) {
    return color(255, 190, 70);
  }

  return color(255);
}
```

---

# 69. Zahájení hry

```javascript
function startGame() {
  objects = [];

  player.score = 0;

  player.x =
    width / 2 -
    player.size / 2;

  player.y =
    height -
    player.size -
    20;

  startTime = millis();
  elapsedTime = 0;
  remainingTime = GAME_DURATION;

  gameState = STATE_PLAYING;

  playSound("start");
}
```

---

# 70. Ukončení hry

```javascript
function endGame() {
  if (player.score > highScore) {
    highScore = player.score;

    storeItem(
      "winterHighScore",
      highScore
    );
  }

  gameState = STATE_END;

  playSound("end");
}
```

---

# 71. Otevření nápovědy

```javascript
function openHelp() {
  pauseStartTime = millis();

  gameState = STATE_HELP;
}
```

---

# 72. Zavření nápovědy

```javascript
function closeHelp() {
  let pauseDuration =
    millis() - pauseStartTime;

  startTime += pauseDuration;

  gameState = STATE_PLAYING;
}
```

---

# 73. Zvuková funkce

```javascript
function playSound(name) {
  if (
    soundEnabled &&
    sounds[name]
  ) {
    sounds[name].play();
  }
}
```

---

# 74. Úvodní obrazovka

```javascript
function drawStartScreen() {
  drawBackground();

  fill(0, 185);
  noStroke();

  rect(
    60,
    45,
    width - 120,
    height - 90,
    22
  );

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(42);
  text(
    "Winter Is Coming!",
    width / 2,
    95
  );

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
  text(
    "Stiskni ENTER",
    width / 2,
    505
  );

  textSize(15);
  text(
    "Nejvyšší skóre: " +
      highScore,
    width / 2,
    545
  );
}
```

---

# 75. Položka pravidel

```javascript
function drawRuleItem(
  x,
  y,
  itemColor,
  label,
  points
) {
  push();

  fill(itemColor);
  stroke(255);
  strokeWeight(1);

  circle(
    x - 120,
    y,
    32
  );

  fill(255);
  noStroke();

  textAlign(LEFT, CENTER);
  textSize(18);

  text(
    label,
    x - 85,
    y
  );

  text(
    points,
    x + 65,
    y
  );

  pop();
}
```

---

# 76. Obrazovka nápovědy

```javascript
function drawHelp() {
  push();

  fill(0, 220);
  noStroke();

  rect(
    80,
    70,
    width - 160,
    height - 140,
    22
  );

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(34);
  text(
    "Nápověda",
    width / 2,
    125
  );

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
```

---

# 77. Závěrečná obrazovka

```javascript
function drawEndScreen() {
  drawBackground();

  fill(0, 210);
  noStroke();

  rect(
    0,
    0,
    width,
    height
  );

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(44);
  text(
    "Konec hry",
    width / 2,
    120
  );

  textSize(30);
  text(
    "Skóre: " + player.score,
    width / 2,
    230
  );

  textSize(22);
  text(
    "Nejvyšší skóre: " +
      highScore,
    width / 2,
    285
  );

  textSize(20);
  text(
    "ENTER – nová hra",
    width / 2,
    390
  );

  text(
    "ESC – hlavní nabídka",
    width / 2,
    430
  );

  text(
    "M – zvuk",
    width / 2,
    470
  );
}
```

---

# 78. Výsledná událost klávesnice

```javascript
function keyPressed() {
  if (
    key === "m" ||
    key === "M"
  ) {
    soundEnabled =
      !soundEnabled;

    return;
  }

  if (
    gameState === STATE_START &&
    keyCode === ENTER
  ) {
    startGame();
    return;
  }

  if (
    gameState === STATE_PLAYING &&
    (key === "h" || key === "H")
  ) {
    openHelp();
    return;
  }

  if (
    gameState === STATE_HELP &&
    (key === "h" || key === "H")
  ) {
    closeHelp();
    return;
  }

  if (
    gameState === STATE_END &&
    keyCode === ENTER
  ) {
    startGame();
    return;
  }

  if (
    gameState === STATE_END &&
    keyCode === ESCAPE
  ) {
    gameState = STATE_START;
    return false;
  }
}
```

---

# 79. Upravená metoda `Player.collide()`

```javascript
collide(object) {
  let collision =
    collideRectCircle(
      this.x,
      this.y,
      this.size,
      this.size,
      object.x,
      object.y,
      object.size
    );

  if (!collision) {
    return null;
  }

  if (
    object instanceof Snowflake
  ) {
    this.score += 2;
    return "snowflake";
  }

  if (
    object instanceof Raindrop
  ) {
    this.score += 1;
    return "raindrop";
  }

  if (
    object instanceof Soot
  ) {
    this.score -= 3;
    return "soot";
  }

  return null;
}
```

---

# 80. Co jsme se naučili

## Herní stav

Proměnná:

```javascript
gameState
```

určuje, která část aplikace je aktivní.

## Stavový automat

Program přechází mezi stavy:

```text
START → PLAYING → END
          ↓
         HELP
```

## Oddělení aktualizace a vykreslování

```javascript
updateGame()
drawGame()
```

mají odlišné odpovědnosti.

## Měření času

```javascript
millis()
```

vrací počet milisekund od spuštění aplikace.

## Časový limit

Zbývající čas počítáme:

```javascript
GAME_DURATION -
elapsedTime / 1000
```

## Uživatelské rozhraní

Samostatné funkce vykreslují:

```javascript
drawStartScreen()
drawHUD()
drawHelp()
drawEndScreen()
```

## Restart hry

Funkce:

```javascript
startGame()
```

obnoví celý herní stav.

## Zvuky

Pomocí:

```javascript
loadSound()
play()
setVolume()
```

přidáváme zvukovou odezvu.

## Lokální úložiště

```javascript
storeItem()
getItem()
```

umožňuje zachovat rekord mezi spuštěními.

---

# 81. Kontrolní otázky

1. Co představuje herní stav?
2. Proč je vhodné použít konstanty `STATE_START`, `STATE_PLAYING` a `STATE_END`?
3. Jakou úlohu má funkce `draw()` po zavedení stavů?
4. Jaký je rozdíl mezi `updateGame()` a `drawGame()`?
5. Proč na úvodní obrazovce nevoláme `updateGame()`?
6. Co vrací funkce `millis()`?
7. Proč dělíme hodnotu `elapsedTime` číslem 1000?
8. Jak vypočítáme zbývající čas?
9. Proč místo `noLoop()` používáme stav `STATE_END`?
10. Co musí obnovit funkce `startGame()`?
11. Proč při restartu vyprázdníme pole `objects`?
12. Co je HUD?
13. K čemu slouží funkce `getTimeColor()`?
14. Jak funguje nápověda jako herní stav?
15. Proč při pauze posouváme hodnotu `startTime`?
16. Jak se určuje vítěz při hře dvou hráčů?
17. K čemu slouží `loadSound()`?
18. Proč může prohlížeč před první interakcí blokovat zvuk?
19. Co dělá výraz `soundEnabled = !soundEnabled`?
20. Jak se liší `true`, `false`, `null` a textový návratový výsledek?
21. Proč metoda `collide()` nově vrací typ kolize?
22. Co dělá ternární operátor?
23. K čemu slouží `storeItem()`?
24. Proč je vhodné rozdělit UI do samostatných funkcí?
25. Jaké další herní stavy by bylo možné přidat?

---

# 82. Praktické úkoly

## Úkol 1: Kratší hra

Změňte:

```javascript
const GAME_DURATION = 60;
```

na:

```javascript
const GAME_DURATION = 20;
```

Ověřte, zda se hra správně ukončí.

## Úkol 2: Odpočítávání celých sekund

Zobrazujte čas jako celé číslo.

Nápověda:

```javascript
ceil(remainingTime)
```

## Úkol 3: Vlastní barevné hranice

Nastavte:

* bílou barvu nad 20 sekund,
* oranžovou mezi 10 a 20 sekundami,
* červenou pod 10 sekund.

## Úkol 4: Stav pauzy

Přidejte stav:

```javascript
const STATE_PAUSED = "paused";
```

Hru pozastavujte klávesou `P`.

## Úkol 5: Odpočet před začátkem

Přidejte stav:

```javascript
const STATE_COUNTDOWN =
  "countdown";
```

Před hrou zobrazte:

```text
3
2
1
START
```

## Úkol 6: Tlačítko místo klávesy

Použijte p5.js DOM funkci:

```javascript
createButton()
```

Vytvořte tlačítko „Spustit hru“.

## Úkol 7: Samostatné ovládání hlasitosti

Přidejte klávesy:

```text
+  zvýšení hlasitosti
-  snížení hlasitosti
```

## Úkol 8: Varovný zvuk

Při zbývajícím čase kratším než pět sekund přehrajte krátké pípnutí každou sekundu.

## Úkol 9: Nový rekord

Na závěrečné obrazovce zobrazte text:

```text
NOVÝ REKORD!
```

pouze tehdy, když hráč překonal předchozí hodnotu.

## Úkol 10: Statistiky výsledku

Po skončení zobrazte:

* počet sebraných vloček,
* počet sebraných kapek,
* počet zásahů sazemi.

## Úkol 11: Obtížnost

Na úvodní obrazovce umožněte zvolit:

```text
Lehká
Střední
Těžká
```

Obtížnost může ovlivnit:

* interval vytváření objektů,
* rychlost pádu,
* délku hry,
* množství sazí.

## Úkol 12: Dva hráči

Přepracujte závěrečnou obrazovku tak, aby:

* zobrazila obě skóre,
* barevně rozlišila hráče,
* určila vítěze nebo remízu.

---

# 83. Rozšiřující návrh stavů

Komplexnější hra může obsahovat:

```javascript
const STATE_START =
  "start";

const STATE_COUNTDOWN =
  "countdown";

const STATE_PLAYING =
  "playing";

const STATE_PAUSED =
  "paused";

const STATE_HELP =
  "help";

const STATE_END =
  "end";
```

Možné přechody:

```text
START
  ↓
COUNTDOWN
  ↓
PLAYING ←→ PAUSED
  ↓         ↑
 HELP ──────┘
  ↓
 END
  ↓
START nebo PLAYING
```

Takový systém už připomíná architekturu běžné počítačové hry.

---

# 84. Shrnutí lekce

Na začátku třetí lekce jsme měli funkční herní mechaniku, která se po načtení okamžitě spustila.

Postupně jsme aplikaci rozšířili:

```text
okamžitě spuštěná hra
→ úvodní obrazovka
→ herní stavy
→ spuštění klávesou
→ měření času
→ časový limit
→ informační panel
→ rychlá nápověda
→ pozastavení času
→ konec hry
→ závěrečná obrazovka
→ restart
→ nejvyšší skóre
→ zvukové efekty
→ zapnutí a vypnutí zvuku
```

Nejdůležitější změnou není samotný vzhled obrazovek, ale organizace programu.

Místo jedné dlouhé funkce `draw()` máme několik jasně zaměřených částí:

```javascript
drawStartScreen()
updateGame()
drawGame()
drawHUD()
drawHelp()
drawEndScreen()
startGame()
endGame()
```

Hra se nyní chová jako ucelená aplikace:

1. představí pravidla,
2. čeká na uživatele,
3. spustí herní kolo,
4. měří čas,
5. zpracovává vstup a kolize,
6. poskytuje vizuální a zvukovou odezvu,
7. vyhodnotí výsledek,
8. umožní novou hru.

Tím jsme prošli cestu od jednoduchého vykreslení objektu v p5.js až k malé objektově orientované hře s vlastním uživatelským rozhraním.
