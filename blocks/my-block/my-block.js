/*
 * My Block
 * Recreate a my-block
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    /* eslint-disable no-console */
    console.log('paso 1: ', row);
    /* eslint-enable no-console */
  });
}
