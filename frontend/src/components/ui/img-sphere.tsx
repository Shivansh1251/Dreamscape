import { useEffect, useMemo, useRef, useState } from 'react';

export interface SphereImage {
    id: string;
    src: string;
    alt: string;
    title?: string;
    description?: string;
}

interface SphereImageGridProps {
    images?: SphereImage[];
    containerSize?: number;
    sphereRadius?: number;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    className?: string;
}

/** Lightweight, dependency-free image sphere adapted from the supplied component. */
export function SphereImageGrid({ images = [], containerSize = 460, sphereRadius = 175, autoRotate = true, autoRotateSpeed = 0.18, className = '' }: SphereImageGridProps) {
    const [rotation, setRotation] = useState({ x: -8, y: 0 });
    const dragging = useRef(false);
    const pointer = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const move = (event: PointerEvent) => {
            if (!dragging.current) return;
            const dx = event.clientX - pointer.current.x;
            const dy = event.clientY - pointer.current.y;
            pointer.current = { x: event.clientX, y: event.clientY };
            setRotation((value) => ({ x: value.x - dy * 0.35, y: value.y + dx * 0.45 }));
        };
        const stop = () => { dragging.current = false; };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', stop);
        window.addEventListener('pointercancel', stop);
        return () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', stop);
            window.removeEventListener('pointercancel', stop);
        };
    }, []);

    useEffect(() => {
        if (!autoRotate || dragging.current) return;
        const timer = window.setInterval(() => setRotation((value) => ({ x: value.x + autoRotateSpeed * 0.22, y: value.y + autoRotateSpeed })), 32);
        return () => window.clearInterval(timer);
    }, [autoRotate, autoRotateSpeed]);

    const positions = useMemo(() => images.map((image, index) => {
        const t = images.length <= 1 ? 0.5 : index / (images.length - 1);
        const y = 1 - t * 2;
        const radius = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = Math.PI * (3 - Math.sqrt(5)) * index;
        return { image, x: Math.cos(theta) * radius * sphereRadius, y: y * sphereRadius, z: Math.sin(theta) * radius * sphereRadius };
    }), [images, sphereRadius]);

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        dragging.current = true;
        pointer.current = { x: event.clientX, y: event.clientY };
    };

    return <>
        <div className={`relative mx-auto select-none touch-none ${className}`} style={{ width: 'min(100%, 560px)', height: containerSize }} onPointerDown={onPointerDown}>
            <div className="absolute inset-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/40 blur-3xl" />
            {positions.map(({ image, x, y, z }) => {
                const angle = rotation.y * Math.PI / 180;
                const rotatedX = x * Math.cos(angle) + z * Math.sin(angle);
                const horizontalZ = -x * Math.sin(angle) + z * Math.cos(angle);
                const verticalAngle = rotation.x * Math.PI / 180;
                const rotatedY = y * Math.cos(verticalAngle) - horizontalZ * Math.sin(verticalAngle);
                const rotatedZ = y * Math.sin(verticalAngle) + horizontalZ * Math.cos(verticalAngle);
                const depth = (rotatedZ + sphereRadius) / (sphereRadius * 2);
                const scale = 0.68 + depth * 0.4;
                return <div key={image.id} className="absolute left-1/2 top-1/2 overflow-hidden rounded-full border-4 border-white shadow-xl" style={{ width: 78, height: 78, transform: `translate(-50%, -50%) translate(${rotatedX}px, ${rotatedY}px) scale(${scale})`, zIndex: Math.round(100 + rotatedZ), opacity: Math.max(0.38, 0.55 + depth * 0.45), willChange: 'transform' }}><img src={image.src} alt={image.alt} draggable={false} className="h-full w-full object-cover" loading="lazy" /></div>;
            })}
        </div>
    </>;
}
