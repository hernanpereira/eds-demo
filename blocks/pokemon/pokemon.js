/*
 * Pokemon Block
 * Recreate a pokemon
 */

export default function decorate(block) {

  [...block.children].forEach((row, index) => {
    row.classList.add('pokemon-row', `pokemon-row-${index}`);

    const first = row.firstElementChild;
    first && first.classList.add('pokemon-item-first');
    
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


  // // setup image columns
  // [...block.children].forEach((row) => {
  //   [...row.children].forEach((col) => {
  //     const pic = col.querySelector('picture');
  //     if (pic) {
  //       const picWrapper = pic.closest('div');
  //       if (picWrapper && picWrapper.children.length === 1) {
  //         // picture is only content in column
  //         picWrapper.classList.add('columns-img-col');
  //       }
  //     }
  //   });
  // });

}
