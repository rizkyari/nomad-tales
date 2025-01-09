import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logoutUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const handleLogout = () => {
        logoutUser(dispatch);
        navigate('/login');
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    /**
    * Toggles the visibility of the mobile dropdown menu.
    */
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    /**
    * Closes the mobile dropdown menu if a click occurs outside of it.
    * @param {MouseEvent} event - The mouse event triggered by clicking outside.
    */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="w-full bg-dark text-light px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold flex items-center">
            <img src="/nomad-logo.png" alt="Nomad Tales" className="h-8 mr-2" />
            Nomad Tales
        </div>

        <nav ref={menuRef}>
            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center space-x-6">
                <li>
                    <a href="/" className="hover:text-accent">Home</a>
                </li>
                <li>
                    <a href="/about" className="hover:text-accent">About</a>
                </li>
                <li>
                    <a href="/articles" className="hover:text-accent">Articles</a>
                </li>
                <li>
                    <a href="/contact" className="hover:text-accent">Contact</a>
                </li>
                {isAuthenticated ? (
                <li>
                    <button onClick={handleLogout} className="bg-accent text-light px-4 py-2 rounded hover:bg-dark">
                        Logout
                    </button>
                </li>
            ) : (
                <>
                    <li>
                        <a href="/login" className="hover:text-accent">Login</a>
                    </li>
                    <li>
                        <a href="/register" className="hover:text-accent">Register</a>
                    </li>
                </>
          )}
            </ul>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="md:hidden text-accent" aria-label="Toggle menu">
                ☰
            </button>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
            <ul className="absolute top-16 left-0 w-full bg-dark text-light space-y-4 py-4 px-6 md:hidden">
                <li>
                    <a href="/" className="block hover:text-accent">Home</a>
                </li>
                <li>
                    <a href="/about" className="block hover:text-accent">About</a>
                </li>
                <li>
                    <a href="/articles" className="block hover:text-accent">Articles</a>
                </li>
                <li>
                    <a href="/contact" className="block hover:text-accent">Contact</a>
                </li>
                {isAuthenticated ? (
                <li>
                    <button onClick={handleLogout} className="block bg-accent text-light px-4 py-2 rounded hover:bg-dark w-full text-left">
                        Logout
                    </button>
                </li>
                ) : (
                <>
                    <li>
                        <a href="/login" className="block hover:text-accent">Login</a>
                    </li>
                    <li>
                        <a href="/register" className="block hover:text-accent">Register</a>
                    </li>
                </>
                )}
            </ul>
            )}
        </nav>
    </header>
  );
};

export default Header;
