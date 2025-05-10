import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 font-heading">TicketRaha</h2>
            <p className="text-gray-400 mb-6">
              Your trusted source for event tickets. Find and book tickets for concerts, sports events, theater performances, and more.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Events</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/?category=1">
                  <a className="text-gray-400 hover:text-white">Concerts</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=2">
                  <a className="text-gray-400 hover:text-white">Sports</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=3">
                  <a className="text-gray-400 hover:text-white">Theater</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=4">
                  <a className="text-gray-400 hover:text-white">Festivals</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=3">
                  <a className="text-gray-400 hover:text-white">Comedy</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help">
                  <a className="text-gray-400 hover:text-white">Help Center</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-400 hover:text-white">FAQs</a>
                </Link>
              </li>
              <li>
                <Link href="/guarantee">
                  <a className="text-gray-400 hover:text-white">Ticket Guarantee</a>
                </Link>
              </li>
              <li>
                <Link href="/refunds">
                  <a className="text-gray-400 hover:text-white">Refund Policy</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-gray-400 hover:text-white">Careers</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-gray-400 hover:text-white">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-gray-400 hover:text-white">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/partners">
                  <a className="text-gray-400 hover:text-white">Partners</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TicketRaha. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/200x60/333/fff?text=Payment+Methods"
                  alt="Payment methods"
                  className="h-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
