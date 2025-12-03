import { Instagram, Heart, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600 mb-1">
                Designed and maintained by
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="font-semibold text-gray-900 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  Hritik Rawat
                </span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-900 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  Anshika Rawat
                </span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gray-300"></div>
            
            {/* Instagram Links */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a
                href="https://www.instagram.com/hritiuk_13?igsh=ZGhxM3FmdWtjYmNj"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 group shadow-sm hover:shadow-md"
                aria-label="Hritik Rawat Instagram"
              >
                <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">@hritiuk_13</span>
              </a>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-200 w-full justify-center">
            <Code className="h-3 w-3" />
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for students worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

