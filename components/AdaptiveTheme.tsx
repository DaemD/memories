'use client';

import { usePalette } from 'react-palette';
import { useEffect, useRef } from 'react';

interface AdaptiveThemeProps {
    imageUrl: string;
    children: React.ReactNode;
}

export function AdaptiveTheme({ imageUrl, children }: AdaptiveThemeProps) {
    const { data, loading, error } = usePalette(imageUrl);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (data && containerRef.current) {
            // We want a dark/cozy vibe, so we prefer darkMuted or darkVibrant for background
            const bg = data.darkMuted || '#1C1917';
            const fg = data.lightVibrant || data.vibrant || '#E7E5E4';
            const accent = data.vibrant || data.lightMuted || '#D4C5B0';

            containerRef.current.style.setProperty('--adaptive-bg', bg);
            containerRef.current.style.setProperty('--adaptive-fg', fg);
            containerRef.current.style.setProperty('--adaptive-accent', accent);

            // Also set a muted version for borders/secondary
            containerRef.current.style.setProperty('--adaptive-muted', data.muted || '#8C7B6C');
        }
    }, [data]);

    return (
        <div
            ref={containerRef}
            className="h-full w-full transition-colors duration-1000 ease-in-out"
            style={{
                backgroundColor: 'var(--adaptive-bg, #1C1917)',
                color: 'var(--adaptive-fg, #E7E5E4)',
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
}
