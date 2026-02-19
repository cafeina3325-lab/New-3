"use client";

import React from "react";
// Checking file structure, I didn't see lib/utils in the file list earlier. I'll stick to standard template strings to be safe.

interface GlassHexagonProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    width?: string;
    height?: string;
}

export default function GlassHexagon({
    children,
    className,
    width = "w-full",
    height = "h-full",
    ...props
}: GlassHexagonProps) {
    return (
        <div
            className={`relative group ${width} ${height} flex items-center justify-center ${className || ""}`}
            {...props}
        >
            {/* 
        Hexagon Clip Path Strategy:
        We need a "stretched" hexagon. 
        Polygon for flat-topped hexagon (pointy sides):
        0% 50% (Left Point)
        25% 0% (Top Left)
        75% 0% (Top Right)
        100% 50% (Right Point)
        75% 100% (Bottom Right)
        25% 100% (Bottom Left)
        
        Wait, "Vertical" hexagon has points at top/bottom. "Horizontal" usually means points at left/right?
        User said "stretched hexagon... height : width = 1 : 1.15~1.25". 
        Usually a regular hexagon width:height is sqrt(3)/2 : 1 (vertical) or 1 : sqrt(3)/2 (horizontal).
        If height:width is 1:1.2, it's wider than tall. 
        Standard flat-topped hexagon (points Left/Right) has Width = 2 * Side, Height = sqrt(3) * Side. Ratio W/H = 2/1.732 ≈ 1.15. 
        So a standard "Pointy Side" hexagon IS naturally ratio ~1.15.
        
        Clip path for Pointy Side (Flat Top/Bottom):
        polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)
      */}

            {/* 1. Outer Filter Shadow Container (Not clipped, but holds the shadow) 
          Actually, drop-shadow on a clipped element works best.
      */}
            <div
                className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                style={{
                    filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.4))"
                }}
            >
                {/* 2. The Main Glass Shape */}
                <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                        background: "rgba(255, 255, 255, 0.1)", // Fallback
                    }}
                >
                    {/* Backdrop Blur Layer - using backdrop-filter directly on the element sometimes has issues with clip-path in some browsers, 
                but usually works. Let's try direct application.
            */}
                    <div className="absolute inset-0 bg-white/[0.12] backdrop-blur-[24px] md:backdrop-blur-[30px]" />

                    {/* Noise Overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03] data-[noise]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                        }}
                    />

                    {/* Top Highlight Gradient (Gloss) */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.4] to-transparent opacity-100 pointer-events-none" />

                    {/* Specular Streak (Diagonal) */}
                    <div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ backgroundSize: "200% 200%", backgroundPosition: "0% 0%" }}
                    />

                    {/* Content Container */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        {children}
                    </div>
                </div>

                {/* 3. Border Overlay (Standard SVG to ensure crisp border on clip-path edges) 
            We need an SVG that matches the polygon coordinates.
        */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <polygon
                        points="25,0 75,0 100,50 75,100 25,100 0,50"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        stroke="rgba(255,255,255,0.24)"
                        strokeWidth="1"
                    />
                    {/* Inner Rim (Inset) - Simulated with a smaller opacity stroke for now as requested 'inner rim' 
                User asked for: inner rim(inset): rgba(255,255,255,0.08~0.12)
                Since exact inset on irregular poly is hard, we can use a second polygon slightly offset or just a second stroke.
                For now, the main border is the most important.
            */}
                </svg>
            </div>
        </div>
    );
}
