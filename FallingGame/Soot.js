/**
 * Saze rozšiřují padající objekt o průhlednost a nepravidelný pohyb do stran.
 */
class Soot extends FallingObject {
  /**
   * Vytvoří menší částici sazí s náhodnou průhledností.
   *
   * @param {number} x Počáteční poloha na ose x.
   * @param {number} y Počáteční poloha na ose y.
   * @param {number} size Základní velikost částice v pixelech.
   * @param {p5.Image} img Obrázek sazí.
   */
  constructor(x, y, size, img) {
    // Rodič nastaví společné vlastnosti včetně počáteční rychlosti.
    super(x, y, size, img);

    // Saze jsou oproti ostatním typům záměrně menší.
    this.size = size / 2;
    this.opacity = random(60, 220);
  }

  /**
   * Přidá náhodné zrychlení do stran a potom provede běžný pád.
   */
  update() {
    // Postupné změny vx vytvoří lehce chaotický pohyb místo přímého pádu.
    this.vx += random(-0.1, 0.1);

    // Rodičovská metoda použije novou vx a posune také y podle vy.
    super.update();
  }

  /**
   * Vykreslí saze s tmavším odstínem a náhodnou průhledností.
   */
  draw() {
    // Stejně jako u kapky izolujeme globální nastavení tint.
    push();

    tint(80, this.opacity);

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
