import { Apple, PlayCircle } from "lucide-react";

export default function AppPromoSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 font-heading">Get the TicketRaha App</h2>
            <p className="text-lg text-blue-100 mb-6">
              Get exclusive access to presales, discover events near you, and manage your tickets on the go. Download the app today!
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="flex items-center bg-black rounded-lg px-5 py-3 hover:bg-gray-800 transition-colors"
              >
                <Apple className="h-6 w-6 mr-3" />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center bg-black rounded-lg px-5 py-3 hover:bg-gray-800 transition-colors"
              >
                <PlayCircle className="h-6 w-6 mr-3" />
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="md:w-1/3">
            <img
              src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700&q=80"
              alt="Smartphone showing ticket application"
              className="rounded-xl shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
