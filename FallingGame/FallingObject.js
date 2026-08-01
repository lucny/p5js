/**
 * Společný základ pro všechny padající objekty.
 *
 * Třída uchovává data, která mají vločky, kapky i saze společná:
 * polohu, velikost, obrázek a rychlost pohybu. Potomkovské třídy
 * mohou tyto vlastnosti používat a podle potřeby rozšířit jejich chování.
 */
class FallingObject {
  /**
   * Vytvoří jeden padající objekt.
   *
   * @param {number} x Počáteční poloha na ose x.
   * @param {number} y Počáteční poloha na ose y.
   * @param {number} size Velikost objektu v pixelech.
   * @param {p5.Image} img Obrázek, který se má vykreslit.
   */
  constructor(x, y, size, img) {
    // Vlastnosti patří konkrétní instanci, proto používáme klíčové slovo this.
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;

    // vx určuje vodorovný pohyb. Základní objekty padají přímo dolů, proto je 0.
    this.vx = 0;

    // Náhodná rychlost způsobí, že objekty nepadají všechny stejně rychle.
    this.vy = random(1, 3);
  }

  /**
   * Posune objekt o jeho aktuální rychlost.
   *
   * Tuto metodu dědí všechny potomkovské třídy. Pokud potomek přidá
   * vlastní pohyb, měl by nakonec zavolat super.update(), aby objekt
   * nepřestal padat.
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  /**
   * Vykreslí obrázek na aktuální pozici objektu.
   *
   * imageMode(CENTER) je nastavený v setup(), takže x a y označují
   * střed obrázku, nikoli jeho levý horní roh.
   */
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
