const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000 // 24 hours × 60 minutes × 60 seconds × 1000ms

/**
 * Check if a date is within the last specified number of days
 *
 * Note: This function measures 24-hour periods, not calendar days.
 * For example, if it's currently 2 PM and you check a date from yesterday at 10 AM,
 * that's considered 1.17 days ago (28 hours / 24).
 *
 * @param date - The date to check (should be in the past or today)
 * @param days - Number of days (24-hour periods) to look back from today
 * @returns true if the date is within the last N days (past dates only)
 *
 * @example
 * Assuming current date is September 12, 2025 at 2:00 PM
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
export function isWithinLastDays(date: Date, days: number): boolean {
  const currentDate = new Date()

  if (date > currentDate) return false // silent fail

  const diffTimestamp = currentDate.getTime() - date.getTime()
  const diffDays = diffTimestamp / MILLISECONDS_PER_DAY

  return diffDays <= days
}

/**
 * Check if a date falls between a specific range of days ago
 *
 * @param date - The date to check
 * @param minDaysAgo - Minimum days ago (closer to today). 0 means today.
 * @param maxDaysAgo - Maximum days ago (further from today). If undefined, means "older than minDaysAgo"
 * @returns true if the date falls between the specified days ago range
 *
 * @example
 * Today to yesterday
 * isBetweenDaysAgo(date, 0, 1) // 0-1 days ago
 *
 * Yesterday to last week
 * isBetweenDaysAgo(date, 1, 7) // 1-7 days ago
 *
 * Last week to last month
 * isBetweenDaysAgo(date, 7, 30) // 7-30 days ago
 *
 * Older than 30 days
 * isBetweenDaysAgo(date, 30) // more than 30 days ago
 */
export function isBetweenDaysAgo(
  date: Date,
  minDaysAgo: number,
  maxDaysAgo?: number,
): boolean {
  // If maxDaysAgo is not provided, check if date is older than minDaysAgo
  if (maxDaysAgo === undefined) {
    return !isWithinLastDays(date, minDaysAgo)
  }

  // Date must be within maxDaysAgo but NOT within minDaysAgo
  return (
    isWithinLastDays(date, maxDaysAgo) && !isWithinLastDays(date, minDaysAgo)
  )
}
