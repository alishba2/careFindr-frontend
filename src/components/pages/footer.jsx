import { Heart } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-primarysolid mb-4">
              <Heart className="w-6 h-6 inline mr-2" />
              CareFindr
            </div>
            <p className="text-gray-300 mb-4">
              Connecting Africa's healthcare ecosystem through AI-powered referrals and verified provider networks.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              {/* Social Icons */}
              {/* (Unchanged, not shown for brevity) */}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">For Patients</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Find Healthcare</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Smart Triage Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Appointment Booking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Transparency in Care</a></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">For Facilities</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/register" className="hover:text-white transition-colors">Join Network</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Referral Dashboard</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Brand Visibility</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Training & Support</a></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Contact & Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: <a href="mailto:support@carefindr.ai" className="hover:text-white">support@carefindr.ai</a></li>
              <li>Phone: +234 800 CARE (2273)</li>
              <li>24/7 Support Available</li>
              <li>Lagos, Nigeria</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-gray-400 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm">&copy; 2025 CareFindr. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}