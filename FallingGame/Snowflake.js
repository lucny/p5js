/**
 * Vločka rozšiřuje základní padající objekt o otáčení.
 *
 * Pohyb dolů zůstává ve třídě FallingObject. Tato třída k němu přidává
 * pouze úhel a rychlost otáčení a přepisuje vykreslení obrázku.
 */
class Snowflake extends FallingObject {
  /**
   * Vytvoří vločku s náhodnou počáteční orientací a směrem otáčení.
   *
   * @param {number} x Počáteční poloha na ose x.
   * @param {number} y Počáteční poloha na ose y.
   * @param {number} size Velikost vločky v pixelech.
   * @param {p5.Image} img Obrázek vločky.
   */
  constructor(x, y, size, img) {
    // Konstruktor rodiče nastaví společné vlastnosti x, y, size, img, vx a vy.
    super(x, y, size, img);

    // Každá vločka začne v jiné orientaci a může se otáčet opačným směrem.
    this.angle = random(TWO_PI);
    this.spin = random(-0.03, 0.03);
  }

  /**
   * Aktualizuje otočení i polohu vločky.
   */
  update() {
    this.angle += this.spin;

    // Volání rodičovské metody zachová běžný pohyb dolů.
    super.update();
  }

  /**
   * Vykreslí vločku otočenou kolem jejího středu.
   */
  draw() {
    // Transformace platí jen uvnitř tohoto bloku a neovlivní další objekty.
    push();

    // Přesuneme počátek souřadnic do středu vločky a otočíme celý její obrázek.
    translate(this.x, this.y);
    rotate(this.angle);

    image(
      this.img,
      0,
      0,
      this.size,
      this.size
    );

    // Vrátíme původní souřadnicový systém pro následující vykreslování.
    pop();
  }
}
