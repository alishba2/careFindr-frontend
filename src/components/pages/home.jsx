import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Navbar from "./navbar";
import Footer from "./footer";
import doc from "../../assets/doc.jpg";
import {
    Heart,
    Shield,
    Clock,
    Search,
    Hospital,
    CheckCircle,
    Star,
    ArrowRight,
    Users,
    TrendingUp,
    Award,
    FlaskConical,
    Pill,
    Droplets,
    Sparkles,
    User, 
    Building2, 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HealthBg from "../../assets/Health.jpg"
export default function Landing() {
    // const [location, setLocation] = useLocation();

    const navigate = useNavigate();
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            {/* AI-Powered Healthcare Matching Badge */}
                            <div className="mb-6">
                                <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg border border-gray-100">
                                    <Sparkles className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">
                                        AI-Powered Healthcare Matching
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Find Trusted Healthcare.{" "}
                                <span className="text-primarysolid">Fast.</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                                From hospitals to diagnostic labs, pharmacies, blood banks and HMOs  — all connected through intelligent matching that learns and adapts to provide the best care outcomes.                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="px-8 py-4 text-lg font-semibold shadow-lg bg-[#359DF4] hover:bg-[#359DF4] hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                    onClick={() => navigate("/register")}
                                >
                                    Join as Facility
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-4 text-lg font-semibold border-2 border-primarysolid text-primarysolid hover:bg-primarysolid hover:text-white"
                                    onClick={() => scrollToSection("how-it-works")}
                                >
                                    Get Started as Patient
                                </Button>
                            </div>
                            <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-success mr-2 text-[#10B77F]" />
                                    Verified Hospitals
                                </div>
                                <div className="flex items-center">
                                    <Shield className="w-4 h-4 text-success mr-2 text-[#10B77F]" />
                                    Secure Platform
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-success mr-2 text-[#10B77F]" />
                                    24/7 Support
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src={doc}
                                alt="African medical professionals collaborating"
                                className="rounded-2xl shadow-2xl w-full h-auto"
                            />
                            <Card className="absolute -bottom-6 -left-6 bg-white shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-[#10B77F] rounded-full flex items-center  justify-center">
                                            <Hospital className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">500+ Hospitals</div>
                                            <div className="text-sm text-gray-500">Verified Partners</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features"  className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Verified Healthcare Facilities
                        </h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                            Connect with trusted healthcare providers across Africa through our AI-powered platform
                        </p>
                    </div>

                    {/* Desktop Layout - All in one row */}
                    <div className="hidden md:grid md:grid-cols-5 gap-8 mb-16 md:block">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Hospital className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Hospitals and Clinics
                            </h3>
                            <p className="text-sm text-gray-600">
                                General and specialized hospital care
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FlaskConical className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Diagnostic Labs
                            </h3>
                            <p className="text-sm text-gray-600">
                                Advanced laboratory testing services
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Pill className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Pharmacies
                            </h3>
                            <p className="text-sm text-gray-600">
                                Prescription and medication services
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Droplets className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Blood Banks
                            </h3>
                            <p className="text-sm text-gray-600">
                                Blood collection, testing, and storage centers
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Health Insurance
                            </h3>
                            <p className="text-sm text-gray-600">
                                Coverage providers and health plans
                            </p>
                        </div>
                    </div>

                    {/* Mobile Layout - 2-2-1 structure */}
                    <div className="md:hidden">
                        {/* First row - 2 items */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="text-center">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Hospital className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-2">
                                    Hospitals and Clinics
                                </h3>
                                <p className="text-sm text-gray-600">
                                    General and specialized hospital care
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <FlaskConical className="w-7 h-7 text-green-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-2">
                                    Diagnostic Labs
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Advanced laboratory testing services
                                </p>
                            </div>
                        </div>

                        {/* Second row - 2 items */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="text-center">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Pill className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-2">
                                    Pharmacies
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Prescription and medication services
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Droplets className="w-7 h-7 text-red-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-2">
                                    Blood Banks
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Blood collection, testing, and storage centers
                                </p>
                            </div>
                        </div>

                        {/* Third row - 1 item centered */}
                        <div className="flex justify-center">
                            <div className="text-center">
                                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Shield className="w-7 h-7 text-orange-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-2">
                                    Health Insurance
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Coverage providers and health plans
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards Section */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="bg-blue-50 rounded-2xl p-8 text-center">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                AI-Powered Matching
                            </h3>
                            <p className="text-gray-600">
                                Intelligent algorithms match patients with the most suitable facilities based on condition, location, and urgency.
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-2xl p-8 text-center">
                            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Verified Providers
                            </h3>
                            <p className="text-gray-600">
                                All healthcare facilities undergo rigorous verification to ensure quality and compliance with medical standards.
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-2xl p-8 text-center">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Real-Time Availability
                            </h3>
                            <p className="text-gray-600">
                                Live updates on facility availability, appointment slots, and emergency capacity across the network.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Smart, Secure , and Personalized Healthcare Referrals                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            In three simple steps
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primarysolid group-hover:text-white transition-all">
                                <Search className="w-8 h-8 text-primarysolid group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Search or Refer a Patient Using AI-Powered Matching
                            </h3>
                            <p className="text-gray-600">
                                Our system intelligently matches patients with the most suitable facility based on condition, location, and urgency. Simply input patient details and let AI do the work.
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-success group-hover:text-white transition-all">
                                <Hospital className="w-8 h-8 text-success group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Review Matched Facilities
                            </h3>
                            <p className="text-gray-600">
                                Browse through verified healthcare facilities ranked by relevance, availability, and quality ratings. Compare options and select the best fit.
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <Shield className="w-8 h-8 text-purple-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Complete Secure Referral
                            </h3>
                            <p className="text-gray-600">
                                Send encrypted referral information instantly with automated follow-up tracking to the selected facility, and receive real-time confirmation and updates—ensuring improved patient care through coordinated healthcare delivery and reduced wait times.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left side - Image */}
                        <div className="relative">
                            <img
                                src={HealthBg}
                                alt="AI technology dashboard in healthcare"
                                className="rounded-2xl shadow-2xl w-full h-auto"
                            />

                        </div>

                        {/* Right side - Content */}
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                AI-Powered Intelligence
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Our advanced AI analyzes over 50 data points including patient condition,
                                facility specialization, current capacity, location proximity, and historical
                                outcomes to ensure optimal matches.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="w-6 h-6  text-gray-900 mt-1" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 ">
                                            Real-time facility capacity monitoring
                                        </h3>

                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="w-6 h-6 text-gray-900 mt-1" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 ">
                                            Predictive wait time calculations
                                        </h3>

                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="w-6 h-6  text-gray-900 mt-1" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 ">
                                            Outcome-based quality scoring
                                        </h3>

                                    </div>
                                </div>
                                 <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="w-6 h-6  text-gray-900 mt-1" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 ">
                                            Seamless offline access
                                        </h3>

                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>
            {/* Benefits Section */}
         <section id="benefits" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Built for Everyone in Healthcare
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Tailored solutions for patients, facilities, and healthcare organizations
                    </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* For Patients */}
                    <Card className="bg-white hover:shadow-lg transition-shadow border-2 ">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                For Patients
                            </h3>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Safe, verified healthcare providers</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Transparent pricing and treatment options</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Choose facilities by specialization</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Real-time referral tracking</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* For Healthcare Facilities */}
                    <Card className="bg-white hover:shadow-lg transition-shadow border-2 ">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                For Healthcare Facilities
                            </h3>
                            <div className="text-sm text-gray-500 mb-4">
                                Hospitals, Labs, Pharmacies
                            </div>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Increased patient visibility and traffic</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Accurate, pre-screened referrals</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Seamless case management tools</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Access to professional care network</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* For Organizations */}
                    <Card className="bg-white hover:shadow-lg transition-shadow border-2 ">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                For Organizations
                            </h3>
                            <div className="text-sm text-gray-500 mb-4">
                                HMOs, NGOs, & Employers
                            </div>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Centralized data tracking</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Fraud detection and claim integrity</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-[#10B77F] mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Outcome monitoring and cost controls</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

            {/* Trusted Hospitals Section */}
            <section id="hospitals" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Trusted by Leading Hospitals
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join hundreds of verified healthcare facilities improving patient
                            outcomes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                                alt="Modern healthcare facility in Africa"
                                className="rounded-xl shadow-lg w-full h-auto"
                            />
                        </div>
                        <div>
                            <Card className="bg-blue-50 mb-8">
                                <CardContent className="p-8">
                                    <div className="flex items-center mb-4">
                                        <div className="flex text-yellow-400 mr-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-gray-600 text-sm">5.0 rating</span>
                                    </div>
                                    <blockquote className="text-lg text-gray-700 italic mb-4">
                                        "CareFindr has transformed how we receive and manage patient
                                        referrals. The platform is intuitive, secure, and has
                                        significantly improved our patient acquisition process."
                                    </blockquote>
                                    <div className="flex items-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                                            alt="Dr. Amara Okafor"
                                            className="w-12 h-12 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                Dr. Amara Okafor
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Chief Medical Officer, Lagos General Hospital
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primarysolid">500+</div>
                                    <div className="text-sm text-gray-600">Verified Hospitals</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#10B77F]">10K+</div>
                                    <div className="text-sm text-gray-600">Successful Referrals</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get answers to common questions about our platform
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                question: "How do I verify my hospital on the platform?",
                                answer:
                                    "Hospital verification involves submitting required documentation including licenses, certifications, and facility information. Our verification team reviews all submissions within 48 hours.",
                            },
                            {
                                question: "Is patient data secure on CareFindr?",
                                answer:
                                    "Yes, we use enterprise-grade encryption and comply with international healthcare data protection standards. All patient information is encrypted and access is strictly controlled.",
                            },
                            {
                                question: "What are the costs for hospitals to join?",
                                answer:
                                    "Basic registration is free for all hospitals. We offer premium features through affordable subscription plans with no hidden fees.",
                            },
                            {
                                question:
                                    "How quickly can I receive referrals after joining?",
                                answer:
                                    "Once verified, hospitals typically receive their first referrals within 24-48 hours. Our platform actively matches patients with appropriate healthcare providers.",
                            },
                            {
                                question:
                                    "Can patients choose specific hospitals for their care?",
                                answer:
                                    "Absolutely. Patients can browse verified hospitals, view specializations, and choose healthcare providers that best meet their needs and preferences.",
                            },
                        ].map((faq, index) => (
                            <Card key={index} className="bg-white">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 bg-gradient-to-r from-primarysolid to-primarysolid">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Transform Healthcare Delivery?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join our growing network of verified healthcare facilities and healthcare
                        professionals making a difference in patient care.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="px-8 py-4 text-lg font-semibold text-primarysolid bg-white hover:bg-gray-100"
                            onClick={() => navigate("/register")}
                        >
                            Join Our Network
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 py-4 text-lg font-semibold text-primarysolid bg-white hover:bg-gray-100"
                            onClick={() => navigate("/login")}
                        >
                            Refer a Patient
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
