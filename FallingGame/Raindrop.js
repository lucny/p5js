/**
 * Kapka používá společný pohyb FallingObject a vlastní průhlednost.
 */
class Raindrop extends FallingObject {
  /**
   * Vytvoří kapku s náhodnou hodnotou průhlednosti.
   *
   * @param {number} x Počáteční poloha na ose x.
   * @param {number} y Počáteční poloha na ose y.
   * @param {number} size Velikost kapky v pixelech.
   * @param {p5.Image} img Obrázek kapky.
   */
  constructor(x, y, size, img) {
    // Společné vlastnosti a rychlost nastaví rodičovský konstruktor.
    super(x, y, size, img);

    // Rozdílná průhlednost pomáhá odlišit jednotlivé kapky.
    this.opacity = random(60, 220);
  }

  /**
   * Vykreslí kapku s její vlastní průhledností.
   */
  draw() {
    // tint je globální nastavení p5.js, proto jeho změnu izolujeme pomocí push/pop.
    push();

    tint(255, this.opacity);

    image(
      this.img,
      this.x,
      this.y,
      this.size,
      this.size
    );

    // Obnovíme původní tint, aby průhlednost kapky neovlivnila statistiky ani další kreslení.
    pop();
  }
}
