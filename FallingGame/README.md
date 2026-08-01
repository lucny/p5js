# FallingGame

`FallingGame` je jednoduchý výukový projekt vytvořený v knihovně [p5.js](https://p5js.org/). Název odkazuje na padající objekty ve scéně a zároveň na programátorský černý humor: programy někdy také „padají“.

## Záměr projektu

Projekt slouží jako praktická ukázka tvorby malé animované aplikace. Canvas postupně vytváří různé typy padajících objektů:

- vločky, které se otáčejí,
- kapky s náhodnou průhledností,
- saze, které se pohybují nepravidelně do stran.

Ukázka procvičuje především:

- třídy, konstruktory, vlastnosti a metody,
- samostatnou třídu hráče a ovládání pomocí šipek,
- dědičnost pomocí `extends` a `super()`,
- polymorfismus a operátor `instanceof`,
- práci s polem objektů,
- automatické vytváření a odstraňování objektů,
- detekci kolizí a změnu skóre,
- načítání a vykreslování obrázků v p5.js.

## Struktura projektu

- `index.html` - stránka, která načte p5.js a zdrojové soubory ve správném pořadí.
- `sketch.js` - hlavní program se životním cyklem p5.js a správou objektů.
- `FallingObject.js` - společná rodičovská třída.
- `Snowflake.js`, `Raindrop.js`, `Soot.js` - specializované potomkovské třídy.
- `Player.js` - hráč s ovládáním, kolizemi a skóre.
- `images/` - SVG obrázky používané ve scéně.
- `navody/` - výukové lekce navazující na projekt.

## Spuštění

Protože aplikace načítá lokální obrázky, je vhodné spustit ji přes jednoduchý HTTP server. V PowerShellu otevřete tuto složku a spusťte:

```powershell
python -m http.server 8000
```

Potom otevřete <http://127.0.0.1:8000/> v prohlížeči.

## Výukové lekce

- [Lekce 1: Padající objekty a první kroky k objektově orientovanému programování](navody/lekce01.md)
- [Lekce 2: Hráč, ovládání, kolize a bodování](navody/lekce02.md)
- [Lekce 3: Herní stavy, čas, uživatelské rozhraní a zvuk](navody/lekce03.md)

[Zpět na hlavní README projektu](../README.md)
