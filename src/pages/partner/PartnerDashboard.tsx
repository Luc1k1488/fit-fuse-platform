
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
import { BarChart, Users, Dumbbell, Calendar, Star, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for partner gyms
const partner_gyms = [
  {
    id: "gym-1",
    name: "Elite Fitness Downtown",
    location: "123 Main St, New York",
    main_image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    total_classes: 28,
    active_bookings: 156,
    rating: 4.8,
    review_count: 42
  },
  {
    id: "gym-2",
    name: "Elite Fitness Uptown",
    location: "456 Park Ave, New York",
    main_image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    total_classes: 21,
    active_bookings: 98,
    rating: 4.6,
    review_count: 28
  }
];

// Mock data for upcoming classes
const upcoming_classes = [
  {
    id: "class-1",
    title: "Morning HIIT",
    gym_name: "Elite Fitness Downtown",
    instructor: "Alex Johnson",
    date: "Today, 8:00 AM",
    booked_count: 12,
    capacity: 15
  },
  {
    id: "class-2",
    title: "Yoga Flow",
    gym_name: "Elite Fitness Downtown",
    instructor: "Sarah Miller",
    date: "Today, 10:00 AM",
    booked_count: 8,
    capacity: 12
  },
  {
    id: "class-3",
    title: "Strength Training",
    gym_name: "Elite Fitness Uptown",
    instructor: "Mike Thompson",
    date: "Tomorrow, 7:00 PM",
    booked_count: 9,
    capacity: 10
  }
];

const PartnerDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Partner Dashboard</h1>
        <span className="text-gray-500">Welcome back, {user?.name || "Partner"}</span>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Gyms</p>
                <h3 className="text-2xl font-bold mt-2">{partner_gyms.length}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-md">
                <Dumbbell className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Bookings</p>
                <h3 className="text-2xl font-bold mt-2">254</h3>
                <p className="text-xs text-green-500 mt-1">+12% from last week</p>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <h3 className="text-2xl font-bold mt-2">4.7</h3>
                <div className="flex mt-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-md">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue (Monthly)</p>
                <h3 className="text-2xl font-bold mt-2">$12,450</h3>
                <p className="text-xs text-green-500 mt-1">+8% from last month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-md">
                <CreditCard className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Gyms Section */}
      <h2 className="text-xl font-bold mb-4">My Gyms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {partner_gyms.map((gym) => (
          <Card key={gym.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto">
                <img 
                  src={gym.main_image} 
                  alt={gym.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-lg font-medium mb-1">{gym.name}</h3>
                <p className="text-gray-500 mb-3">{gym.location}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Classes</p>
                    <p className="font-medium">{gym.total_classes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Bookings</p>
                    <p className="font-medium">{gym.active_bookings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{gym.rating} ({gym.review_count} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button asChild variant="outline">
                    <Link to={`/admin/partner/gyms/${gym.id}`}>Manage Gym</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to={`/admin/partner/classes?gym_id=${gym.id}`}>View Classes</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        <Card className="border-dashed border-2 flex items-center justify-center">
          <CardContent className="p-6 text-center">
            <Dumbbell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Add New Gym</h3>
            <p className="text-gray-500 mb-4">Expand your business by adding another location</p>
            <Button asChild>
              <Link to="/admin/partner/gyms/new">Add Gym</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Classes Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upcoming Classes</h2>
        <Link to="/admin/partner/classes" className="text-primary text-sm">View all classes</Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gym</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {upcoming_classes.map((class_item) => (
              <tr key={class_item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{class_item.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{class_item.gym_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{class_item.instructor}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{class_item.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {class_item.booked_count}/{class_item.capacity}
                    {class_item.booked_count === class_item.capacity && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Full
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analytics Preview */}
      <h2 className="text-xl font-bold mt-8 mb-4">Analytics Overview</h2>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>Bookings and revenue for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center flex flex-col items-center space-y-2">
            <BarChart className="h-16 w-16 text-gray-300" />
            <p className="text-gray-500">Analytics charts will be displayed here</p>
            <Button asChild>
              <Link to="/admin/partner/analytics">View Detailed Analytics</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerDashboard;
