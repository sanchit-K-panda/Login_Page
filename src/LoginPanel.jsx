import { useState, useCallback } from 'react';
import { authenticate } from './auth';
import { submitToFirestore } from './sheetsApi';

const OPERATIVES = ['01', '02', '03', '04'];

export default function LoginPanel({ onAuthResult }) {
    const [teamId, setTeamId] = useState('');
    const [operatives, setOperatives] = useState(
        OPERATIVES.map((id) => ({ id, nickname: '', serial: '', email: '' }))
    );
    const [authState, setAuthState] = useState(null); // 'success' | 'failure' | null
    const [authMessage, setAuthMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const updateOperative = useCallback((index, field, value) => {
        setOperatives((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (isProcessing) return;

            setIsProcessing(true);

            // Simulate brief processing delay for dramatic effect
            setTimeout(() => {
                const result = authenticate(teamId, operatives);

                setAuthState(result.success ? 'success' : 'failure');
                setAuthMessage(result.message);
                onAuthResult(result.success);

                // Save to Firestore on success
                if (result.success) {
                    submitToFirestore(teamId, operatives);
                }

                // Clear auth state after display
                setTimeout(() => {
                    if (!result.success) {
                        setAuthState(null);
                        setAuthMessage('');
                    }
                    setIsProcessing(false);
                }, result.success ? 5000 : 2500);
            }, 600);
        },
        [teamId, operatives, isProcessing, onAuthResult]
    );

    const panelClasses = [
        'login-panel',
        authState === 'failure' ? 'shake red-flash' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <div className="login-panel-wrapper">
                <form className={panelClasses} onSubmit={handleSubmit} autoComplete="off">
                    {/* ── Header ── */}
                    <div className="panel-header">
                        <span className="panel-header-icon">⬡</span>
                        <h1>
                            REGISTER_NEW_TEAM
                            <span className="cursor-blink" />
                        </h1>
                        <p className="sub-text">// Secure authentication portal v2.7</p>
                    </div>

                    <div className="cyber-divider" />

                    {/* ── Team Identifier ── */}
                    <div className="form-group">
                        <label>
                            <span className="label-icon">›</span>
                            TEAM_IDENTIFIER
                        </label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="cyber-input"
                                placeholder="Enter team codename..."
                                value={teamId}
                                onChange={(e) => setTeamId(e.target.value)}
                                spellCheck={false}
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="cyber-divider" />

                    {/* ── Operatives ── */}
                    <div className="operative-section">
                        <div className="operative-section-title">
                            Operative Registry
                        </div>

                        {operatives.map((op, idx) => (
                            <div className="operative-card" key={op.id}>
                                <div className="operative-card-header">
                                    <span className="op-dot" />
                                    OPERATIVE_{op.id}
                                </div>
                                <div className="operative-fields">
                                    <div className="form-group">
                                        <label>
                                            <span className="label-icon">›</span>
                                            Nickname
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                className="cyber-input"
                                                placeholder="Callsign..."
                                                value={op.nickname}
                                                onChange={(e) =>
                                                    updateOperative(idx, 'nickname', e.target.value)
                                                }
                                                spellCheck={false}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <span className="label-icon">›</span>
                                            Serial / USN
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                className="cyber-input"
                                                placeholder="ID-XXXX..."
                                                value={op.serial}
                                                onChange={(e) =>
                                                    updateOperative(idx, 'serial', e.target.value)
                                                }
                                                spellCheck={false}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group operative-email">
                                        <label>
                                            <span className="label-icon">›</span>
                                            Email
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="email"
                                                className="cyber-input"
                                                placeholder="operative@domain.com..."
                                                value={op.email}
                                                onChange={(e) =>
                                                    updateOperative(idx, 'email', e.target.value)
                                                }
                                                spellCheck={false}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Submit ── */}
                    <div className="submit-btn-wrapper">
                        <button
                            type="submit"
                            className="cyber-submit-btn"
                            disabled={isProcessing}
                        >
                            {isProcessing ? '◈ PROCESSING...' : '◈ INITIATE_AUTH'}
                        </button>
                    </div>

                    {/* ── Status Bar ── */}
                    <div className="panel-status-bar">
                        <span>
                            <span className="status-dot" />
                            System Online
                        </span>
                        <span>Encryption: AES-256</span>
                        <span>Node: CY-7X</span>
                    </div>
                </form>
            </div>

            {/* ── Auth Result Overlay ── */}
            {authState && (
                <div
                    className={`auth-overlay ${authState === 'success' ? 'success-overlay' : 'failure-overlay'
                        }`}
                >
                    <div className={`auth-message ${authState}`}>{authMessage}</div>
                </div>
            )}
        </>
    );
}
