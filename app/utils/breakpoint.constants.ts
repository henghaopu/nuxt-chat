// Tailwind CSS default breakpoints
// Reference: https://tailwindcss.com/docs/responsive-design

export const BREAKPOINTS = {
  SM: 640, // @media (min-width: 640px) - landscape phones
  MD: 768, // @media (min-width: 768px) - tablets
  LG: 1024, // @media (min-width: 1024px) - desktops
  XL: 1280, // @media (min-width: 1280px) - large desktops
  XXL: 1536, // @media (min-width: 1536px) - extra large desktops
} as const

// Semantic aliases for better readability
export const MOBILE_BREAKPOINT = BREAKPOINTS.SM // Show sidebar on tablet and up
export const TABLET_BREAKPOINT = BREAKPOINTS.MD
export const DESKTOP_BREAKPOINT = BREAKPOINTS.LG

// Helper functions for responsive logic
export const isTabletAndUp = (width: number) => width >= TABLET_BREAKPOINT
export const isDesktopAndUp = (width: number) => width >= DESKTOP_BREAKPOINT
export const isMobile = (width: number) => width < TABLET_BREAKPOINT

// Device type detector
export const getDeviceType = (width: number) => {
  if (width < TABLET_BREAKPOINT) return 'mobile'
  if (width < DESKTOP_BREAKPOINT) return 'tablet'
  return 'desktop'
}
