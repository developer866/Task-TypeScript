function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">V</span>
              </div>
              <span className="text-white text-2xl font-bold">VOGUE</span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium fashion for the modern individual. Elevate your style.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#men"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Men's Collection
                </a>
              </li>
              <li>
                <a
                  href="#women"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Women's Collection
                </a>
              </li>
              <li>
                <a
                  href="#accessories"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Accessories
                </a>
              </li>
              <li>
                <a
                  href="#sale"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Sale
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#shipping"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#returns"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-3 mb-4">
              <a
                href="#instagram"
                className="w-10 h-10 bg-white/10 hover:bg-linear-to-r hover:from-yellow-400 hover:to-green-500 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <span className="text-white hover:text-black font-bold">
                  IG
                </span>
              </a>
              <a
                href="#facebook"
                className="w-10 h-10 bg-white/10 hover:bg-linear-to-r hover:from-yellow-400 hover:to-green-500 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <span className="text-white hover:text-black font-bold">
                  FB
                </span>
              </a>
              <a
                href="#twitter"
                className="w-10 h-10 bg-white/10 hover:bg-linear-to-r hover:from-yellow-400 hover:to-green-500 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <span className="text-white hover:text-black font-bold">
                  TW
                </span>
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Email:{" "}
              <a
                href="mailto:support@vogue.com"
                className="hover:text-yellow-400"
              >
                support@vogue.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 VOGUE. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#privacy"
              className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
