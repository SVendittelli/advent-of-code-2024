/**
 * Read all the lines of a given file.
 * @param {string} path The path to the file to read
 * @returns {Promise<string[]>} An array of each of the lines of the file as a string
 */
export const readFile = async (path: string): Promise<string[]> => {
  const file = Bun.file(path);

  const input = await file.text();
  const lines = input.trim().split("\n");
  return lines;
};
