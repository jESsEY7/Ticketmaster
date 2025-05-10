import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: any[];
}

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: HeroSectionProps) {
  const [, navigate] = useLocation();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState(selectedCategory);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    
    // Construct query string
    const queryParams = new URLSearchParams();
    if (localSearch) {
      queryParams.set("search", localSearch);
    }
    if (localCategory && localCategory !== "all") {
      queryParams.set("category", localCategory);
    }
    
    const queryString = queryParams.toString();
    navigate(queryString ? `/?${queryString}` : "/");
  };

  return (
    <section className="relative bg-dark overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600&q=80"
          alt="Concert crowd with colorful lights"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/50"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight font-heading">
            Discover and Book <span className="text-secondary">Live Events</span> Near You
          </h1>
          <p className="mt-6 text-xl text-gray-200">
            Find tickets for concerts, sports, theater, festivals, and more in your area.
          </p>
          
          <form onSubmit={handleSearch} className="mt-8 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    className="pl-10"
                    placeholder="Search events, artists, teams, or venues"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/4">
                <Select
                  value={localCategory}
                  onValueChange={setLocalCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-blue-600"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
