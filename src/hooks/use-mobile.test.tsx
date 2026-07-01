import {afterEach, describe, expect, it} from 'vitest';
import {renderHook} from '@testing-library/react';
import {useIsMobile} from '@/hooks/use-mobile';
import {useIsClient} from '@/hooks/use-is-client';

const originalWidth = window.innerWidth;

function setWidth(width: number) {
    Object.defineProperty(window, 'innerWidth', {configurable: true, writable: true, value: width});
}

afterEach(() => {
    setWidth(originalWidth);
});

describe('useIsMobile', () => {
    it('is false for a desktop-width viewport', () => {
        setWidth(1200);
        const {result} = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('is true below the 768px breakpoint', () => {
        setWidth(500);
        const {result} = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });
});

describe('useIsClient', () => {
    it('reports true once mounted on the client', () => {
        const {result} = renderHook(() => useIsClient());
        expect(result.current).toBe(true);
    });
});
