# p5.js projekty

Tento repozitář slouží k učení tvorby interaktivních vizuálních aplikací v JavaScriptu pomocí knihovny [p5.js](https://p5js.org/). Jednotlivé projekty postupně představují základy kreslení, animace, interakce a návrhu jednoduché hry.

## Co je p5.js

p5.js je JavaScriptová knihovna zaměřená na kreativní programování. Zjednodušuje práci s canvasem, grafikou, animací, zvukem, vstupy uživatele a dalšími multimediálními prvky. Programátor se může soustředit na chování aplikace, aniž by musel od začátku řešit celý kreslicí a animační základ.

## Základní princip aplikace

Typický p5.js projekt obsahuje soubor `sketch.js` a stránku `index.html`, která načte knihovnu p5.js a vlastní kód.

### Životní cyklus sketche

- `preload()` - načte obrázky, zvuky nebo další zdroje ještě před spuštěním aplikace.
- `setup()` - spustí se jednou; vytvoří canvas a nastaví počáteční stav.
- `draw()` - opakuje se v animační smyčce; aktualizuje stav a vykresluje aktuální snímek.

Nejčastější rozdělení práce v `draw()` je:

1. připravit pozadí,
2. aktualizovat stav objektů,
3. vykreslit objekty,
4. zpracovat nebo zobrazit doplňkové informace.

## Canvas a souřadnice

Canvas je plocha, na kterou p5.js kreslí. Počátek souřadnic `(0, 0)` je vlevo nahoře, osa `x` roste doprava a osa `y` dolů. Rozměry canvasu jsou dostupné v proměnných `width` a `height`.

```javascript
function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(30, 50, 70);
  circle(width / 2, height / 2, 40);
}
```

## Animace a stav

Animace vzniká opakovaným překreslováním canvasu. Hodnoty objektů se mění v každém průchodu `draw()` a jejich nové hodnoty se použijí při vykreslení dalšího snímku.

U větších aplikací je užitečné oddělit:

- `update()` - změna polohy, rychlosti nebo jiného stavu,
- `draw()` - samotné vykreslení.

Při práci s transformacemi používejte `push()` a `pop()`, aby se `translate()`, `rotate()`, `tint()` nebo jiné nastavení nepřeneslo na další objekty.

## Obrázky a další zdroje

Obrázky a zvuky ukládejte do samostatné složky, například `images/`. Načítejte je v `preload()` pomocí relativní cesty:

```javascript
let imageFile;

function preload() {
  imageFile = loadImage("./images/object.svg");
}
```

Relativní cesty fungují vzhledem k umístění projektu. Pro načítání lokálních souborů je vhodné použít HTTP server, například `python -m http.server 8000`, místo přímého otevírání HTML přes `file://`.

## Organizace objektů

Pokud aplikace pracuje s více podobnými objekty, ukládejte je do pole a zpracovávejte je v cyklu. Společné vlastnosti a chování lze přesunout do třídy. Odvozené třídy potom mohou pomocí `extends` přidat vlastní pohyb nebo vykreslení.

Při odstraňování prvků z pole během průchodu je bezpečné procházet pole odzadu:

```javascript
for (let i = objects.length - 1; i >= 0; i--) {
  if (objects[i].finished) {
    objects.splice(i, 1);
  }
}
```

## Projekt FallingGame

[FallingGame/README.md](FallingGame/README.md) obsahuje popis konkrétní ukázky padajících objektů a odkazy na všechny dostupné lekce.

### Lekce

- [Lekce 1: Padající objekty a první kroky k objektově orientovanému programování](FallingGame/navody/lekce01.md)
- [Lekce 2: Hráč, ovládání, kolize a bodování](FallingGame/navody/lekce02.md)
- [Lekce 3: Herní stavy, čas, uživatelské rozhraní a zvuk](FallingGame/navody/lekce03.md)

## Doporučené odkazy

- [p5.js](https://p5js.org/) - hlavní stránka knihovny a přehled zdrojů.
- [p5.js Reference](https://p5js.org/reference/) - dokumentace funkcí, proměnných a tříd p5.js.
- [p5.js Tutorials](https://p5js.org/tutorials/) - postupné návody pro začátečníky i pokročilé.
- [p5.js Examples](https://p5js.org/examples/) - krátké ukázky kreslení, animace, práce s barvami a interakcí.
- [p5.js Web Editor](https://editor.p5js.org/) - online prostředí pro rychlé zkoušení sketchů.
- [MDN: Using classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes) - vysvětlení tříd, konstruktorů a dědičnosti v JavaScriptu.
- [MDN: JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) - širší průvodce syntaxí a principy JavaScriptu.
