/**
 * Get full API URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full API URL
 */
export function getApiUrl(path = "") {
  return `${
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
  }${path}`;
}
