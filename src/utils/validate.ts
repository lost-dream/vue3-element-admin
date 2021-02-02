/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @description: 校验用户名
 * @param {string} str
 * @return {*}
 */
export function validUsername(str: string) {
  const validMap = ['admin', 'editor']
  return validMap.includes(str.trim())
}
