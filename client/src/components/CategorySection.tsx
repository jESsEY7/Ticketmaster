import { Link } from "wouter";
import { 
  Music, 
  Volleyball, 
  Theater, 
  Palmtree 
} from "lucide-react";

interface CategorySectionProps {
  categories: any[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  // Fallback for when categories are loading
  const defaultCategories = [
    { id: 1, name: "Concerts", icon: "music", iconBgColor: "bg-blue-50" },
    { id: 2, name: "Sports", icon: "basketball-ball", iconBgColor: "bg-orange-50" },
    { id: 3, name: "Theater", icon: "theater-masks", iconBgColor: "bg-purple-50" },
    { id: 4, name: "Festivals", icon: "umbrella-beach", iconBgColor: "bg-green-50" }
  ];
  
  const categoriesToDisplay = categories.length > 0 ? categories : defaultCategories;
  
  // Map icon name to component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "music":
        return <Music className="text-primary text-3xl mb-3" />;
      case "basketball-ball":
        return <Volleyball className="text-secondary text-3xl mb-3" />;
      case "theater-masks":
        return <Theater className="text-purple-500 text-3xl mb-3" />;
      case "umbrella-beach":
        return <Palmtree className="text-green-500 text-3xl mb-3" />;
      default:
        return <Music className="text-primary text-3xl mb-3" />;
    }
  };
  
  // Map icon background color
  const getBgColorClass = (colorClass: string) => {
    switch (colorClass) {
      case "bg-blue-50":
        return "bg-blue-50 group-hover:bg-blue-100";
      case "bg-orange-50":
        return "bg-orange-50 group-hover:bg-orange-100";
      case "bg-purple-50":
        return "bg-purple-50 group-hover:bg-purple-100";
      case "bg-green-50":
        return "bg-green-50 group-hover:bg-green-100";
      default:
        return "bg-blue-50 group-hover:bg-blue-100";
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesToDisplay.map((category) => (
            <Link key={category.id} href={`/?category=${category.id}`}>
              <a className="group">
                <div className={`rounded-lg p-6 text-center transition duration-300 ease-in-out ${getBgColorClass(category.iconBgColor)}`}>
                  {getIcon(category.icon)}
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
