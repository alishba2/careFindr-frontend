import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
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
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Find Trusted Healthcare.{" "}
                                <span className="text-primarysolid">Fast.</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                                Seamless referrals. Verified hospitals. Better health outcomes.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                    onClick={() => navigate("/register")}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-4 text-lg font-semibold border-2 border-primarysolid text-primarysolid hover:bg-primarysolid hover:text-white"
                                    onClick={() => scrollToSection("how-it-works")}
                                >
                                    See How It Works
                                </Button>
                            </div>
                            <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                                    Verified Hospitals
                                </div>
                                <div className="flex items-center">
                                    <Shield className="w-4 h-4 text-success mr-2" />
                                    Secure Platform
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-success mr-2" />
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
                                        <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
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

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Simple, secure, and efficient healthcare referrals in three easy steps
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primarysolid group-hover:text-white transition-all">
                                <Search className="w-8 h-8 text-primarysolid group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Find or Refer a Patient
                            </h3>
                            <p className="text-gray-600">
                                Easily search for verified hospitals or create referrals through our
                                secure platform
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-success group-hover:text-white transition-all">
                                <Hospital className="w-8 h-8 text-success group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Verified Hospital Receives Referral
                            </h3>
                            <p className="text-gray-600">
                                Instant notification to qualified healthcare providers with complete
                                patient information
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <Heart className="w-8 h-8 text-purple-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Better, Faster Health Outcomes
                            </h3>
                            <p className="text-gray-600">
                                Improved patient care through coordinated healthcare delivery and
                                reduced wait times
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose CareFindr
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Trusted by patients, hospitals, and healthcare organizations across
                            Africa
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* For Patients */}
                        <Card className="bg-white hover:shadow-lg transition-shadow">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                    <Shield className="w-8 h-8 text-primarysolid" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    For Patients
                                </h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Safe, verified healthcare providers
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Faster access to specialized care
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Transparent pricing and options
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Seamless referral tracking
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* For Hospitals */}
                        <Card className="bg-white hover:shadow-lg transition-shadow">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <Hospital className="w-8 h-8 text-success" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    For Hospitals
                                </h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Increased visibility and patient reach
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Accurate, qualified referrals
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Streamlined communication
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Professional network growth
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* For HMOs/NGOs */}
                        <Card className="bg-white hover:shadow-lg transition-shadow">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                                    <TrendingUp className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    For HMOs/NGOs
                                </h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Comprehensive data insights
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Fraud protection measures
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Cost management tools
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-success mr-3 mt-1" />
                                        Quality assurance tracking
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
                                    <div className="text-3xl font-bold text-success">10K+</div>
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
                        Join our growing network of verified hospitals and healthcare
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
