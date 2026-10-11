// src/components/WindowBar.jsx
import { useWindow } from '../context/WindowContext';

function WindowBar({ url }) {
    const { state, close, minimize, toggleFullscreen } = useWindow();
    const isFullscreen = state === 'fullscreen';

    return (
        <div className="window-bar" onDoubleClick={toggleFullscreen}>
            <div className="window-dots" onDoubleClick={(e) => e.stopPropagation()}>
                <button type="button" className="window-dot dot-close" onClick={close} aria-label="Close window" title="Close">
                    <svg viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />
                    </svg>
                </button>
                <button type="button" className="window-dot dot-minimize" onClick={minimize} aria-label="Minimize window" title="Minimize">
                    <svg viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M3 6h6" />
                    </svg>
                </button>
                <button
                    type="button"
                    className="window-dot dot-fullscreen"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
                    aria-pressed={isFullscreen}
                    title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
                >
                    <svg viewBox="0 0 12 12" aria-hidden="true">
                        {isFullscreen ? (
                            <path className="glyph-fill" d="M2.5 6.5h3v3zM9.5 5.5h-3v-3z" />
                        ) : (
                            <path className="glyph-fill" d="M3 3h4L3 7zM9 9H5l4-4z" />
                        )}
                    </svg>
                </button>
            </div>
            <p className="window-url">{url}</p>
        </div>
    );
}

export default WindowBar;
