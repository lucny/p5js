/**
 * Hráč ovládaný uživatelem.
 *
 * Player není potomkem FallingObject, protože se nepohybuje automaticky
 * dolů. Jeho stav mění vstup z klávesnice a jeho úkolem je reagovat na
 * dotyk s padajícími objekty.
 */
class Player {
  /**
   * Vytvoří hráče na zadané pozici.
   *
   * Souřadnice x a y představují levý horní roh hráčova čtverce.
   * To odpovídá režimu rectMode(CORNER), který nastavujeme při kreslení.
   *
   * @param {number} x Počáteční poloha levého okraje.
   * @param {number} y Počáteční poloha horního okraje.
   * @param {number} size Šířka a výška hráče v pixelech.
   * @param {p5.Image} img Obrázek vykreslený uvnitř hráčova čtverce.
   */
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;

    // Rychlost určuje, o kolik pixelů se hráč posune za jeden snímek.
    this.speed = 5;

    // Skóre patří konkrétní instanci hráče a mění se při kolizi.
    this.score = 0;

    // Barva vyplní základní čtverec pod obrázkem hráče.
    this.color = color(80, 140, 240);
  }

  /**
   * Posune hráče podle směru zadaného hlavní smyčkou.
   *
   * keyIsDown() se vyhodnocuje v každém snímku, takže při držení klávesy
   * vzniká plynulý pohyb. constrain() následně zajistí, že hráč neopustí
   * levou ani pravou hranici canvasu.
   *
   * @param {string} direction Očekávaná hodnota je "left" nebo "right".
   */
  update(direction) {
    if (direction === "left") {
      this.x -= this.speed;
    }

    if (direction === "right") {
      this.x += this.speed;
    }

    // Pravý okraj hráče je x + size, proto je nejvyšší povolené x width - size.
    this.x = constrain(
      this.x,
      0,
      width - this.size
    );
  }

  /**
   * Ověří kolizi hráče s jedním padajícím objektem a upraví skóre.
   *
   * Knihovna p5.collide2d očekává pro obdélník levý horní roh, šířku a výšku.
   * Padající objekt předáváme jako kruh se středem x/y a průměrem size.
   * Metoda vrací název typu kolize, aby hlavní program mohl kromě odstranění
   * objektu přehrát také odpovídající zvukový efekt.
   *
   * @param {FallingObject} object Padající objekt testovaný proti hráči.
   * @returns {string|null} Typ kolize nebo null, pokud ke kolizi nedošlo.
   */
  collide(object) {
    const collision = collideRectCircle(
      this.x,
      this.y,
      this.size,
      this.size,
      object.x,
      object.y,
      object.size
    );

    // Bez kolize není důvod měnit skóre ani odstraňovat objekt.
    if (!collision) {
      return null;
    }

    // instanceof rozliší herní význam objektu, přestože všechny typy
    // zpracováváme společně v poli objects. Název typu vracíme volajícímu,
    // který podle něj zvolí zvukový efekt.
    if (object instanceof Snowflake) {
      this.score += 2;
      return "snowflake";
    } else if (object instanceof Raindrop) {
      this.score += 1;
      return "raindrop";
    } else if (object instanceof Soot) {
      this.score -= 3;
      return "soot";
    }

    // Tato větev chrání metodu před budoucím neznámým typem objektu.
    return null;
  }

  /**
   * Vykreslí základní čtverec, obrázek hráče a aktuální skóre.
   */
  draw() {
    // Nastavení kreslení hráče izolujeme, aby neovlivnilo padající objekty.
    push();

    // Hráč používá levý horní roh jako výchozí bod čtverce.
    rectMode(CORNER);

    fill(this.color);
    noStroke();

    square(
      this.x,
      this.y,
      this.size
    );

    // imageMode(CENTER) je globální nastavení, proto obrázek posuneme
    // do středu čtverce ručním výpočtem x + size / 2 a y + size / 2.
    image(
      this.img,
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size,
      this.size
    );

    fill(255);
    textSize(16);

    // Skóre je umístěno pod hráčem a pohybuje se spolu s ním.
    text(
      "Skóre: " + this.score,
      this.x,
      this.y + this.size + 20
    );

    pop();
  }
}
