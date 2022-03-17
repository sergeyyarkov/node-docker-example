import fs from 'node:fs';

class FileHelper {
  /**
   * Get a list of paths of files
   *
   * @param {string} dir Path to folder
   * @param {[string]} files List of paths of files
   * @returns
   */
  static readDirRecursive(dir, files = []) {
    const entries = fs.readdirSync(dir);
    const result = files;

    for (const entry of entries) {
      const path = dir + '/' + entry;
      const isDir = fs.statSync(path).isDirectory();
      const isFile = fs.statSync(path).isFile();

      if (isDir) {
        files = this.readDirRecursive(path, files);
      }

      if (isFile) {
        result.push(path);
      }
    }

    return result;
  }
}

export default FileHelper;
