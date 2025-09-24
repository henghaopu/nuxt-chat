const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000 // 24 hours × 60 minutes × 60 seconds × 1000ms

/**
 * Check if a date is within the last specified number of days
 *
 * Note: This function measures 24-hour periods for days > 0, but for days = 0
 * it checks if the date is on the same calendar day as today.
 *
 * @param date - The date to check (should be in the past or today)
 * @param days - Number of days (24-hour periods) to look back from today
 * @returns true if the date is within the last N days (past dates only)
 *
 * @example
 * Assuming current date is September 12, 2025 at 2:00 PM
 *
 * Same day checks (days = 0)
 * isWithinLastDays(new Date('2025-09-12T10:00'), 0) // true - earlier today
 * isWithinLastDays(new Date('2025-09-12T23:59'), 0) // true - later today
 * isWithinLastDays(new Date('2025-09-11T23:59'), 0) // false - yesterday
 *
 * Recent dates (within range)
 * isWithinLastDays(new Date('2025-09-10'), 7) // true - 2 days ago
 * isWithinLastDays(new Date('2025-09-11'), 3) // true - 1 day ago
 * isWithinLastDays(new Date('2025-09-12'), 1) // true - today (0 days)
 * isWithinLastDays(new Date('2025-09-11T10:00'), 1) // true - 1.17 days ago (28 hours)
 *
 * Old dates (outside range)
 * isWithinLastDays(new Date('2025-09-01'), 7) // false - 11 days ago
 * isWithinLastDays(new Date('2025-08-30'), 5) // false - 13 days ago
 * isWithinLastDays(new Date('2025-09-10T10:00'), 1) // false - 2.17 days ago (52 hours)
 *
 * Edge cases
 * isWithinLastDays(new Date('2025-09-05'), 7) // true - exactly 7 days ago
 * isWithinLastDays(new Date('2025-09-04'), 7) // false - 8 days ago
 *
 * Future dates (blocked)
 * isWithinLastDays(new Date('2025-09-15'), 7) // false - silent fail (good for filtering scenarios)
 * isWithinLastDays(new Date('2025-12-25'), 5) // false - silent fail
 */
// When data comes from the API, dates are serialized as strings, not Date objects.
export function isWithinLastDays(date: Date | string, days: number): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const currentDate = new Date()

  if (dateObj > currentDate) return false // silent fail

  // Special case for days = 0: check if it's the same calendar day
  if (days === 0) {
    return (
      dateObj.getFullYear() === currentDate.getFullYear() &&
      dateObj.getMonth() === currentDate.getMonth() &&
      dateObj.getDate() === currentDate.getDate()
    )
  }

  const diffTimestamp = currentDate.getTime() - dateObj.getTime()
  const diffDays = diffTimestamp / MILLISECONDS_PER_DAY

  return diffDays <= days
}

/**
 * Check if a date falls between a specific range of days ago (inclusive on both ends)
 *
 * @param date - The date to check
 * @param minDaysAgo - Minimum days ago (closer to today). 0 means today.
 * @param maxDaysAgo - Maximum days ago (further from today). If undefined, means "older than minDaysAgo"
 * @returns true if the date falls between the specified days ago range (inclusive)
 *
 * @example
 * Today only
 * isBetweenDaysAgo(date, 0, 0) // only today
 *
 * Yesterday to last week (days 1-7)
 * isBetweenDaysAgo(date, 1, 7) // 1-7 days ago (inclusive)
 *
 * Last month excluding last week (days 8-30)
 * isBetweenDaysAgo(date, 8, 30) // 8-30 days ago (inclusive)
 *
 * Older than 30 days
 * isBetweenDaysAgo(date, 31) // more than 30 days ago
 */
export function isBetweenDaysAgo(
  date: Date | string,
  minDaysAgo: number,
  maxDaysAgo?: number,
): boolean {
  // If maxDaysAgo is not provided, check if date is older than minDaysAgo
  if (maxDaysAgo === undefined) {
    return !isWithinLastDays(date, minDaysAgo)
  }

  // Special case: if minDaysAgo === maxDaysAgo, check exact day range
  if (minDaysAgo === maxDaysAgo) {
    if (minDaysAgo === 0) {
      // Today only - use calendar day check
      return isWithinLastDays(date, 0)
    }
    // Specific day range - must be within maxDaysAgo but not within (minDaysAgo - 1)
    return (
      isWithinLastDays(date, maxDaysAgo) &&
      !isWithinLastDays(date, minDaysAgo - 1)
    )
  }

  // Date must be within maxDaysAgo but not within (minDaysAgo - 1)
  // This makes both minDaysAgo and maxDaysAgo inclusive
  return (
    isWithinLastDays(date, maxDaysAgo) &&
    !isWithinLastDays(date, minDaysAgo - 1)
  )
}
