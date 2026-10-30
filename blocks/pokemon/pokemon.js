/*
 * Pokemon Block
 * Recreate a pokemon
 */

export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    row.classList.add('pokemon-row', `pokemon-row-${index}`);
    const first = row.firstElementChild || null;
    first?.classList.add('pokemon-item-first');
    [...row.children].forEach((col) => {
      col.classList.add('pokemon-item');
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('pokemon-img');
        }
      }
    });
  });
}
