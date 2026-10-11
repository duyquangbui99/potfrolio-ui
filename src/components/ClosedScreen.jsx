// src/components/ClosedScreen.jsx
// What's left on the "desktop" after the red dot closes the window.
import { useWindow } from '../context/WindowContext';
import CareerRunner from './CareerRunner';
import '../styles/window.css';

function ClosedScreen() {
    const { restore } = useWindow();

    return (
        <section className="closed-screen" aria-live="polite">
            <h1 className="hero-name">See you<br />around.</h1>
            <p className="hero-role">thanks for stopping by.</p>
            <div className="closed-actions">
                <button type="button" className="closed-btn closed-btn-primary" onClick={restore} autoFocus>
                    Reopen quangbui.dev
                </button>
                <a className="closed-btn" href="mailto:qbui011099@gmail.com">
                    Say hello
                </a>
            </div>
            <CareerRunner />
        </section>
    );
}

export default ClosedScreen;
