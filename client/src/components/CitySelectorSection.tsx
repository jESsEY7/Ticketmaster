import { cn } from "@/lib/utils";

interface CitySelectorSectionProps {
  cities: any[];
  selectedCityId: number | null;
  setSelectedCityId: (cityId: number | null) => void;
}

export default function CitySelectorSection({ 
  cities, 
  selectedCityId, 
  setSelectedCityId 
}: CitySelectorSectionProps) {
  // Fallback for when cities are loading
  const defaultCities = [
    { id: 1, name: "New York" },
    { id: 2, name: "Los Angeles" },
    { id: 3, name: "Chicago" },
    { id: 4, name: "Miami" },
    { id: 5, name: "Dallas" },
    { id: 6, name: "Seattle" }
  ];
  
  const citiesToDisplay = cities.length > 0 ? cities : defaultCities;
  
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Popular Cities</h2>
        <div className="flex flex-wrap gap-3">
          <button 
            className={cn(
              "city-filter-btn px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none",
              !selectedCityId && "active"
            )}
            onClick={() => setSelectedCityId(null)}
          >
            All
          </button>
          
          {citiesToDisplay.map((city) => (
            <button 
              key={city.id}
              className={cn(
                "city-filter-btn px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none",
                selectedCityId === city.id && "active"
              )}
              onClick={() => setSelectedCityId(city.id)}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
