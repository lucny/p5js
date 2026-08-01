# Lekce 1: Padající objekty a první kroky k objektově orientovanému programování

## Cíl lekce

V předchozí lekci jsme vytvářeli aplikaci pomocí proměnných, funkcí, parametrů, podmínek a cyklů. Tento přístup fungoval dobře, dokud jsme pracovali jen s několika objekty.

Nyní chceme vytvořit scénu, v níž bude současně padat větší množství vloček, kapek a sazí. Každý objekt bude mít:

* vlastní polohu,
* vlastní velikost,
* vlastní rychlost,
* vlastní obrázek,
* vlastní způsob pohybu,
* vlastní způsob vykreslení.

Kdybychom pro každý objekt vytvářeli samostatné proměnné, program by se velmi rychle stal nepřehledným.

Místo toho se naučíme používat:

* objekty,
* třídy,
* konstruktory,
* vlastnosti,
* metody,
* klíčové slovo `this`,
* vytváření instancí pomocí `new`,
* pole objektů,
* dědičnost,
* `extends`,
* `super()`,
* přepisování metod,
* operátor `instanceof`.

Na konci lekce bude aplikace automaticky vytvářet různé druhy padajících objektů a po opuštění canvasu je odstraňovat.

---

# 1. Výchozí problém: jeden padající objekt

Začneme co nejjednodušší verzí.

Vytvoříme jeden kruh, který se bude pohybovat směrem dolů.

```javascript
let objectX = 300;
let objectY = 0;
let objectSize = 30;
let objectSpeed = 2;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(30, 50, 70);

  objectY += objectSpeed;

  fill(255);
  noStroke();

  circle(
    objectX,
    objectY,
    objectSize
  );
}
```

## Co program dělá

Proměnné:

```javascript
let objectX = 300;
let objectY = 0;
```

určují polohu objektu.

Proměnná:

```javascript
let objectSize = 30;
```

určuje jeho velikost.

Proměnná:

```javascript
let objectSpeed = 2;
```

určuje, o kolik pixelů se objekt v každém snímku posune.

Pohyb vzniká příkazem:

```javascript
objectY += objectSpeed;
```

To je zkrácený zápis:

```javascript
objectY = objectY + objectSpeed;
```

Protože osa `y` roste směrem dolů, objekt padá.

---

# 2. Otázka: Jak vytvořit více objektů?

Představme si, že chceme tři padající kruhy.

Mohli bychom vytvořit:

```javascript
let object1X;
let object1Y;
let object1Size;
let object1Speed;

let object2X;
let object2Y;
let object2Size;
let object2Speed;

let object3X;
let object3Y;
let object3Size;
let object3Speed;
```

Potom bychom museli opakovat také vykreslování:

```javascript
object1Y += object1Speed;
circle(object1X, object1Y, object1Size);

object2Y += object2Speed;
circle(object2X, object2Y, object2Size);

object3Y += object3Speed;
circle(object3X, object3Y, object3Size);
```

Tento postup má několik problémů:

* stále opakujeme stejný kód,
* názvy proměnných se násobí,
* změna chování vyžaduje úpravu na více místech,
* přidání desítek objektů je nepraktické,
* každý objekt je rozdělen do několika nesouvisejících proměnných.

Potřebujeme způsob, jak údaje o jednom objektu spojit dohromady.

---

# 3. Jeden objekt jako datový celek

V JavaScriptu můžeme vytvořit objekt:

```javascript
let fallingObject = {
  x: 300,
  y: 0,
  size: 30,
  speed: 2
};
```

Nyní patří všechny hodnoty k jednomu celku.

K jednotlivým vlastnostem přistupujeme pomocí tečky:

```javascript
fallingObject.x
fallingObject.y
fallingObject.size
fallingObject.speed
```

Pohyb:

```javascript
fallingObject.y += fallingObject.speed;
```

Vykreslení:

```javascript
circle(
  fallingObject.x,
  fallingObject.y,
  fallingObject.size
);
```

Celý program:

```javascript
let fallingObject = {
  x: 300,
  y: 0,
  size: 30,
  speed: 2
};

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(30, 50, 70);

  fallingObject.y +=
    fallingObject.speed;

  fill(255);
  noStroke();

  circle(
    fallingObject.x,
    fallingObject.y,
    fallingObject.size
  );
}
```

Tento zápis je přehlednější, ale stále musíme každý objekt vytvářet ručně.

---

# 4. Proč potřebujeme třídu

Třída funguje jako předpis nebo šablona pro vytváření objektů.

Lze si ji představit například jako technický výkres:

```text
třída = návrh objektu
instance = konkrétní vytvořený objekt
```

Třída určuje:

* jaké vlastnosti bude objekt mít,
* jak bude vytvořen,
* co bude umět dělat.

Jedna třída může vytvořit libovolné množství instancí.

Například:

```text
třída FallingObject
├── první instance
├── druhá instance
├── třetí instance
└── další instance
```

Každá instance má vlastní hodnoty, ale používá stejné metody.

---

# 5. První jednoduchá třída

Vytvoříme třídu `FallingObject`.

```javascript
class FallingObject {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(1, 3);
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    fill(255);
    noStroke();

    circle(
      this.x,
      this.y,
      this.size
    );
  }
}
```

Třída obsahuje tři důležité části:

```javascript
constructor()
update()
draw()
```

---

# 6. Konstruktor

Konstruktor je zvláštní metoda, která se spustí při vytvoření nové instance.

```javascript
constructor(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.speed = random(1, 3);
}
```

Parametry:

```javascript
x
y
size
```

dostává konstruktor při vytvoření objektu.

Například:

```javascript
new FallingObject(300, 0, 30)
```

znamená:

```text
x = 300
y = 0
size = 30
```

Konstruktor tyto hodnoty uloží do vlastností instance.

---

# 7. Klíčové slovo `this`

Výraz:

```javascript
this.x
```

znamená:

> vlastnost `x` právě používané instance

Každý vytvořený objekt má vlastní hodnoty:

```javascript
object1.x
object2.x
object3.x
```

Uvnitř třídy ale neznáme jméno konkrétní proměnné. Proto používáme `this`.

```javascript
this.x = x;
```

Levá strana:

```javascript
this.x
```

je vlastnost instance.

Pravá strana:

```javascript
x
```

je parametr konstruktoru.

Podobně:

```javascript
this.size = size;
```

ukládá hodnotu parametru `size` do vlastnosti konkrétní instance.

---

# 8. Vlastnosti a metody

Třída obsahuje vlastnosti:

```javascript
this.x
this.y
this.size
this.speed
```

Vlastnosti popisují stav objektu.

Třída obsahuje také metody:

```javascript
update()
draw()
```

Metody popisují chování objektu.

Metoda `update()` mění stav:

```javascript
update() {
  this.y += this.speed;
}
```

Metoda `draw()` objekt vykresluje:

```javascript
draw() {
  fill(255);
  noStroke();

  circle(
    this.x,
    this.y,
    this.size
  );
}
```

Je vhodné oddělovat:

```text
update() → změna stavu
draw()   → vykreslení
```

Toto rozdělení se běžně používá v hrách a animacích.

---

# 9. Vytvoření první instance

Nad funkcí `setup()` vytvoříme proměnnou:

```javascript
let fallingObject;
```

Ve funkci `setup()` vytvoříme konkrétní objekt:

```javascript
fallingObject =
  new FallingObject(
    300,
    0,
    30
  );
```

Klíčové slovo:

```javascript
new
```

vytvoří novou instanci třídy.

Celý program:

```javascript
let fallingObject;

function setup() {
  createCanvas(800, 600);

  fallingObject =
    new FallingObject(
      300,
      0,
      30
    );
}

function draw() {
  background(30, 50, 70);

  fallingObject.update();
  fallingObject.draw();
}


class FallingObject {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(1, 3);
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    fill(255);
    noStroke();

    circle(
      this.x,
      this.y,
      this.size
    );
  }
}
```

---

# 10. Vytvoření více instancí

Můžeme vytvořit více objektů stejné třídy:

```javascript
let object1;
let object2;
let object3;

function setup() {
  createCanvas(800, 600);

  object1 =
    new FallingObject(
      200,
      0,
      20
    );

  object2 =
    new FallingObject(
      400,
      -100,
      40
    );

  object3 =
    new FallingObject(
      600,
      -200,
      30
    );
}
```

Ve funkci `draw()`:

```javascript
object1.update();
object1.draw();

object2.update();
object2.draw();

object3.update();
object3.draw();
```

Každá instance:

* má vlastní polohu,
* má vlastní velikost,
* má náhodně určenou rychlost,
* používá stejné metody.

Třída tedy odstranila opakování definice chování, ale stále ručně pracujeme s jednotlivými proměnnými.

Dalším krokem bude pole.

---

# 11. Pole objektů

Namísto samostatných proměnných vytvoříme pole:

```javascript
let objects = [];
```

Prázdné hranaté závorky znamenají prázdné pole.

Ve funkci `setup()` vložíme několik instancí:

```javascript
function setup() {
  createCanvas(800, 600);

  objects.push(
    new FallingObject(
      200,
      0,
      20
    )
  );

  objects.push(
    new FallingObject(
      400,
      -100,
      40
    )
  );

  objects.push(
    new FallingObject(
      600,
      -200,
      30
    )
  );
}
```

Metoda:

```javascript
push()
```

přidá nový prvek na konec pole.

---

# 12. Průchod polem

Ve funkci `draw()` použijeme cyklus:

```javascript
for (let object of objects) {
  object.update();
  object.draw();
}
```

Celý program:

```javascript
let objects = [];

function setup() {
  createCanvas(800, 600);

  objects.push(
    new FallingObject(
      200,
      0,
      20
    )
  );

  objects.push(
    new FallingObject(
      400,
      -100,
      40
    )
  );

  objects.push(
    new FallingObject(
      600,
      -200,
      30
    )
  );
}

function draw() {
  background(30, 50, 70);

  for (let object of objects) {
    object.update();
    object.draw();
  }
}
```

Cyklus:

```javascript
for (let object of objects)
```

znamená:

> postupně vezmi každý objekt z pole `objects`

V každém opakování proměnná `object` odkazuje na jednu instanci.

---

# 13. Vytvoření náhodných objektů

Nyní vytvoříme více objektů pomocí cyklu.

```javascript
function setup() {
  createCanvas(800, 600);

  for (let i = 0; i < 20; i++) {
    objects.push(
      new FallingObject(
        random(width),
        random(-500, 0),
        random(10, 40)
      )
    );
  }
}
```

Každý objekt dostane:

```javascript
random(width)
```

náhodnou vodorovnou polohu,

```javascript
random(-500, 0)
```

náhodnou polohu nad canvasem,

```javascript
random(10, 40)
```

náhodnou velikost.

Objekty tak nezačnou padat všechny současně z jedné výšky.

---

# 14. Automatické vytváření objektů

Místo vytvoření všech objektů v `setup()` je můžeme přidávat postupně.

Vytvoříme funkci:

```javascript
function createObject() {
  let x = random(width);
  let y = random(-200, -20);
  let size = random(10, 40);

  objects.push(
    new FallingObject(
      x,
      y,
      size
    )
  );
}
```

Ve funkci `draw()`:

```javascript
if (frameCount % 30 === 0) {
  createObject();
}
```

Každý třicátý snímek vznikne nový objekt.

Při přibližně 60 snímcích za sekundu tedy vzniknou přibližně dva objekty za sekundu.

---

# 15. Proč nestačí objekty pouze vytvářet

Pokud budeme stále přidávat nové objekty, pole poroste:

```text
10 objektů
100 objektů
1000 objektů
10000 objektů
```

Objekty, které už dávno opustily canvas, by stále zůstávaly v paměti a program by je stále aktualizoval.

Musíme je odstraňovat.

---

# 16. Odstranění objektů mimo canvas

Použijeme klasický cyklus s indexem:

```javascript
for (
  let i = objects.length - 1;
  i >= 0;
  i--
) {
  let object = objects[i];

  object.update();
  object.draw();

  if (object.y > height) {
    objects.splice(i, 1);
  }
}
```

Metoda:

```javascript
splice(i, 1)
```

odstraní z pole jeden prvek na indexu `i`.

---

# 17. Proč procházíme pole odzadu

Cyklus začíná:

```javascript
let i = objects.length - 1
```

tedy posledním prvkem pole.

Potom hodnotu snižuje:

```javascript
i--
```

Důvodem je bezpečné odstraňování.

Při odstranění prvku z pole se prvky za ním posunou doleva. Pokud bychom procházeli pole směrem dopředu, mohli bychom některý prvek přeskočit.

Příklad:

```text
index:   0   1   2   3
objekt:  A   B   C   D
```

Odstraníme objekt `B` na indexu 1:

```text
index:   0   1   2
objekt:  A   C   D
```

Objekt `C` se přesunul z indexu 2 na index 1.

Pokud bychom potom zvýšili index na 2, objekt `C` bychom přeskočili.

Průchod odzadu tento problém nemá.

---

# 18. První úplná verze s jedním typem objektu

```javascript
let objects = [];


function setup() {
  createCanvas(800, 600);
}


function draw() {
  background(30, 50, 70);

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
    object.draw();

    if (object.y > height) {
      objects.splice(i, 1);
    }
  }
}


function createObject() {
  let x = random(width);
  let y = random(-200, -20);
  let size = random(10, 40);

  objects.push(
    new FallingObject(
      x,
      y,
      size
    )
  );
}


class FallingObject {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.vx = 0;
    this.vy = random(1, 3);
  }

  update() {
    this.y += this.vy;
    this.x += this.vx;
  }

  draw() {
    fill(255);
    noStroke();

    circle(
      this.x,
      this.y,
      this.size
    );
  }
}
```

---

# 19. Rychlost ve dvou směrech

V původní jednoduché verzi jsme měli pouze:

```javascript
this.speed
```

Nyní použijeme dvě složky rychlosti:

```javascript
this.vx
this.vy
```

`vx` označuje rychlost ve směru osy `x`.

`vy` označuje rychlost ve směru osy `y`.

```javascript
this.vx = 0;
this.vy = random(1, 3);
```

Aktualizace:

```javascript
this.x += this.vx;
this.y += this.vy;
```

Pokud je `vx` rovno nule, objekt se pohybuje pouze dolů.

Pokud později hodnotu `vx` změníme, objekt se začne pohybovat také do stran.

Tento způsob reprezentace pohybu se používá v počítačové grafice, fyzikálních simulacích i hrách.

---

# 20. Přidání obrázku

V přiloženém projektu dostává společná třída také obrázek prostřednictvím parametru `img`.

Třídu rozšíříme:

```javascript
class FallingObject {
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;

    this.vx = 0;
    this.vy = random(1, 3);
  }

  update() {
    this.y += this.vy;
    this.x += this.vx;
  }

  draw() {
    image(
      this.img,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}
```

Ve funkci `setup()` nastavíme:

```javascript
imageMode(CENTER);
```

Souřadnice obrázku potom určují jeho střed.

---

# 21. Načtení obrázku

Vytvoříme proměnnou:

```javascript
let objectImage;
```

Ve funkci `preload()`:

```javascript
function preload() {
  objectImage =
    loadImage(
      "./images/snowflake.svg"
    );
}
```

Při vytvoření objektu předáme obrázek:

```javascript
objects.push(
  new FallingObject(
    x,
    y,
    size,
    objectImage
  )
);
```

Celý program nyní vykresluje obrázky namísto kruhů.

---

# 22. Oddělení třídy do vlastního souboru

Jakmile třída začne být delší, je vhodné ji přesunout do samostatného souboru.

V online editoru vytvoříme soubor:

```text
FallingObject.js
```

Do něj přesuneme:

```javascript
class FallingObject {
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;

    this.vx = 0;
    this.vy = random(1, 3);
  }

  update() {
    this.y += this.vy;
    this.x += this.vx;
  }

  draw() {
    image(
      this.img,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}
```

V souboru `index.html` je nutné třídu připojit před `sketch.js`:

```html
<script src="FallingObject.js"></script>
<script src="sketch.js"></script>
```

Pořadí je důležité.

Prohlížeč musí nejprve načíst definici třídy a teprve potom kód, který ji používá.

Ve výsledném přiloženém projektu jsou soubory tříd připojeny před hlavním `sketch.js`, přičemž rodičovská třída `FallingObject` je načtena před třídami, které ji rozšiřují.

---

# 23. Proč jedna společná třída nestačí

Chceme tři typy objektů:

* vločku,
* kapku,
* sazi.

Všechny mají společné vlastnosti:

```text
x
y
size
img
vx
vy
```

Všechny také:

* padají,
* mění polohu,
* vykreslují obrázek.

Liší se ale v detailech:

* vločka se otáčí,
* kapka má průhlednost,
* saze se pohybují nepravidelně do stran.

Mohli bychom vytvořit tři zcela samostatné třídy, ale opakovali bychom velkou část kódu.

Lepší je dědičnost.

---

# 24. Dědičnost

Dědičnost umožňuje vytvořit novou třídu na základě existující třídy.

Například:

```javascript
class Snowflake extends FallingObject {
}
```

Výraz:

```javascript
extends FallingObject
```

znamená:

> třída `Snowflake` přebírá vlastnosti a metody třídy `FallingObject`

`FallingObject` je rodičovská třída.

`Snowflake` je odvozená nebo potomkovská třída.

---

# 25. První odvozená třída

Vytvoříme soubor:

```text
Snowflake.js
```

Nejprve může být třída velmi jednoduchá:

```javascript
class Snowflake extends FallingObject {
  constructor(x, y, size, img) {
    super(x, y, size, img);
  }
}
```

Klíčové slovo:

```javascript
super()
```

zavolá konstruktor rodičovské třídy.

Tím se vytvoří vlastnosti:

```javascript
this.x
this.y
this.size
this.img
this.vx
this.vy
```

Bez `super()` by potomkovská třída nemohla používat `this`.

---

# 26. Vlastnosti specifické pro vločku

Vločka se bude otáčet.

Do konstruktoru přidáme:

```javascript
this.angle = random(TWO_PI);
this.spin = random(-0.03, 0.03);
```

Celý konstruktor:

```javascript
constructor(x, y, size, img) {
  super(x, y, size, img);

  this.angle = random(TWO_PI);
  this.spin =
    random(-0.03, 0.03);
}
```

`angle` obsahuje aktuální úhel.

`spin` určuje rychlost a směr otáčení.

Záporná hodnota otáčí jedním směrem, kladná opačným.

Přiložená třída vločky používá stejný princip, pouze s širším rozsahem hodnoty `spin`.

---

# 27. Přepsání metody `update()`

Rodičovská třída už má metodu:

```javascript
update()
```

V potomkovské třídě můžeme vytvořit metodu se stejným názvem:

```javascript
update() {
  this.angle += this.spin;
  super.update();
}
```

Tím původní metodu přepisujeme.

Nová metoda:

1. změní úhel,
2. zavolá původní pohyb rodičovské třídy.

Příkaz:

```javascript
super.update();
```

spustí rodičovskou verzi metody.

Bez něj by se vločka otáčela, ale nepadala.

---

# 28. Přepsání metody `draw()`

Vločka potřebuje vlastní způsob vykreslení:

```javascript
draw() {
  push();

  translate(this.x, this.y);
  rotate(this.angle);

  image(
    this.img,
    0,
    0,
    this.size,
    this.size
  );

  pop();
}
```

Používáme stejné transformace jako při otáčení čtverce v předchozí lekci:

```javascript
translate()
rotate()
push()
pop()
```

Rozdíl je v tom, že nyní jsou souřadnice i úhel uloženy uvnitř instance.

Výsledná třída:

```javascript
class Snowflake extends FallingObject {
  constructor(x, y, size, img) {
    super(x, y, size, img);

    this.angle = random(TWO_PI);
    this.spin =
      random(-0.03, 0.03);
  }

  update() {
    this.angle += this.spin;

    super.update();
  }

  draw() {
    push();

    translate(this.x, this.y);
    rotate(this.angle);

    image(
      this.img,
      0,
      0,
      this.size,
      this.size
    );

    pop();
  }
}
```

---

# 29. Vytvoření vločky

Ve funkci `createObject()` místo `FallingObject` použijeme:

```javascript
objects.push(
  new Snowflake(
    x,
    y,
    size,
    snowflakeImage
  )
);
```

Aplikace nyní vytváří instance třídy `Snowflake`.

Ty zároveň používají společné chování `FallingObject`.

---

# 30. Třída kapky

Kapka také dědí z `FallingObject`.

Vytvoříme soubor:

```text
Raindrop.js
```

Kapka bude mít náhodnou průhlednost:

```javascript
class Raindrop extends FallingObject {
  constructor(x, y, size, img) {
    super(x, y, size, img);

    this.opacity =
      random(60, 220);
  }

  draw() {
    push();

    tint(
      255,
      this.opacity
    );

    image(
      this.img,
      this.x,
      this.y,
      this.size,
      this.size
    );

    pop();
  }
}
```

Funkce `tint()` ovlivňuje vykreslování obrázku.

Poslední parametr představuje průhlednost.

```text
0   = zcela průhledné
255 = zcela neprůhledné
```

Přiložená třída `Raindrop` používá vlastnost `opacity`, zděděnou metodu pohybu a vlastní způsob vykreslení s funkcí `tint()`.

---

# 31. Třída sazí

Saze se budou pohybovat také do stran.

Vytvoříme soubor:

```text
Soot.js
```

```javascript
class Soot extends FallingObject {
  constructor(x, y, size, img) {
    super(x, y, size, img);

    this.size = size / 2;

    this.opacity =
      random(60, 220);
  }

  update() {
    this.vx +=
      random(-0.1, 0.1);

    super.update();
  }

  draw() {
    push();

    tint(
      80,
      this.opacity
    );

    image(
      this.img,
      this.x,
      this.y,
      this.size,
      this.size
    );

    pop();
  }
}
```

Řádek:

```javascript
this.vx += random(-0.1, 0.1);
```

v každém snímku mírně změní vodorovnou rychlost.

Objekt se proto nepohybuje přímo dolů, ale nepravidelně uhýbá.

V přiložené třídě `Soot` se velikost také zmenšuje na polovinu a vodorovná rychlost je v každém snímku měněna náhodnou hodnotou.

---

# 32. Polymorfismus v praxi

Pole `objects` nyní může obsahovat různé typy:

```javascript
Snowflake
Raindrop
Soot
```

Přesto pro každý objekt voláme stejně:

```javascript
object.update();
object.draw();
```

Každý objekt ale provede svou vlastní verzi metody.

Vločka:

* padá,
* otáčí se.

Kapka:

* padá,
* vykresluje se s průhledností.

Saze:

* padají,
* nepravidelně se pohybují do stran.

Tomuto principu říkáme polymorfismus.

Stejný příkaz:

```javascript
object.draw()
```

může vyvolat různé chování podle skutečné třídy objektu.

---

# 33. Načtení více obrázků

Vytvoříme objekt pro obrázky:

```javascript
let images = {};
```

Ve funkci `preload()`:

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
}
```

Objekt `images` funguje jako slovník.

K jednotlivým obrázkům přistupujeme:

```javascript
images["flake"]
images["drop"]
images["soot"]
```

Stejný způsob organizace obrázků používá také přiložený `sketch.js`.

---

# 34. Náhodný výběr typu objektu

Ve funkci `createObject()` náhodně vybereme typ:

```javascript
function createObject() {
  let x = random(width);
  let y = random(-200, -20);
  let size = random(10, 40);

  let type =
    floor(random(3));
}
```

Funkce:

```javascript
random(3)
```

vrací číslo od 0 do hodnoty menší než 3.

Funkce:

```javascript
floor()
```

odstraní desetinnou část.

Výsledkem bude:

```text
0
1
2
```

---

# 35. Výběr pomocí podmínek

První varianta:

```javascript
if (type === 0) {
  objects.push(
    new Snowflake(
      x,
      y,
      size,
      images["flake"]
    )
  );
} else if (type === 1) {
  objects.push(
    new Raindrop(
      x,
      y,
      size,
      images["drop"]
    )
  );
} else {
  objects.push(
    new Soot(
      x,
      y,
      size,
      images["soot"]
    )
  );
}
```

Tento zápis je pro začátek srozumitelný.

---

# 36. Výběr pomocí `switch`

Později můžeme funkci přepsat:

```javascript
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
```

Příkaz `switch` je vhodný tehdy, když porovnáváme jednu hodnotu s několika možnostmi.

Každá větev končí příkazem:

```javascript
break;
```

Ten ukončí zpracování `switch`.

Ve výsledném projektu je náhodný typ vybírán podobným způsobem a podle něj je vytvořena instance jedné ze tří potomkovských tříd.

---

# 37. Kontrola skutečného typu pomocí `instanceof`

Operátor:

```javascript
instanceof
```

ověřuje, zda je objekt instancí určité třídy.

Například:

```javascript
object instanceof Snowflake
```

vrátí:

```text
true
```

pokud je objekt vločkou.

Můžeme zobrazit počty objektů:

```javascript
function drawStatistics() {
  fill(255);
  noStroke();
  textSize(16);

  let snowflakeCount =
    objects.filter(
      object =>
        object instanceof Snowflake
    ).length;

  let raindropCount =
    objects.filter(
      object =>
        object instanceof Raindrop
    ).length;

  let sootCount =
    objects.filter(
      object =>
        object instanceof Soot
    ).length;

  text(
    "Vločky: " + snowflakeCount,
    20,
    30
  );

  text(
    "Kapky: " + raindropCount,
    20,
    50
  );

  text(
    "Saze: " + sootCount,
    20,
    70
  );
}
```

Metoda `filter()` vytvoří nové pole obsahující pouze prvky, které splňují podmínku.

Vlastnost:

```javascript
.length
```

vrátí počet prvků.

Přiložený projekt používá stejný princip pro počítání vloček, kapek a sazí.

---

# 38. Upravená rodičovská třída

Soubor `FallingObject.js`:

```javascript
class FallingObject {
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.img = img;

    this.vx = 0;
    this.vy = random(1, 3);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    image(
      this.img,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}
```

V přiloženém zdrojovém souboru rodičovská třída navíc obsahuje vlastnosti `gravity` a `stopped`. V současné verzi projektu však `gravity` přímo neovlivňuje rychlost a `stopped` zatím pouze umožňuje ukončit aktualizaci objektu. Pro první výukovou část je proto vhodné obě vlastnosti přidat až tehdy, když budou mít v programu viditelnou funkci.

---

# 39. Výsledná třída vločky

Soubor `Snowflake.js`:

```javascript
class Snowflake extends FallingObject {
  constructor(x, y, size, img) {
    super(x, y, size, img);

    this.angle =
      random(TWO_PI);

    this.spin =
      random(-0.03, 0.03);
  }

  update() {
    this.angle += this.spin;

    super.update();
  }

  draw() {
    push();

    translate(
      this.x,
      this.y
    );

    rotate(this.angle);

    image(
      this.img,
      0,
      0,
      this.size,
      this.size
    );

    pop();
  }
}
```

---

# 40. Výsledná třída kapky

Soubor `Raindrop.js`:

```javascript
class Raindrop extends FallingObject {
  constructor(x, y, size, img) {
    super(x, y, size, img);

    this.opacity =
      random(60, 220);
  }

  draw() {
    push();

    tint(
      255,
      this.opacity
    );

    image(
      this.img,
      this.x,
      this.y,
      this.size,
      this.size
    );

    pop();
  }
}
```

---

# 41. Výsledná třída sazí

Soubor `Soot.js`:

```javascript
class Soot extends FallingObject {
  constructor(x, y, size, img) {
    super(x, y, size, img);

    this.size = size / 2;

    this.opacity =
      random(60, 220);
  }

  update() {
    this.vx +=
      random(-0.1, 0.1);

    super.update();
  }

  draw() {
    push();

    tint(
      80,
      this.opacity
    );

    image(
      this.img,
      this.x,
      this.y,
      this.size,
      this.size
    );

    pop();
  }
}
```

---

# 42. Výsledný soubor `sketch.js`

```javascript
let objects = [];
let images = {};


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
}


function setup() {
  createCanvas(800, 600);

  imageMode(CENTER);
}


function draw() {
  background(30, 50, 70);

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
    object.draw();

    if (
      object.y >
      height + object.size
    ) {
      objects.splice(i, 1);
    }
  }

  drawStatistics();
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

  let snowflakeCount =
    objects.filter(
      object =>
        object instanceof Snowflake
    ).length;

  let raindropCount =
    objects.filter(
      object =>
        object instanceof Raindrop
    ).length;

  let sootCount =
    objects.filter(
      object =>
        object instanceof Soot
    ).length;

  text(
    "Celkem: " + objects.length,
    20,
    30
  );

  text(
    "Vločky: " + snowflakeCount,
    20,
    50
  );

  text(
    "Kapky: " + raindropCount,
    20,
    70
  );

  text(
    "Saze: " + sootCount,
    20,
    90
  );
}
```

---

# 43. Připojení souborů v `index.html`

```html
<script src="FallingObject.js"></script>
<script src="Snowflake.js"></script>
<script src="Raindrop.js"></script>
<script src="Soot.js"></script>
<script src="sketch.js"></script>
```

Rodičovská třída musí být připojena jako první.

Potomkové třídy používají:

```javascript
extends FallingObject
```

Proto musí být `FallingObject` v okamžiku jejich načtení již známá.

---

# 44. Co jsme se naučili

## Třída

Třída je předpis pro vytváření objektů.

```javascript
class FallingObject {
}
```

## Instance

Instance je konkrétní objekt vytvořený podle třídy.

```javascript
new FallingObject(...)
```

## Konstruktor

Konstruktor nastavuje počáteční stav instance.

```javascript
constructor(...) {
}
```

## Vlastnosti

Vlastnosti ukládají stav objektu.

```javascript
this.x
this.y
this.size
this.vx
this.vy
```

## Metody

Metody určují chování objektu.

```javascript
update()
draw()
```

## `this`

`this` odkazuje na právě používanou instanci.

## Pole objektů

Pole umožňuje spravovat libovolný počet instancí.

```javascript
let objects = [];
```

## Dědičnost

Potomkovská třída přebírá vlastnosti a metody rodičovské třídy.

```javascript
class Snowflake
  extends FallingObject
```

## `super()`

`super()` volá konstruktor rodičovské třídy.

```javascript
super(x, y, size, img);
```

## Přepsání metody

Potomkovská třída může vytvořit vlastní verzi metody.

```javascript
draw() {
}
```

## Polymorfismus

Různé objekty reagují na stejná volání různým způsobem.

```javascript
object.update();
object.draw();
```

## `instanceof`

Operátor ověřuje skutečný typ objektu.

```javascript
object instanceof Snowflake
```

---

# 45. Kontrolní otázky

1. Proč je nevhodné vytvářet pro každý padající objekt samostatné proměnné?
2. Jaký je rozdíl mezi třídou a instancí?
3. Kdy se spouští konstruktor?
4. Co znamená klíčové slovo `this`?
5. Jaký je rozdíl mezi vlastností a metodou?
6. Co dělá klíčové slovo `new`?
7. Proč ukládáme padající objekty do pole?
8. Co dělá metoda `push()`?
9. Co dělá metoda `splice()`?
10. Proč při odstraňování procházíme pole odzadu?
11. Co znamenají vlastnosti `vx` a `vy`?
12. Co znamená `extends`?
13. K čemu slouží `super()`?
14. Co se stane, pokud ve třídě `Snowflake` nezavoláme `super.update()`?
15. Co znamená přepsání metody?
16. Co je polymorfismus?
17. Jak funguje `instanceof`?
18. Proč musí být `FallingObject.js` načten před `Snowflake.js`?
19. K čemu slouží metoda `filter()`?
20. Proč používáme `push()` a `pop()` při vykreslování otočené vločky?

---

# 46. Praktické úkoly

## Úkol 1: Změna rychlosti

Upravte rozsah:

```javascript
this.vy = random(1, 3);
```

Vyzkoušejte:

```javascript
random(0.5, 1.5)
```

a:

```javascript
random(3, 7)
```

Porovnejte výsledek.

## Úkol 2: Různé rychlosti podle velikosti

Zajistěte, aby větší objekty padaly rychleji.

Nápověda:

```javascript
this.vy = map(
  size,
  10,
  40,
  1,
  4
);
```

## Úkol 3: Omezení vodorovné rychlosti sazí

Hodnota `vx` se může postupně příliš zvětšit.

Použijte:

```javascript
this.vx = constrain(
  this.vx,
  -2,
  2
);
```

## Úkol 4: Kmitání kapky

Přidejte kapce vlastnost:

```javascript
this.phase =
  random(TWO_PI);
```

V metodě `update()` měňte její `x` pomocí funkce `sin()`.

## Úkol 5: Různé pravděpodobnosti

Upravte `createObject()` tak, aby:

* vločky tvořily 50 % objektů,
* kapky 30 %,
* saze 20 %.

## Úkol 6: Počet objektů

Změňte interval vytváření:

```javascript
frameCount % 30
```

na:

```javascript
frameCount % 10
```

Sledujte, jak se mění počet objektů a výkon aplikace.

## Úkol 7: Maximální počet objektů

Zabraňte vytváření dalších objektů, pokud jich je v poli více než 100.

Nápověda:

```javascript
if (
  frameCount % 30 === 0 &&
  objects.length < 100
) {
  createObject();
}
```

## Úkol 8: Barevné pozadí podle počtu objektů

Změňte barvu pozadí podle hodnoty:

```javascript
objects.length
```

## Úkol 9: Odstranění kliknutím

Po kliknutí odstraňte všechny padající objekty:

```javascript
function mousePressed() {
  objects = [];
}
```

## Úkol 10: Nový typ objektu

Vytvořte odvozenou třídu:

```javascript
Leaf
```

List bude:

* padat pomaleji,
* otáčet se,
* kymácet se ze strany na stranu.

---

# 47. Shrnutí lekce

Na začátku jsme měli jeden procedurálně řízený kruh.

Postupně jsme prošli tímto vývojem:

```text
jeden objekt v proměnných
→ objektový literál
→ první třída
→ první instance
→ více instancí
→ pole objektů
→ automatické vytváření
→ odstraňování objektů
→ obrázky
→ samostatné soubory
→ rodičovská třída
→ potomkovské třídy
→ přepisování metod
→ polymorfismus
```

Hlavní přínos objektově orientovaného přístupu spočívá v tom, že údaje a chování patřící k jednomu objektu držíme pohromadě.

Místo velkého množství nesouvisejících proměnných máme objekty, které samy uchovávají svůj stav a poskytují metody pro jeho změnu a vykreslení.

Tím jsme připravili základ pro druhou lekci, v níž přidáme:

* třídu hráče,
* ovládání klávesami,
* omezení pohybu,
* kolize,
* sbírání objektů,
* bodování.
