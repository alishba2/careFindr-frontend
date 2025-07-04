import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Heart, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hook/auth";
import icon from "../../assets/vector2.png";
import icon2 from "../../assets/Vector.png";

export default function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch token from localStorage on component mount
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
        setLoading(false);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
    };

    const navItems = [
        { label: "How It Works", id: "how-it-works" },
        { label: "Benefits", id: "benefits" },
        { label: "Hospitals", id: "hospitals" },
        { label: "FAQ", id: "faq" },
    ];

    if (loading) {
        // Optionally, render a placeholder or nothing to avoid flickering
        return null;
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Home */}
                    <div className="flex items-center">
                        <div className="flex items-center flex-shrink-0">
                            <Heart className="md:w-10 md:h-10 w-8 h-8 mr-2 text-primarysolid" />
                            <div
                                className="md:text-2xl text-lg font-bold text-primarysolid cursor-pointer"
                                onClick={() => navigate("/")}
                            >
                                CareFindr
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
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

                    {/* Right Side Buttons */}
                    {token ? (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.clear();
                                    setToken(null);
                                    navigate("/login");
                                }}
                                className="text-primarysolid hover:primarysolid"
                            >
                                Logout
                            </Button>
                            <Button
                                onClick={() => navigate("/facility-dashboard/home")}
                                className="bg-primarysolid md:text-sm hover:bg-primarysolid text-white shadow-sm"
                            >
                                Dashboard
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
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
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
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
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-gray-700 hover:primarysolid block px-3 py-2 text-base font-medium w-full text-left"
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

