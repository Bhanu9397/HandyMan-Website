import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Star, MapPin, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const providers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Senior Plumber",
    experience: "15 years",
    rating: 4.9,
    reviews: 128,
    responseTime: "15-30 mins",
    location: "South Delhi",
    image: "/avatars/plumber.jpg",
    services: ["Plumbing", "Water Heater Installation", "Pipe Repair"],
    availability: "Available Now",
    languages: ["Hindi", "English"],
    certifications: ["Licensed Plumber", "Safety Certified"]
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Electrical Engineer",
    experience: "12 years",
    rating: 4.8,
    reviews: 95,
    responseTime: "20-40 mins",
    location: "West Delhi",
    image: "/avatars/electrician.jpg",
    services: ["Electrical Repairs", "Installation", "Maintenance"],
    availability: "Available in 2 hours",
    languages: ["Hindi", "English", "Punjabi"],
    certifications: ["Licensed Electrician", "Advanced Safety"]
  },
  // Add more providers as needed
];

const categories = [
  "All Providers",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Carpentry",
  "Painting"
];

export default function ServiceProviders() {
  const [selectedCategory, setSelectedCategory] = useState("All Providers");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = providers.filter(provider => {
    const matchesCategory = selectedCategory === "All Providers" || 
                           provider.services.some(service => service === selectedCategory);
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Our Service Providers</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Meet our verified and experienced service providers. Each one is carefully selected and trained to deliver the best service.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search providers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={provider.image} alt={provider.name} />
                    <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{provider.name}</CardTitle>
                    <CardDescription>{provider.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>{provider.rating} ({provider.reviews} reviews)</span>
                    </div>
                    <Badge variant="secondary">{provider.availability}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{provider.responseTime} Response Time</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{provider.location}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.services.map((service, index) => (
                        <Badge key={index} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Languages:</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.languages.map((language, index) => (
                        <Badge key={index} variant="secondary">{language}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
                <Button>Book Now</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 