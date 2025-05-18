
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Calendar, ArrowRight, Bell, Star, Map, Dumbbell } from "lucide-react";

const ClientDashboard = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const upcoming_classes = [
    {
      id: "class-1",
      title: "Morning Yoga",
      gym_name: "ZenFit Studio",
      date: "Today, 8:00 AM",
      image: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYSUyMGNsYXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "class-2",
      title: "HIIT Workout",
      gym_name: "PulseGym",
      date: "Tomorrow, 6:30 PM",
      image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhpaXQlMjBmaXRuZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    }
  ];

  const recommended_gyms = [
    {
      id: "gym-1",
      name: "Elite Fitness",
      location: "Downtown",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "gym-2",
      name: "PowerHouse",
      location: "West Side",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGd5bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "gym-3",
      name: "FitZone",
      location: "South Park",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome and Stats */}
      <div className="bg-primary text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || "Fitness Enthusiast"}</h1>
        <p>Your fitness journey looks great! Here's what's happening today.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-md">
            <p className="text-white/80 text-sm">Active Subscription</p>
            <p className="font-bold mt-1">Premium Plan</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-md">
            <p className="text-white/80 text-sm">Classes this month</p>
            <p className="font-bold mt-1">12 / Unlimited</p>
          </div>
          <div className="hidden md:block bg-white/20 backdrop-blur-sm p-4 rounded-md">
            <p className="text-white/80 text-sm">Gyms visited</p>
            <p className="font-bold mt-1">7 different gyms</p>
          </div>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upcoming Classes</h2>
          <Link to="/app/bookings" className="text-primary flex items-center text-sm">
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {upcoming_classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming_classes.map((class_item) => (
              <Card key={class_item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 h-32 sm:h-auto">
                    <img 
                      src={class_item.image} 
                      alt={class_item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:w-2/3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{class_item.title}</h3>
                      <p className="text-gray-500 text-sm">{class_item.gym_name}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {class_item.date}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <Button variant="outline" size="sm">Cancel</Button>
                      <Button variant="ghost" size="sm">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Set reminder</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">No upcoming classes</p>
              <Link to="/app/classes">
                <Button className="mt-4">Browse Classes</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommended Gyms */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recommended Gyms</h2>
          <Link to="/app/gyms" className="text-primary flex items-center text-sm">
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended_gyms.map((gym) => (
            <Card key={gym.id} className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={gym.image} 
                  alt={gym.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-xs font-medium">{gym.rating}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{gym.name}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Map className="h-3 w-3 mr-1" />
                  {gym.location}
                </div>
              </CardContent>
              <CardFooter className="px-4 pb-4 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/app/gyms/${gym.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center flex flex-col items-center">
              <Dumbbell className="h-8 w-8 mb-2 text-primary" />
              <p className="font-medium">Find Gym</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center flex flex-col items-center">
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <p className="font-medium">Book Class</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center flex flex-col items-center">
              <Star className="h-8 w-8 mb-2 text-primary" />
              <p className="font-medium">My Reviews</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center flex flex-col items-center">
              <Bell className="h-8 w-8 mb-2 text-primary" />
              <p className="font-medium">My Reminders</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
