import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import CitySelectorSection from "@/components/CitySelectorSection";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingSection from "@/components/TrendingSection";
import UpcomingSection from "@/components/UpcomingSection";
import AppPromoSection from "@/components/AppPromoSection";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function HomePage() {
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Fetch categories
  const { data: categories } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch cities
  const { data: cities } = useQuery<any[]>({
    queryKey: ['/api/cities'],
  });
  
  return (
    <>
      <Helmet>
        <title>TicketRaha - Buy Event Tickets Online</title>
        <meta name="description" content="Find and book tickets for concerts, sports, theater, festivals, and more events in your area. Buy tickets securely with TicketRaha." />
        <meta property="og:title" content="TicketRaha - Buy Event Tickets Online" />
        <meta property="og:description" content="Find and book tickets for concerts, sports, theater, festivals, and more events in your area." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main>
        <HeroSection 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories || []}
        />
        
        <CategorySection categories={categories || []} />
        
        <CitySelectorSection 
          cities={cities || []} 
          selectedCityId={selectedCityId} 
          setSelectedCityId={setSelectedCityId} 
        />
        
        <FeaturedEvents 
          cityId={selectedCityId} 
          searchQuery={searchQuery} 
          categoryFilter={selectedCategory}
        />
        
        <TrendingSection />
        
        <UpcomingSection 
          cityId={selectedCityId} 
          searchQuery={searchQuery} 
          categoryFilter={selectedCategory}
        />
        
        <AppPromoSection />
      </main>
      
      <Footer />
    </>
  );
}
