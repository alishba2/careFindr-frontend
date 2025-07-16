import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Heart, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hook/auth";
import icon from "../../assets/vector2.png";
import icon2 from "../../assets/Vector.png";
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
            navigate("/admin-login");
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
        { label: "How It Works", id: "how-it-works" },
        { label: "Benefits", id: "benefits" },
        { label: "Hospitals", id: "hospitals" },
        { label: "FAQ", id: "faq" },
    ];

    // Don't show menu items for admin users
    const shouldShowMenuItems = userType !== "admin";

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
                                <img src={logo} className="h-10 mr-2" alt="CareFindr Logo" />
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
                                        onClick={() => scrollToSection(item.id)}
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

                    {/* Mobile Menu Toggle - Only show if there are menu items or user is not logged in */}
                    {(shouldShowMenuItems || !token) && (
                        <div className="md:hidden ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:primarysolid"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation - Only show for non-admin users */}
                {isMenuOpen && (shouldShowMenuItems || !token) && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
                            {/* Navigation Items - Only show for non-admin users */}
                            {shouldShowMenuItems && navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-gray-700 hover:text-primarysolid block px-3 py-2 text-base font-medium w-full text-left transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}

                            {/* Authentication Buttons in Mobile Menu */}
                            <div className={`border-t border-gray-200 pt-3 ${shouldShowMenuItems ? 'mt-3' : ''}`}>
                                {token ? (
                                    <>
                                        <button
                                            onClick={() => handleNavigation(getDashboardPath())}
                                            className="bg-primarysolid text-white block px-3 py-2 text-base font-medium w-full text-left rounded-md mb-2 hover:bg-primarysolid/90 transition-colors"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="text-red-600 hover:text-red-800 block px-3 py-2 text-base font-medium w-full text-left transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleNavigation("/login")}
                                            className="text-primarysolid hover:text-primarysolid/80 block px-3 py-2 text-base font-medium w-full text-left transition-colors"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => handleNavigation("/register")}
                                            className="bg-primarysolid text-white block px-3 py-2 text-base font-medium w-full text-left rounded-md mt-2 hover:bg-primarysolid/90 transition-colors"
                                        >
                                            Get Started
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}