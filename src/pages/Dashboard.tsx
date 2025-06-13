import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Star, Settings, Heart, History, User } from "lucide-react";

// Mock data - Replace with actual data from your backend
const bookings = [
  {
    id: 1,
    service: "Plumbing Repair",
    provider: "Rajesh Kumar",
    date: "2024-03-20",
    time: "10:00 AM",
    status: "Scheduled",
    address: "123 Main St, Delhi"
  },
  {
    id: 2,
    service: "Electrical Installation",
    provider: "Priya Sharma",
    date: "2024-03-18",
    time: "02:00 PM",
    status: "Completed",
    address: "123 Main St, Delhi"
  }
];

const savedProviders = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Senior Plumber",
    rating: 4.9,
    image: "/avatars/plumber.jpg",
    services: ["Plumbing", "Water Heater Installation"]
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Electrical Engineer",
    rating: 4.8,
    image: "/avatars/electrician.jpg",
    services: ["Electrical Repairs", "Installation"]
  }
];

const userProfile = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 98765 43210",
  address: "123 Main St, Delhi",
  memberSince: "March 2024"
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="providers">Saved Providers</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-sm text-gray-500">Total bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Saved Providers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{savedProviders.length}</p>
                  <p className="text-sm text-gray-500">Favorite providers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Member Since
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userProfile.memberSince}</p>
                  <p className="text-sm text-gray-500">Loyalty status</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.filter(booking => booking.status === "Scheduled").map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{booking.service}</h3>
                        <p className="text-sm text-gray-500">with {booking.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{booking.date}</p>
                        <p className="text-sm text-gray-500">{booking.time}</p>
                      </div>
                      <Badge>{booking.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <CardDescription>View and manage your service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{booking.service}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {booking.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {booking.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <Badge>{booking.status}</Badge>
                        {booking.status === "Scheduled" && (
                          <Button variant="outline" size="sm">Reschedule</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers">
            <Card>
              <CardHeader>
                <CardTitle>Saved Providers</CardTitle>
                <CardDescription>Your favorite service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedProviders.map(provider => (
                    <div key={provider.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={provider.image} alt={provider.name} />
                        <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-gray-500">{provider.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm">{provider.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {provider.services.map((service, index) => (
                            <Badge key={index} variant="secondary">{service}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Book Now</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/avatars/user.jpg" alt={userProfile.name} />
                      <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                      <p className="text-sm text-gray-500">Member since {userProfile.memberSince}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-gray-600">{userProfile.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-gray-600">{userProfile.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <p className="text-gray-600">{userProfile.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
