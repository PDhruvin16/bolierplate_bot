export function printf(...args) {
  try {
    // eslint-disable-next-line no-console
    console.log.apply(console, args);
  } catch (_) {
    // ignore
  }
}

export default { printf };

