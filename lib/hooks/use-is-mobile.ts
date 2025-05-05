import { useState, useEffect } from 'react'

/**
 * Hook to detect if the current viewport is mobile-sized
 * @param breakpoint - The width in pixels below which we consider the device to be mobile
 * @returns boolean indicating if the viewport is mobile-sized
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if window width is less than breakpoint
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on mount
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [breakpoint])

  return isMobile
}
