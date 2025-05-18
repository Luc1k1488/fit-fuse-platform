
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Search, Star, Map, List, MapPin, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for gyms
const mock_gyms = [
  {
    id: "gym-1",
    name: "Elite Fitness Center",
    location: "Downtown",
    city: "New York",
    address: "123 Main St, New York, NY",
    main_image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    review_count: 120,
    features: ["Pool", "Sauna", "Free Parking"],
    category: "Luxury"
  },
  {
    id: "gym-2",
    name: "PowerHouse Gym",
    location: "Midtown",
    city: "New York",
    address: "456 Park Ave, New York, NY",
    main_image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGd5bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    review_count: 95,
    features: ["24/7 Access", "Group Classes"],
    category: "Fitness"
  },
  {
    id: "gym-3",
    name: "Zen Yoga Studio",
    location: "West Side",
    city: "New York",
    address: "789 West End Ave, New York, NY",
    main_image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8eW9nYSUyMHN0dWRpb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    review_count: 78,
    features: ["Meditation", "Hot Yoga"],
    category: "Yoga"
  },
  {
    id: "gym-4",
    name: "CrossFit Junction",
    location: "East Village",
    city: "New York",
    address: "321 East 4th St, New York, NY",
    main_image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    review_count: 64,
    features: ["CrossFit", "Personal Training"],
    category: "CrossFit"
  },
  {
    id: "gym-5",
    name: "Urban Boxing Club",
    location: "Brooklyn",
    city: "New York",
    address: "555 Atlantic Ave, Brooklyn, NY",
    main_image: "https://images.unsplash.com/photo-1517637382994-f02da38c6728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym94aW5nJTIwZ3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    rating: 4.5,
    review_count: 42,
    features: ["Boxing Ring", "MMA Training"],
    category: "Boxing"
  },
  {
    id: "gym-6",
    name: "SoulCycle Downtown",
    location: "SoHo",
    city: "New York",
    address: "101 Spring St, New York, NY",
    main_image: "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3Bpbm5pbmclMjBjeWNsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    review_count: 116,
    features: ["Indoor Cycling", "HIIT Classes"],
    category: "Cycling"
  }
];

const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
const categories = ["All", "Luxury", "Fitness", "Yoga", "CrossFit", "Boxing", "Cycling"];

const GymsPage = () => {
  const [gyms, set_gyms] = useState(mock_gyms);
  const [search_query, set_search_query] = useState("");
  const [selected_city, set_selected_city] = useState("New York");
  const [selected_category, set_selected_category] = useState("All");
  const [min_rating, set_min_rating] = useState([4.0]);
  const [view_mode, set_view_mode] = useState("grid");

  const handle_search = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would filter gyms from API
    console.log("Searching for:", search_query);
    
    // For the demo, just filter the mock data
    const filtered_gyms = mock_gyms.filter(gym => 
      gym.name.toLowerCase().includes(search_query.toLowerCase()) ||
      gym.location.toLowerCase().includes(search_query.toLowerCase())
    );
    
    set_gyms(filtered_gyms);
  };

  const handle_filter = () => {
    let filtered = [...mock_gyms];
    
    // Filter by city
    if (selected_city) {
      filtered = filtered.filter(gym => gym.city === selected_city);
    }
    
    // Filter by category
    if (selected_category && selected_category !== "All") {
      filtered = filtered.filter(gym => gym.category === selected_category);
    }
    
    // Filter by rating
    filtered = filtered.filter(gym => gym.rating >= min_rating[0]);
    
    set_gyms(filtered);
  };

  // Apply filters when they change
  useEffect(() => {
    handle_filter();
  }, [selected_city, selected_category, min_rating]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-primary">FitPass</Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/gyms" className="text-primary font-medium">Gyms</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link to="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button>Join Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Gyms Near You</h1>
          <p className="text-gray-600">
            Explore our network of gyms, studios, and fitness centers available with your FitPass membership.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form onSubmit={handle_search} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search for gyms, studios, or locations..."
                value={search_query}
                onChange={(e) => set_search_query(e.target.value)}
                className="pl-10 pr-4 py-6 rounded-lg border-gray-200"
              />
              <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </form>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {/* City Dropdown */}
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <MapPin className="mr-2 h-4 w-4" />
                      {selected_city || "Select City"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {cities.map((city) => (
                      <DropdownMenuItem
                        key={city}
                        onClick={() => set_selected_city(city)}
                        className="flex items-center justify-between"
                      >
                        {city}
                        {city === selected_city && <Check className="h-4 w-4 ml-2" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Category Tabs */}
              <Tabs defaultValue="All" value={selected_category} className="w-full sm:w-auto">
                <TabsList className="overflow-x-auto pb-1">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      onClick={() => set_selected_category(category)}
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={view_mode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => set_view_mode("grid")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view_mode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => set_view_mode("map")}
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Minimum Rating: {min_rating}</label>
              <span className="text-sm text-gray-500">{min_rating[0]}/5</span>
            </div>
            <Slider
              defaultValue={[4.0]}
              min={1}
              max={5}
              step={0.1}
              value={min_rating}
              onValueChange={set_min_rating}
            />
          </div>
        </div>

        {/* Gym Results */}
        <Tabs value={view_mode} className="w-full">
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gyms.map((gym) => (
                <Card key={gym.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <img 
                      src={gym.main_image} 
                      alt={gym.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-xs font-medium">{gym.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="font-medium text-lg">{gym.name}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {gym.location}, {gym.city}
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{gym.review_count} reviews</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {gym.features.map((feature, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <Button variant="outline" asChild>
                      <Link to={`/gyms/${gym.id}`}>View Details</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View Classes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="mt-0">
            <div className="border rounded-lg h-[500px] bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Map View</h3>
                <p className="text-gray-500 max-w-md">
                  In a real application, this would display an interactive map with gym locations.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {gyms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No gyms match your search criteria.</p>
            <Button onClick={() => {
              set_search_query("");
              set_selected_city("New York");
              set_selected_category("All");
              set_min_rating([4.0]);
            }}>Reset Filters</Button>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="bg-primary text-white rounded-lg p-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to access all these gyms?</h2>
              <p className="mb-4 md:mb-0">Join FitPass today and get unlimited access with one simple membership.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/pricing">
                <Button variant="secondary">View Plans</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">Company</h5>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2">
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Legal</h5>
              <ul className="space-y-2">
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Connect</h5>
              <div className="flex space-x-4 mb-4">
                {/* Social Media Icons would go here */}
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary">
                  <span>FB</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary">
                  <span>IG</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary">
                  <span>TW</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center md:text-left">
            <p>&copy; 2023 FitPass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GymsPage;
