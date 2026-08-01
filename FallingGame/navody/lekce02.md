# Lekce 2: Hráč, ovládání, kolize a bodování

## Cíl lekce

V první lekci jsme vytvořili několik typů padajících objektů:

* vločky,
* kapky,
* saze.

Objekty vznikaly automaticky, pohybovaly se po canvasu a byly ukládány v jednom poli.

Nyní do hry přidáme hráče, který se bude pohybovat po spodní části canvasu. Jeho úkolem bude:

* sbírat vločky,
* sbírat kapky,
* vyhýbat se sazím,
* získávat a ztrácet body.

Při tvorbě se seznámíme s dalšími důležitými principy JavaScriptu a p5.js:

* další samostatnou třídou,
* ovládáním pomocí kláves,
* spojitým pohybem při držení klávesy,
* omezením pohybu na canvas,
* detekcí kolizí,
* externí knihovnou `p5.collide2d`,
* metodou, která vrací hodnotu,
* použitím `return`,
* operátorem `instanceof`,
* změnou skóre,
* odstraněním sebraného objektu z pole,
* klíčovým slovem `continue`,
* komunikací mezi objekty.

Na konci lekce bude existovat funkční základ hry pro jednoho hráče.

---

# 1. Výchozí stav aplikace

Po první lekci máme pole padajících objektů:

```javascript id="w9nqgi"
let objects = [];
```

Ve funkci `draw()` objekty aktualizujeme a vykreslujeme:

```javascript id="q31p0h"
for (
  let i = objects.length - 1;
  i >= 0;
  i--
) {
  let object = objects[i];

  object.update();
  object.draw();

  if (
    object.y >
    height + object.size
  ) {
    objects.splice(i, 1);
  }
}
```

Každý prvek pole může být instancí jiné třídy:

```javascript id="a21u94"
Snowflake
Raindrop
Soot
```

Všechny však používají společné metody:

```javascript id="v42dyr"
update()
draw()
```

Nyní potřebujeme přidat objekt, který nebude automaticky padat, ale bude ovládán uživatelem.

---

# 2. První statický hráč

Nejprve vytvoříme jednoduchý čtverec ve spodní části canvasu.

Do `sketch.js` přidáme proměnné:

```javascript id="m1cj7v"
let playerX = 375;
let playerY = 530;
let playerSize = 50;
```

Ve funkci `draw()`:

```javascript id="fq9g3e"
fill(80, 140, 240);

square(
  playerX,
  playerY,
  playerSize
);
```

Pro canvas o velikosti 800 × 600 bude hráč umístěn přibližně uprostřed spodní části.

Celá základní verze:

```javascript id="dupsvg"
let playerX = 375;
let playerY = 530;
let playerSize = 50;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(30, 50, 70);

  fill(80, 140, 240);

  square(
    playerX,
    playerY,
    playerSize
  );
}
```

Tento hráč zatím nemá žádné chování. Je pouze vykreslen.

---

# 3. Proč vytvořit další třídu

Stejně jako u padajících objektů nechceme mít vlastnosti hráče rozptýlené v různých proměnných.

Hráč bude mít:

* polohu,
* velikost,
* rychlost,
* barvu nebo obrázek,
* skóre,
* metodu pro pohyb,
* metodu pro kolize,
* metodu pro vykreslení.

Proto vytvoříme třídu:

```javascript id="pzp2gh"
class Player {
}
```

Třída `Player` nebude dědit z `FallingObject`.

Hráč totiž představuje jiný typ objektu:

* nepadá automaticky,
* ovládá jej uživatel,
* pohybuje se pouze vodorovně,
* obsahuje skóre,
* kontroluje kolize.

Třída tedy bude samostatná.

---

# 4. Základ třídy `Player`

Vytvoříme soubor:

```text id="kofur2"
Player.js
```

Do něj vložíme:

```javascript id="45hbtm"
class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.speed = 5;
  }

  draw() {
    fill(80, 140, 240);

    square(
      this.x,
      this.y,
      this.size
    );
  }
}
```

Konstruktor přijímá:

```javascript id="rzz2nh"
x
y
size
```

Další vlastnost nastavujeme uvnitř:

```javascript id="50tun4"
this.speed = 5;
```

Ta určuje rychlost pohybu hráče.

---

# 5. Vytvoření instance hráče

V `sketch.js` vytvoříme globální proměnnou:

```javascript id="9e38m6"
let player;
```

Ve funkci `setup()`:

```javascript id="ehwxga"
function setup() {
  createCanvas(800, 600);

  player = new Player(
    width / 2 - 25,
    height - 70,
    50
  );
}
```

Výraz:

```javascript id="jyuf9s"
width / 2 - 25
```

umístí levý okraj hráče tak, aby jeho střed ležel uprostřed canvasu.

Hráč má velikost 50 pixelů, proto odečítáme polovinu:

```text id="o3jo2q"
50 ÷ 2 = 25
```

Ve funkci `draw()` zavoláme:

```javascript id="vi9gr2"
player.draw();
```

---

# 6. Připojení souboru `Player.js`

V souboru `index.html` musíme přidat:

```html id="fc2n71"
<script src="./classes/Player.js"></script>
<script src="sketch.js"></script>
```

Třída musí být načtena před `sketch.js`, protože hlavní program ji používá při vytváření instance.

V přiloženém projektu je `Player.js` připojen za třídami padajících objektů a před hlavním `sketch.js`.

---

# 7. První pohyb hráče

Do třídy přidáme metodu:

```javascript id="b4choc"
moveRight() {
  this.x += this.speed;
}
```

Celá třída:

```javascript id="06lmet"
class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.speed = 5;
  }

  moveRight() {
    this.x += this.speed;
  }

  draw() {
    fill(80, 140, 240);

    square(
      this.x,
      this.y,
      this.size
    );
  }
}
```

Ve funkci `draw()`:

```javascript id="bcuv3k"
if (keyIsDown(RIGHT_ARROW)) {
  player.moveRight();
}
```

Funkce:

```javascript id="rbv5f6"
keyIsDown()
```

ověřuje, zda je určitá klávesa právě držena.

Na rozdíl od `keyPressed()` se může podmínka vyhodnocovat v každém snímku.

Proto je vhodná pro plynulý pohyb.

---

# 8. Pohyb doleva

Přidáme další metodu:

```javascript id="dcxk6u"
moveLeft() {
  this.x -= this.speed;
}
```

Ve funkci `draw()`:

```javascript id="jogeba"
if (keyIsDown(LEFT_ARROW)) {
  player.moveLeft();
}

if (keyIsDown(RIGHT_ARROW)) {
  player.moveRight();
}
```

Hráč se nyní může pohybovat oběma směry.

---

# 9. Jedna obecná metoda pohybu

Dvě samostatné metody fungují, ale část kódu se opakuje.

Můžeme je nahradit jednou metodou:

```javascript id="e3nctm"
update(direction) {
  if (direction === "left") {
    this.x -= this.speed;
  }

  if (direction === "right") {
    this.x += this.speed;
  }
}
```

Ve funkci `draw()`:

```javascript id="axqn0g"
if (keyIsDown(LEFT_ARROW)) {
  player.update("left");
}

if (keyIsDown(RIGHT_ARROW)) {
  player.update("right");
}
```

Parametr:

```javascript id="1h2wz6"
direction
```

obsahuje textový řetězec:

```text id="ftpr7p"
"left"
```

nebo:

```text id="pccgo7"
"right"
```

Stejný princip používá také přiložená třída `Player`.

---

# 10. Omezení pohybu na canvas

Současný hráč může opustit canvas.

Při pohybu doleva ověříme:

```javascript id="m2kf6r"
this.x > 0
```

Při pohybu doprava ověříme:

```javascript id="oqf3k8"
this.x < width - this.size
```

Upravená metoda:

```javascript id="lw4nm1"
update(direction) {
  if (
    direction === "left" &&
    this.x > 0
  ) {
    this.x -= this.speed;
  }

  if (
    direction === "right" &&
    this.x < width - this.size
  ) {
    this.x += this.speed;
  }
}
```

Proč používáme:

```javascript id="f6rc9x"
width - this.size
```

Souřadnice `this.x` označuje levý okraj hráče.

Jeho pravý okraj se nachází v bodě:

```javascript id="u048jx"
this.x + this.size
```

Aby pravý okraj nepřekročil canvas, musí platit:

```javascript id="9x94p6"
this.x + this.size <= width
```

Po úpravě:

```javascript id="4hp2na"
this.x <= width - this.size
```

---

# 11. Alternativní omezení pomocí `constrain()`

Stejný problém lze řešit funkcí:

```javascript id="x4h5w9"
constrain()
```

Metoda může vypadat:

```javascript id="9mdso9"
update(direction) {
  if (direction === "left") {
    this.x -= this.speed;
  }

  if (direction === "right") {
    this.x += this.speed;
  }

  this.x = constrain(
    this.x,
    0,
    width - this.size
  );
}
```

Tento zápis je kratší a navazuje na předchozí lekci, v níž jsme `constrain()` používali pro omezení velikosti čtverce.

---

# 12. Přidání skóre

Do konstruktoru přidáme:

```javascript id="9ef0s4"
this.score = 0;
```

Třída:

```javascript id="5shgkp"
class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.speed = 5;
    this.score = 0;
  }
}
```

Skóre je vlastností instance.

Každý hráč by tedy mohl mít vlastní hodnotu.

---

# 13. Zobrazení skóre

Do metody `draw()` přidáme text:

```javascript id="ybj89f"
fill(255);

text(
  "Skóre: " + this.score,
  this.x,
  this.y + this.size + 20
);
```

Celá metoda:

```javascript id="91n5i5"
draw() {
  fill(80, 140, 240);

  square(
    this.x,
    this.y,
    this.size
  );

  fill(255);
  noStroke();
  textSize(16);

  text(
    "Skóre: " + this.score,
    this.x,
    this.y + this.size + 20
  );
}
```

Text se vykreslí pod hráčem.

Přiložená třída `Player` používá stejný princip a vypisuje skóre přímo v metodě `draw()`.

---

# 14. Přidání obrázku hráče

Třídu rozšíříme o parametr:

```javascript id="pr3jc5"
img
```

Konstruktor:

```javascript id="13hh7f"
constructor(x, y, size, img) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.img = img;

  this.speed = 5;
  this.score = 0;
}
```

Ve funkci `preload()` načteme obrázek:

```javascript id="rr8h02"
images["player"] =
  loadImage(
    "./images/snowman.png"
  );
```

Při vytvoření hráče:

```javascript id="n7u7jn"
player = new Player(
  width / 2 - 25,
  height - 70,
  50,
  images["player"]
);
```

---

# 15. Souřadnice hráče a obrázku

V této lekci budeme hráče reprezentovat obdélníkem, jehož souřadnice označují levý horní roh.

Proto budeme používat:

```javascript id="4d3qs9"
rectMode(CORNER);
```

Obrázek jsme ale v první lekci vykreslovali v režimu:

```javascript id="7w0xtp"
imageMode(CENTER);
```

Obrázek hráče proto musíme posunout do středu jeho obdélníku:

```javascript id="acsssi"
image(
  this.img,
  this.x + this.size / 2,
  this.y + this.size / 2,
  this.size,
  this.size
);
```

Stejný výpočet se nachází v přiložené třídě `Player`.

---

# 16. Výsledné vykreslení hráče

```javascript id="k87mr7"
draw() {
  push();

  rectMode(CORNER);

  fill(80, 140, 240);
  noStroke();

  square(
    this.x,
    this.y,
    this.size
  );

  image(
    this.img,
    this.x + this.size / 2,
    this.y + this.size / 2,
    this.size,
    this.size
  );

  fill(255);
  textSize(16);

  text(
    "Skóre: " + this.score,
    this.x,
    this.y + this.size + 20
  );

  pop();
}
```

Použití `push()` a `pop()` zabrání tomu, aby změna `rectMode()` nebo barev ovlivnila jiné objekty.

---

# 17. Co je kolize

Kolize znamená, že se dva objekty dotýkají nebo překrývají.

V naší hře potřebujeme zjistit, zda se hráč dotýká padajícího objektu.

Hráč je přibližně obdélník.

Padající objekt je přibližně kruh.

Potřebujeme tedy test:

```text id="mbcyi7"
obdélník × kruh
```

Přesný výpočet bychom mohli naprogramovat sami, ale v této lekci využijeme knihovnu `p5.collide2d`.

---

# 18. Připojení knihovny `p5.collide2d`

Do `index.html` přidáme:

```html id="pw9b7k"
<script
  defer
  src="https://unpkg.com/p5.collide2d">
</script>
```

Knihovna přidává funkce pro různé typy kolizí:

```javascript id="nz65qp"
collideCircleCircle()
collideRectRect()
collideRectCircle()
collidePointCircle()
```

V přiloženém projektu je knihovna připojena společně s p5.js a p5.sound.

Je důležité vědět, že:

```javascript id="3zsqfo"
collideRectCircle()
```

není základní funkcí p5.js.

Pochází z externí knihovny.

---

# 19. Jednoduchá metoda pro kontrolu kolize

Do třídy `Player` přidáme:

```javascript id="8u28qs"
collide(object) {
  return collideRectCircle(
    this.x,
    this.y,
    this.size,
    this.size,
    object.x,
    object.y,
    object.size
  );
}
```

Parametry funkce jsou:

```javascript id="lq7pcq"
collideRectCircle(
  rectX,
  rectY,
  rectWidth,
  rectHeight,
  circleX,
  circleY,
  circleDiameter
)
```

Pro hráče používáme:

```javascript id="cfmcr9"
this.x
this.y
this.size
this.size
```

Pro padající objekt:

```javascript id="xdrnxj"
object.x
object.y
object.size
```

---

# 20. Metoda vracející hodnotu

Metoda `collide()` vrací logickou hodnotu:

```text id="lru27a"
true
```

pokud kolize nastala,

nebo:

```text id="ndjx3q"
false
```

pokud objekty nekolidují.

Příkaz:

```javascript id="e9kylg"
return
```

vrátí výsledek z metody do místa, kde byla metoda zavolána.

Použití:

```javascript id="y1admx"
if (player.collide(object)) {
  // kolize nastala
}
```

---

# 21. První reakce na kolizi

V hlavní smyčce objektů doplníme:

```javascript id="kqk0rb"
if (player.collide(object)) {
  objects.splice(i, 1);
  continue;
}
```

Celý cyklus:

```javascript id="55olxs"
for (
  let i = objects.length - 1;
  i >= 0;
  i--
) {
  let object = objects[i];

  if (player.collide(object)) {
    objects.splice(i, 1);
    continue;
  }

  object.update();
  object.draw();

  if (
    object.y >
    height + object.size
  ) {
    objects.splice(i, 1);
  }
}
```

Při kolizi se objekt odstraní z pole.

---

# 22. Proč používáme `continue`

Po odstranění objektu:

```javascript id="26hbm7"
objects.splice(i, 1);
```

už nechceme provádět:

```javascript id="svl09v"
object.update();
object.draw();
```

Klíčové slovo:

```javascript id="valrwc"
continue;
```

ukončí aktuální průchod cyklu a pokračuje další iterací.

Bez něj bychom dále pracovali s objektem, který jsme právě odstranili z pole.

---

# 23. Bodování podle typu objektu

Nyní chceme odlišit:

* vločku,
* kapku,
* sazi.

Použijeme:

```javascript id="go0rif"
instanceof
```

Například:

```javascript id="oa2vei"
object instanceof Snowflake
```

ověří, zda je objekt instancí třídy `Snowflake`.

---

# 24. První pravidla bodování

Podle navržených pravidel hry:

```text id="dgaejy"
vločka → +2 body
kapka  → +1 bod
saze   → -3 body
```

Metodu `collide()` upravíme:

```javascript id="8vejvd"
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
    return false;
  }

  if (
    object instanceof Snowflake
  ) {
    this.score += 2;
  } else if (
    object instanceof Raindrop
  ) {
    this.score += 1;
  } else if (
    object instanceof Soot
  ) {
    this.score -= 3;
  }

  return true;
}
```

---

# 25. Význam `!collision`

Operátor:

```javascript id="vff3y8"
!
```

znamená logickou negaci.

Pokud je:

```javascript id="v7m8dr"
collision === false
```

potom:

```javascript id="pkc4vo"
!collision === true
```

Řádek:

```javascript id="nknc3s"
if (!collision) {
  return false;
}
```

tedy znamená:

> Pokud kolize nenastala, okamžitě vrať `false` a dál metodu neprováděj.

Tento způsob snižuje množství vnořených podmínek.

---

# 26. Varianta bodování podle velikosti

Přiložená hra mění skóre podle velikosti objektu:

```javascript id="ea243d"
this.score += round(object.size);
```

nebo:

```javascript id="331gr0"
this.score -= round(object.size);
```

Funkce:

```javascript id="8zkcsk"
round()
```

zaokrouhlí číslo na nejbližší celé číslo.

Takové bodování znamená, že větší objekty mají větší bodovou hodnotu.

V přiložené třídě `Player` dávají vločky kladné body, zatímco kapky i saze body odečítají.

Pro náš kurz ale používáme pravidlo:

```text id="j5p0l8"
vločky a kapky jsou žádoucí
saze jsou nežádoucí
```

Proto odpovídající větev nastavíme jinak.

---

# 27. Pevné body nebo body podle velikosti

Existují dvě rozumné možnosti.

## Varianta A: pevné body

```javascript id="1714hk"
Snowflake → +2
Raindrop  → +1
Soot      → -3
```

Výhody:

* pravidla jsou snadno zapamatovatelná,
* hra je předvídatelná,
* kód je jednodušší.

## Varianta B: body podle velikosti

```javascript id="g6dy2c"
Snowflake → +round(size)
Raindrop  → +round(size / 2)
Soot      → -round(size)
```

Výhody:

* velikost objektu má herní význam,
* velké objekty jsou hodnotnější,
* bodování je proměnlivější.

Pro základní verzi použijeme pevné body.

---

# 28. Výsledná metoda `collide()`

```javascript id="2i6zav"
collide(object) {
  if (
    collideRectCircle(
      this.x,
      this.y,
      this.size,
      this.size,
      object.x,
      object.y,
      object.size
    )
  ) {
    if (
      object instanceof Snowflake
    ) {
      this.score += 2;
    } else if (
      object instanceof Raindrop
    ) {
      this.score += 1;
    } else if (
      object instanceof Soot
    ) {
      this.score -= 3;
    }

    return true;
  }

  return false;
}
```

Metoda má dvě úlohy:

1. zjistit kolizi,
2. změnit skóre podle typu objektu.

Nakonec vrací informaci, zda má být objekt odstraněn z pole.

---

# 29. Komunikace mezi objekty

Volání:

```javascript id="jnajsg"
player.collide(object)
```

předává padající objekt metodě hráče.

Hráč následně čte jeho vlastnosti:

```javascript id="x0u7ae"
object.x
object.y
object.size
```

a zjišťuje jeho typ:

```javascript id="wqy2o8"
object instanceof Snowflake
```

Jeden objekt tedy pracuje s jiným objektem.

To je důležitý krok od izolovaných tříd k objektovému systému.

---

# 30. Kompletní první verze třídy `Player`

```javascript id="xg2lpc"
class Player {
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.img = img;

    this.speed = 5;
    this.score = 0;

    this.color =
      color(80, 140, 240);
  }

  update(direction) {
    if (
      direction === "left"
    ) {
      this.x -= this.speed;
    }

    if (
      direction === "right"
    ) {
      this.x += this.speed;
    }

    this.x = constrain(
      this.x,
      0,
      width - this.size
    );
  }

  collide(object) {
    if (
      collideRectCircle(
        this.x,
        this.y,
        this.size,
        this.size,
        object.x,
        object.y,
        object.size
      )
    ) {
      if (
        object instanceof Snowflake
      ) {
        this.score += 2;
      } else if (
        object instanceof Raindrop
      ) {
        this.score += 1;
      } else if (
        object instanceof Soot
      ) {
        this.score -= 3;
      }

      return true;
    }

    return false;
  }

  draw() {
    push();

    rectMode(CORNER);

    fill(this.color);
    noStroke();

    square(
      this.x,
      this.y,
      this.size
    );

    image(
      this.img,
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size,
      this.size
    );

    fill(255);
    textSize(16);

    text(
      "Skóre: " + this.score,
      this.x,
      this.y + this.size + 20
    );

    pop();
  }
}
```

---

# 31. Přidání hráče do `sketch.js`

Na začátek:

```javascript id="kbu9vg"
let objects = [];
let images = {};

let player;
```

Ve funkci `preload()`:

```javascript id="rxcb8u"
images["player"] =
  loadImage(
    "./images/snowman.png"
  );
```

Ve funkci `setup()`:

```javascript id="hw9mkj"
function setup() {
  createCanvas(800, 600);

  imageMode(CENTER);

  player = new Player(
    width / 2 - 25,
    height - 70,
    50,
    images["player"]
  );
}
```

---

# 32. Ovládání v `draw()`

Na začátku funkce `draw()`:

```javascript id="6jtydt"
if (keyIsDown(LEFT_ARROW)) {
  player.update("left");
}

if (keyIsDown(RIGHT_ARROW)) {
  player.update("right");
}
```

Hráče vykreslíme až po padajících objektech:

```javascript id="6g8jw7"
player.draw();
```

Tím se hráč zobrazí před nimi.

---

# 33. Upravená hlavní smyčka

```javascript id="0shk0j"
for (
  let i = objects.length - 1;
  i >= 0;
  i--
) {
  let object = objects[i];

  if (player.collide(object)) {
    objects.splice(i, 1);
    continue;
  }

  object.update();
  object.draw();

  if (
    object.y >
    height + object.size
  ) {
    objects.splice(i, 1);
  }
}
```

Pořadí operací je zde důležité.

Nejprve kontrolujeme kolizi s aktuální polohou objektu.

Potom objekt aktualizujeme a vykreslíme.

Alternativně lze objekt nejprve aktualizovat a potom testovat kolizi. To bývá přesnější, protože kolize odpovídá aktuálně vykreslené poloze:

```javascript id="9etzx0"
object.update();

if (player.collide(object)) {
  objects.splice(i, 1);
  continue;
}

object.draw();
```

Tuto variantu použijeme ve výsledném programu.

---

# 34. Pořadí aktualizace, kolize a vykreslení

Doporučené pořadí:

```text id="l5538p"
1. aktualizace polohy
2. kontrola kolize
3. vykreslení
4. kontrola opuštění canvasu
```

V kódu:

```javascript id="5vxkv2"
object.update();

if (player.collide(object)) {
  objects.splice(i, 1);
  continue;
}

object.draw();

if (
  object.y >
  height + object.size
) {
  objects.splice(i, 1);
}
```

Tím se kolize počítá z nové pozice objektu.

---

# 35. Jednoduché vizuální zvýraznění kolize

Kolize může být pro hráče málo nápadná.

Do konstruktoru hráče můžeme přidat:

```javascript id="b5jl2h"
this.hitTimer = 0;
```

Při kolizi:

```javascript id="a1tb08"
this.hitTimer = 10;
```

V metodě `draw()`:

```javascript id="2brq45"
if (this.hitTimer > 0) {
  stroke(255, 255, 0);
  strokeWeight(4);

  this.hitTimer--;
} else {
  noStroke();
}
```

Hráč bude po kolizi krátce žlutě zvýrazněn.

Tento krok je volitelný, ale připravuje aplikaci na pozdější zvukové a grafické efekty.

---

# 36. Barva podle poslední kolize

Můžeme zavést vlastnost:

```javascript id="e0klcb"
this.feedbackColor =
  this.color;
```

Při sběru vločky:

```javascript id="gkbt85"
this.feedbackColor =
  color(180, 240, 255);
```

Při sběru kapky:

```javascript id="5xrufe"
this.feedbackColor =
  color(80, 170, 255);
```

Při zásahu sazemi:

```javascript id="21ukyn"
this.feedbackColor =
  color(60);
```

To je vhodné jako rozšiřující úloha, ne jako povinná součást základní verze.

---

# 37. Proč zatím používáme jednoho hráče

Přiložený projekt obsahuje dva hráče:

```javascript id="a7lm35"
let player1;
let player2;
```

První používá šipky a druhý klávesy `A` a `D`.

Pro první pochopení je však vhodnější:

* jedna instance hráče,
* jedna sada kláves,
* jedna hodnota skóre,
* jedna kontrola kolize.

Teprve po zvládnutí základního principu lze vytvořit druhého hráče.

---

# 38. Rozšíření: druhý hráč

Vytvoříme:

```javascript id="4a3xxr"
let player1;
let player2;
```

Ve funkci `setup()`:

```javascript id="ag752t"
player1 = new Player(
  2 * width / 3 - 25,
  height - 70,
  50,
  images["player"]
);

player2 = new Player(
  width / 3 - 25,
  height - 70,
  50,
  images["player"]
);
```

Nastavíme odlišné barvy:

```javascript id="8p0hqg"
player1.color =
  color(255, 80, 80);

player2.color =
  color(80, 100, 255);
```

---

# 39. Ovládání druhého hráče

První hráč:

```javascript id="0zqa0z"
if (keyIsDown(LEFT_ARROW)) {
  player1.update("left");
}

if (keyIsDown(RIGHT_ARROW)) {
  player1.update("right");
}
```

Druhý hráč:

```javascript id="4r1cq3"
if (keyIsDown(65)) {
  player2.update("left");
}

if (keyIsDown(68)) {
  player2.update("right");
}
```

Kódy:

```text id="unnwb6"
65 = A
68 = D
```

---

# 40. Kolize se dvěma hráči

V cyklu:

```javascript id="9l5bcg"
if (player1.collide(object)) {
  objects.splice(i, 1);
  continue;
}

if (player2.collide(object)) {
  objects.splice(i, 1);
  continue;
}
```

Objekt získá hráč, který se ho dotkne jako první.

Stejný princip používá přiložený `sketch.js`.

---

# 41. Problém současně držených kláves

Funkce `keyIsDown()` je pro dva hráče stále použitelná.

Přiložený projekt ale používá vlastní objekt:

```javascript id="5aclny"
let keys = {};
```

Při stisku:

```javascript id="d3u0b3"
function keyPressed() {
  keys[keyCode] = true;
}
```

Při uvolnění:

```javascript id="327fqd"
function keyReleased() {
  keys[keyCode] = false;
}
```

Ve funkci `draw()`:

```javascript id="otffx9"
if (keys[LEFT_ARROW]) {
  player1.update("left");
}
```

Objekt `keys` funguje jako tabulka stavů kláves:

```text id="vyu6gs"
keys[37] = true
keys[39] = false
keys[65] = true
```

Pro základní lekci však zůstaneme u `keyIsDown()`.

---

# 42. Výsledný soubor `Player.js`

```javascript id="1k2al1"
class Player {
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.img = img;

    this.speed = 5;
    this.score = 0;

    this.color =
      color(80, 140, 240);
  }

  update(direction) {
    if (direction === "left") {
      this.x -= this.speed;
    }

    if (direction === "right") {
      this.x += this.speed;
    }

    this.x = constrain(
      this.x,
      0,
      width - this.size
    );
  }

  collide(object) {
    if (
      collideRectCircle(
        this.x,
        this.y,
        this.size,
        this.size,
        object.x,
        object.y,
        object.size
      )
    ) {
      if (
        object instanceof Snowflake
      ) {
        this.score += 2;
      } else if (
        object instanceof Raindrop
      ) {
        this.score += 1;
      } else if (
        object instanceof Soot
      ) {
        this.score -= 3;
      }

      return true;
    }

    return false;
  }

  draw() {
    push();

    rectMode(CORNER);

    fill(this.color);
    noStroke();

    square(
      this.x,
      this.y,
      this.size
    );

    image(
      this.img,
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size,
      this.size
    );

    fill(255);
    textSize(16);

    text(
      "Skóre: " + this.score,
      this.x,
      this.y + this.size + 20
    );

    pop();
  }
}
```

---

# 43. Výsledný soubor `sketch.js`

```javascript id="2i3h1m"
let objects = [];
let images = {};

let player;


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

  images["player"] =
    loadImage(
      "./images/snowman.png"
    );
}


function setup() {
  createCanvas(800, 600);

  imageMode(CENTER);

  player = new Player(
    width / 2 - 25,
    height - 70,
    50,
    images["player"]
  );
}


function draw() {
  background(30, 50, 70);

  if (frameCount % 30 === 0) {
    createObject();
  }

  updatePlayer();

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

    object.draw();

    if (
      object.y >
      height + object.size
    ) {
      objects.splice(i, 1);
    }
  }

  player.draw();

  drawStatistics();
}


function updatePlayer() {
  if (keyIsDown(LEFT_ARROW)) {
    player.update("left");
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.update("right");
  }
}


function createObject() {
  let x = random(width);
  let y = random(-200, -20);
  let size = random(10, 40);

  let type =
    floor(random(3));

  switch (type) {
    case 0:
      objects.push(
        new Snowflake(
          x,
          y,
          size,
          images["flake"]
        )
      );
      break;

    case 1:
      objects.push(
        new Raindrop(
          x,
          y,
          size,
          images["drop"]
        )
      );
      break;

    case 2:
      objects.push(
        new Soot(
          x,
          y,
          size,
          images["soot"]
        )
      );
      break;
  }
}


function drawStatistics() {
  fill(255);
  noStroke();
  textSize(16);

  text(
    "Počet objektů: " +
      objects.length,
    20,
    30
  );

  text(
    "Skóre: " + player.score,
    20,
    50
  );
}
```

---

# 44. Výsledné připojení souborů

```html id="8rpbyc"
<script src="https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/p5.js"></script>

<script
  defer
  src="https://unpkg.com/p5.collide2d">
</script>

<script src="./classes/FallingObject.js"></script>
<script src="./classes/Snowflake.js"></script>
<script src="./classes/Raindrop.js"></script>
<script src="./classes/Soot.js"></script>
<script src="./classes/Player.js"></script>

<script src="sketch.js"></script>
```

Pořadí je opět důležité:

1. p5.js,
2. kolizní knihovna,
3. rodičovská třída,
4. potomkovské třídy,
5. třída hráče,
6. hlavní program.

---

# 45. Co jsme se naučili

## Samostatná třída hráče

Hráč má vlastní stav:

```javascript id="amf9hy"
this.x
this.y
this.size
this.speed
this.score
```

a vlastní metody:

```javascript id="3of2ff"
update()
collide()
draw()
```

## Spojitý vstup z klávesnice

Pro plynulý pohyb používáme:

```javascript id="rhi8km"
keyIsDown()
```

## Omezení pohybu

Hráče udržujeme uvnitř canvasu pomocí:

```javascript id="tz6ldx"
constrain()
```

## Kolize

Kolize ověřuje překrytí hráče a padajícího objektu.

```javascript id="q8yj1s"
collideRectCircle()
```

## Návratová hodnota

Metoda `collide()` vrací:

```text id="tnnurm"
true
false
```

## Typ objektu

Pomocí:

```javascript id="ynt95v"
instanceof
```

zjišťujeme, zda hráč sebral vločku, kapku nebo sazi.

## Změna skóre

Skóre je vlastností hráče:

```javascript id="52yqtr"
this.score
```

## Odstranění objektu

Sebraný objekt odstraníme:

```javascript id="lt4zvt"
objects.splice(i, 1);
```

## Přeskočení iterace

Pomocí:

```javascript id="pz88d9"
continue;
```

přeskočíme další práci s odstraněným objektem.

---

# 46. Kontrolní otázky

1. Proč je hráč vytvořen jako samostatná třída?
2. Proč třída `Player` nedědí z `FallingObject`?
3. Co obsahuje vlastnost `this.speed`?
4. Proč je pro pohyb vhodné použít `keyIsDown()`?
5. Jaký je rozdíl mezi `keyPressed()` a `keyIsDown()`?
6. Proč se pravá hranice počítá jako `width - this.size`?
7. Co dělá funkce `constrain()`?
8. Proč jsou souřadnice obrázku hráče posunuty o `size / 2`?
9. Co je kolize?
10. Odkud pochází funkce `collideRectCircle()`?
11. Jaké hodnoty může vracet metoda `collide()`?
12. K čemu slouží `return`?
13. Jak poznáme, že objekt je vločka?
14. Co znamená `instanceof`?
15. Kdy se skóre zvyšuje?
16. Kdy se skóre snižuje?
17. Proč se sebraný objekt odstraňuje z pole?
18. Co dělá `continue`?
19. Proč při odebírání objektů procházíme pole odzadu?
20. Jak mezi sebou komunikují instance `Player` a padající objekt?

---

# 47. Praktické úkoly

## Úkol 1: Změna rychlosti hráče

Změňte:

```javascript id="eh47n4"
this.speed = 5;
```

na:

```javascript id="cy8dn0"
this.speed = 10;
```

Porovnejte ovládání.

## Úkol 2: Vlastní bodování

Nastavte pravidla:

```text id="isqehv"
vločka → +5
kapka  → +2
saze   → -10
```

## Úkol 3: Body podle velikosti

Upravte bodování tak, aby větší vločka přinesla více bodů:

```javascript id="c1e5c4"
this.score +=
  round(object.size);
```

## Úkol 4: Minimální skóre

Zajistěte, aby skóre nikdy nekleslo pod nulu.

Nápověda:

```javascript id="0kjt0r"
this.score = max(
  0,
  this.score
);
```

## Úkol 5: Zrychlení hráče

Při držení klávesy `SHIFT` se hráč pohybuje dvojnásobnou rychlostí.

Nápověda:

```javascript id="9kgj3k"
if (keyIsDown(SHIFT)) {
}
```

## Úkol 6: Dva způsoby ovládání

Přidejte ovládání také pomocí kláves:

```text id="4yr2lh"
A
D
```

## Úkol 7: Vizuální reakce na kolizi

Po zásahu sazemi krátce změňte barvu hráče na černou.

## Úkol 8: Počet sebraných objektů

Přidejte vlastnosti:

```javascript id="sxubhl"
this.snowflakesCollected = 0;
this.raindropsCollected = 0;
this.sootHits = 0;
```

## Úkol 9: Druhý hráč

Vytvořte druhou instanci třídy `Player`.

První hráč bude používat šipky, druhý `A` a `D`.

## Úkol 10: Soutěž o objekt

Zjistěte, co se stane, pokud se oba hráči ve stejném snímku dotýkají stejného objektu.

Vysvětlete, proč objekt získá právě jeden z nich.

---

# 48. Rozšiřující úkol: vlastní kolize bez knihovny

Pro jednodušší vlastní výpočet můžeme hráče i objekty považovat za kruhy.

Střed hráče:

```javascript id="zctq70"
let playerCenterX =
  this.x + this.size / 2;

let playerCenterY =
  this.y + this.size / 2;
```

Vzdálenost:

```javascript id="h2o7xa"
let distance = dist(
  playerCenterX,
  playerCenterY,
  object.x,
  object.y
);
```

Kolize nastane, pokud:

```javascript id="x85wlt"
distance <
  this.size / 2 +
  object.size / 2
```

Metoda:

```javascript id="8oe1tr"
collideAsCircles(object) {
  let playerCenterX =
    this.x + this.size / 2;

  let playerCenterY =
    this.y + this.size / 2;

  let distance = dist(
    playerCenterX,
    playerCenterY,
    object.x,
    object.y
  );

  return (
    distance <
    this.size / 2 +
    object.size / 2
  );
}
```

Tato varianta je méně přesná pro čtvercového hráče, ale dobře ukazuje matematický princip kolize kruhů.

---

# 49. Shrnutí lekce

Na začátku druhé lekce jsme měli pouze automaticky padající objekty.

Postupně jsme přidali:

```text id="2ccfch"
statický hráč
→ třída Player
→ vlastnosti hráče
→ pohyb doprava
→ pohyb doleva
→ omezení canvasem
→ skóre
→ obrázek hráče
→ kolizní knihovna
→ metoda collide()
→ návratová hodnota
→ odstranění objektu
→ bodování podle typu
→ možnost druhého hráče
```

Hra nyní obsahuje dvě hlavní skupiny objektů:

```text id="od250n"
padající objekty
hráč
```

Padající objekty jsou řízeny automaticky.

Hráč je řízen uživatelem.

Jejich setkání vyhodnocuje kolizní metoda, která mění skóre a oznamuje hlavnímu programu, zda má být objekt odstraněn.

Tím vznikl základ skutečné herní mechaniky.

V následující lekci aplikaci rozšíříme o:

* úvodní obrazovku,
* herní stavy,
* časový limit,
* konec hry,
* restart,
* rychlou nápovědu,
* zvukové efekty,
* propracovanější uživatelské rozhraní.
