// src/context/WindowContext.js
// Shared state for the macOS-style window controls (the red/yellow/green dots).
//
//   open ──close──▶ closing ──▶ closed ──restore──▶ restoring ──▶ open
//   open ──minimize──▶ minimizing ──▶ minimized ──restore──▶ restoring ──▶ open
//   open ◀──fullscreen──▶ fullscreen
//
// The *-ing states play a CSS animation on the panel; onAnimationEnd advances them.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const WindowContext = createContext(null);

const DOCK_OFFSET = 44; // px from the bottom of the viewport to the dock's center

export function WindowProvider({ children }) {
    const [state, setState] = useState('open');
    const stateRef = useRef(state);
    stateRef.current = state;
    const panelRef = useRef(null);
    const location = useLocation();

    // Point the panel's transform-origin at a spot in the viewport,
    // so it shrinks toward the dock (minimize) or the screen center (close).
    const aimPanelAt = useCallback((viewportY) => {
        const panel = panelRef.current;
        if (!panel) return;
        window.scrollTo({ top: 0, behavior: 'instant' });
        const rect = panel.getBoundingClientRect();
        panel.style.transformOrigin = `${window.innerWidth / 2 - rect.left}px ${viewportY - rect.top}px`;
    }, []);

    const exitBrowserFullscreen = () => {
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => { });
        }
    };

    const close = useCallback(() => {
        exitBrowserFullscreen();
        aimPanelAt(window.innerHeight / 2);
        setState('closing');
    }, [aimPanelAt]);

    const minimize = useCallback(() => {
        exitBrowserFullscreen();
        aimPanelAt(window.innerHeight - DOCK_OFFSET);
        setState('minimizing');
    }, [aimPanelAt]);

    const restore = useCallback(() => {
        setState(s => (s === 'minimized' || s === 'closed' ? 'restoring' : s));
    }, []);

    const toggleFullscreen = useCallback(() => {
        const s = stateRef.current;
        if (s === 'fullscreen') {
            exitBrowserFullscreen();
            setState('open');
        } else if (s === 'open') {
            // Go truly fullscreen where the browser allows it (not iOS Safari)
            if (document.fullscreenEnabled && !document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => { });
            }
            setState('fullscreen');
        }
    }, []);

    const onPanelAnimationEnd = useCallback((e) => {
        if (e.target !== e.currentTarget) return; // ignore animations bubbling from children
        setState(s => ({ minimizing: 'minimized', closing: 'closed', restoring: 'open' }[s] || s));
    }, []);

    // Leaving browser fullscreen (Esc, F11, etc.) also leaves window fullscreen
    useEffect(() => {
        const onChange = () => {
            if (!document.fullscreenElement) setState(s => (s === 'fullscreen' ? 'open' : s));
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setState(s => (s === 'fullscreen' ? 'open' : s));
        };
        document.addEventListener('fullscreenchange', onChange);
        window.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('fullscreenchange', onChange);
            window.removeEventListener('keydown', onKey);
        };
    }, []);

    // Navigating anywhere brings the window back
    useEffect(() => {
        const s = stateRef.current;
        if (s === 'fullscreen') {
            exitBrowserFullscreen();
            setState('open');
        } else if (s !== 'open') {
            setState('restoring');
        }
    }, [location.key]);

    const value = {
        state,
        close,
        minimize,
        restore,
        toggleFullscreen,
        panelProps: {
            ref: panelRef,
            onAnimationEnd: onPanelAnimationEnd,
            windowClass: `window-panel window-${state}`,
        },
    };

    return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}

export function useWindow() {
    return useContext(WindowContext);
}
