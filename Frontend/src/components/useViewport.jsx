import { useState, useEffect } from 'react'

export const useViewport = () => {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth)
        
        window.addEventListener('resize', handleWindowResize)
        return () => window.removeEventListener('resize', handleWindowResize)
    }, [])

    return { width, isMobile: width < 768, isTablet: width >= 768 && width < 1024, isDesktop: width >= 1024 }
}