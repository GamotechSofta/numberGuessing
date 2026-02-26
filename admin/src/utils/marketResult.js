/**
 * Market result formation based on pana values.
 *
 * Pattern: ***_**_***
 * - First ***  = Open Pana (3-digit number)
 * - First _    = separator
 * - **         = Open Ank + Close Ank (unit digit of digit-sum each)
 * - Second _   = separator
 * - Last ***   = Close Pana (3-digit number)
 *
 * Example: Open Pana 238, Close Pana 357 → 238_35_357
 * - Open Ank:  2+3+8 = 13 → unit digit 3
 * - Close Ank: 3+5+7 = 15 → unit digit 5
 */

const PLACEHOLDER = '***_**_***'

/**
 * Extract exactly 3 digits from a string or number (e.g. "238", "2-3-8", 238).
 * @param {string|number} value - Open or close pana value
 * @returns {string|null} - 3-digit string or null if not enough digits
 */
function getThreeDigits(value) {
  if (value == null) return null
  const digits = String(value).replace(/\D/g, '')
  if (digits.length < 3) return null
  return digits.slice(0, 3)
}

/**
 * Sum digits of a 3-digit string and return unit digit (ank).
 * @param {string} threeDigits - e.g. "238"
 * @returns {number} - 0-9
 */
function panaToAnk(threeDigits) {
  const sum = threeDigits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
  return sum % 10
}

/**
 * Format market result from open and close pana values.
 * Pattern: OpenPana_OpenAnkCloseAnk_ClosePana (e.g. 238_35_357)
 *
 * @param {string|number} openPana  - Open pana (3 digits), e.g. 238 or "2-3-8"
 * @param {string|number} closePana - Close pana (3 digits), e.g. 357 or "3-5-7"
 * @returns {string} - Formatted result "openPana_openAnkCloseAnk_closePana" or "***_**_***" if invalid
 */
export function formatMarketResultFromPana(openPana, closePana) {
  const open = getThreeDigits(openPana)
  const close = getThreeDigits(closePana)
  if (!open || !close) return PLACEHOLDER

  const openAnk = panaToAnk(open)
  const closeAnk = panaToAnk(close)

  return `${open}_${openAnk}${closeAnk}_${close}`
}

/**
 * Check if open/close values represent a placeholder or missing result.
 * @param {string} open
 * @param {string} close
 * @returns {boolean}
 */
export function isPlaceholderResult(open, close) {
  const o = open != null ? String(open).trim() : ''
  const c = close != null ? String(close).trim() : ''
  return !o || !c || o === '***' || c === '***'
}

/**
 * Get display result for a market: uses pre-formatted market.result if present,
 * otherwise builds from open/close pana. When only open is declared, shows open result + placeholders.
 *
 * @param {{ open?: string, close?: string, result?: string }} market
 * @returns {string}
 */
export function getMarketResultDisplay(market) {
  const open = market.open != null ? String(market.open).trim() : ''
  const close = market.close != null ? String(market.close).trim() : ''

  const closeMissing = !close || close === '***'
  const openDeclared = open && open !== '***' && getThreeDigits(open)

  if (market.result && String(market.result).trim()) return String(market.result).trim()

  // Only open declared → show open pana + open ank + *_***
  if (openDeclared && closeMissing) {
    const openAnk = panaToAnk(openDeclared)
    return `${openDeclared}_${openAnk}*_***`
  }

  if (isPlaceholderResult(open, close)) return PLACEHOLDER

  return formatMarketResultFromPana(open, close)
}
