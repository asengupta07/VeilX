import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from "lucide-react";

// Footer component definition using TypeScript
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-4">VeilX</h2>
            <p className="mb-4">Creating amazing experiences for our customers since 2024.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-green-600 transition-colors">About</Link></li>
              <li><Link href="/services" className="hover:text-green-600 transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-green-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-green-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-green-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-green-600 transition-colors">
                <Facebook className="h-6 w-6 text-white" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="hover:text-green-600 transition-colors">
                <Twitter className="h-6 w-6 text-white" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://instagram.com" className="hover:text-green-600 transition-colors">
                <Instagram className="h-6 w-6 text-white" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://linkedin.com" className="hover:text-green-600 transition-colors">
                <Linkedin className="h-6 w-6 text-white" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://youtube.com" className="hover:text-green-600 transition-colors">
                <Youtube className="h-6 w-6 text-white" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="https://github.com" className="hover:text-green-600 transition-colors">
                <Github className="h-6 w-6 text-white" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} VeilX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
