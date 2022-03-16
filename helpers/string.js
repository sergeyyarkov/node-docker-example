class StringHelper {
  /**
   * Delete the trailing slash from url
   *
   * @param {string} url
   */
  static delTrailingSlash(url) {
    return url.slice(-1) === '/' ? url.slice(0, -1) : url;
  }
}

export default StringHelper;
