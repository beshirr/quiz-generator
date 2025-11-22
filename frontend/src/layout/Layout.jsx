import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, Outlet, Navigate, useLocation } from "react-router-dom";
import './Layout.css';

export function Layout() {
    const location = useLocation();
    
    return (
        <div className="layout">
            <div className="layout-background-glow"></div>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-brand">
                        <Link to="/" className="brand-link">
                            <span className="brand-text">QuizGen</span>
                        </Link>
                    </div>
                    
                    <div className="navbar-nav">
                        <SignedIn>
                            <Link 
                                to="/" 
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                            >
                                Generator
                            </Link>
                            <Link 
                                to="/history" 
                                className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
                            >
                                History
                            </Link>
                        </SignedIn>
                    </div>
                    
                    <div className="navbar-auth">
                        <SignedIn>
                            <div className="user-profile-wrapper">
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "user-avatar-box",
                                            userButtonPopoverCard: "user-popover-card"
                                        }
                                    }}
                                />
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <Link to="/sign-in" className="sign-in-link">
                                <span>Sign In</span>
                                <div className="glow-effect"></div>
                            </Link>
                        </SignedOut>
                    </div>
                </div>
            </nav>
            
            <main className="main-content">
                <div className="content-container">
                    <SignedIn>
                        <Outlet />
                    </SignedIn>
                    <SignedOut>
                        <Navigate to="/sign-in" replace />
                    </SignedOut>
                </div>
            </main>
        </div>
    );
}
