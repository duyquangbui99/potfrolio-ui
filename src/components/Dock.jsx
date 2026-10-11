// src/components/Dock.jsx
// macOS-style dock that slides up while the main window is minimized or closed.
import { useWindow } from '../context/WindowContext';
import appIcon from '../assets/images/meAvatar.webp';
import githubIcon from '../assets/images/githubIcon.svg';
import linkedinIcon from '../assets/images/linkedInIcon.svg';
import mailIcon from '../assets/images/email.svg';
import resumeIcon from '../assets/images/resume.svg';
import resumePdf from '../assets/Quang Bui - Resume.pdf';
import '../styles/window.css';

const shortcuts = [
    { label: 'GitHub', icon: githubIcon, href: 'https://github.com/duyquangbui99', external: true },
    { label: 'LinkedIn', icon: linkedinIcon, href: 'https://www.linkedin.com/in/duyquangbui99', external: true },
    { label: 'Email', icon: mailIcon, href: 'mailto:qbui011099@gmail.com' },
    { label: 'Resume PDF', icon: resumeIcon, href: resumePdf, download: 'Quang Bui - Resume.pdf' },
];

function Dock() {
    const { state, restore } = useWindow();
    const visible = ['minimizing', 'minimized', 'closing', 'closed'].includes(state);
    const running = state === 'minimizing' || state === 'minimized';

    return (
        <nav className={`dock ${visible ? 'dock-visible' : ''}`} aria-label="Dock" aria-hidden={!visible}>
            <button
                type="button"
                className={`dock-item dock-app ${running ? 'is-running' : ''}`}
                data-label={running ? 'quangbui.dev' : 'Open quangbui.dev'}
                onClick={restore}
                tabIndex={visible ? 0 : -1}
            >
                <img src={appIcon} alt="quangbui.dev" />
            </button>
            <span className="dock-divider" aria-hidden="true"></span>
            {shortcuts.map(item => (
                <a
                    key={item.label}
                    className="dock-item"
                    data-label={item.label}
                    href={item.href}
                    download={item.download}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    tabIndex={visible ? 0 : -1}
                >
                    <img src={item.icon} alt={item.label} />
                </a>
            ))}
        </nav>
    );
}

export default Dock;
