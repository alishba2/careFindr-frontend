import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Heart, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import logo from "../../assets/logo.png";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    let userType = localStorage.getItem("userType");

    // Fetch token from localStorage on component mount
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
        setLoading(false);
    }, []);

    // Handle scrolling when coming from external pages
    useEffect(() => {
        // Check if there's a hash in the URL when component mounts or location changes
        if (location.pathname === '/' && location.hash) {
            const sectionId = location.hash.substring(1); // Remove the '#' from hash
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                element?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [location]);

    const scrollToSection = (sectionId) => {
        setIsMenuOpen(false);

        // If not on home page, navigate to home with hash
        if (location.pathname !== '/') {
            navigate(`/#${sectionId}`);
            return;
        }

        // If already on home page, scroll directly
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
        // Update URL hash without triggering navigation
        window.history.replaceState(null, null, `#${sectionId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.clear();
        setToken(null);
        setIsMenuOpen(false);

        // Redirect based on user type
        if (userType === "admin") {
            navigate("/admin-access-0923");
        } else {
            navigate("/login");
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const getDashboardPath = () => {
        if (userType === "admin") {
            return "/admin-dashboard/home";
        }
        return "/facility-dashboard/home";
    };

    const navItems = [
        { label: "Features", id: "features", type: "scroll" },
        { label: "How It Works", id: "how-it-works", type: "scroll" },
        { label: "Benefits", id: "benefits", type: "scroll" },
        { label: "Testimonials", id: "hospitals", type: "scroll" },
        { label: "FAQ", id: "faq", type: "scroll" },
        { label: "Blog", id: "/blog", type: "navigate" },
    ];

    // Don't show menu items for admin users
    const shouldShowMenuItems = userType !== "admin";

    const handleNavItemClick = (item) => {
        if (item.type === "navigate") {
            handleNavigation(item.id);
        } else {
            scrollToSection(item.id);
        }
    };

    if (loading) {
        return null;
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Home */}
                    <div className="flex items-center">
                        <div className="flex items-center flex-shrink-0">
                            <div
                                className="md:text-2xl text-lg font-bold text-primarysolid cursor-pointer"
                                onClick={() => navigate("/")}
                            >
                                <img
                                    src={logo}
                                    className="h-10 md:h-10 h-8 mr-2"
                                    alt="CareFindr Logo"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation - Only show for non-admin users */}
                    {shouldShowMenuItems && (
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavItemClick(item)}
                                        className="text-gray-700 hover:text-primarysolid px-3 py-2 text-sm font-medium transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Desktop Right Side Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        {token ? (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="text-primarysolid hover:primarysolid"
                                >
                                    Logout
                                </Button>
                                <Button
                                    onClick={() => navigate(getDashboardPath())}
                                    className="bg-primarysolid md:text-sm hover:bg-primarysolid text-white shadow-sm"
                                >
                                    Dashboard
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/login")}
                                    className="text-primarysolid hover:primarysolid"
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={() => navigate("/register")}
                                    className="bg-primarysolid md:text-sm hover:bg-primarysolid text-white shadow-sm"
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Right Side - Auth Buttons + Menu Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        {/* Authentication Buttons for Mobile */}
                        {token ? (
                            <>
                                <Button
                                    onClick={() => navigate(getDashboardPath())}
                                    className="bg-primarysolid text-xs px-2 py-1.5 hover:bg-primarysolid text-white shadow-sm"
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="text-red-600 hover:text-red-800 text-xs px-2 py-1.5"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/login")}
                                    className="text-primarysolid hover:primarysolid text-xs px-2 py-1.5"
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={() => navigate("/register")}
                                    className="bg-primarysolid text-xs px-2 py-1.5 hover:bg-primarysolid text-white shadow-sm"
                                >
                                    Get Started
                                </Button>
                            </>
                        )}

                        {/* Menu Toggle - Show only when there are nav items for non-admin users */}
                        {shouldShowMenuItems && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:primarysolid p-1"
                            >
                                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation - Show when menu is open AND there are items to show */}
                {isMenuOpen && shouldShowMenuItems && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
                            {/* Navigation Items - Only show for non-admin users */}
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavItemClick(item)}
                                    className="text-gray-700 hover:text-primarysolid block px-3 py-2 text-base font-medium w-full text-left transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}