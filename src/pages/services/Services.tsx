import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Filter, Clock, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const services = [
  {
    id: 1,
    title: "Plumbing Services",
    description: "Expert plumbing solutions for your home and office. From repairs to installations.",
    icon: "🔧",
    category: "Home Maintenance",
    rating: 4.8,
    responseTime: "15-30 mins",
    price: "Starting from ₹499",
    features: ["24/7 Emergency Service", "Licensed Plumbers", "Warranty on Work"]
  },
  {
    id: 2,
    title: "Electrical Services",
    description: "Professional electrical repairs, installations, and maintenance services.",
    icon: "⚡",
    category: "Home Maintenance",
    rating: 4.7,
    responseTime: "20-40 mins",
    price: "Starting from ₹599",
    features: ["Safety First", "Certified Electricians", "Quality Materials"]
  },
  {
    id: 3,
    title: "Cleaning Services",
    description: "Comprehensive cleaning solutions for homes and offices.",
    icon: "🧹",
    category: "Home Care",
    rating: 4.9,
    responseTime: "1-2 hours",
    price: "Starting from ₹999",
    features: ["Eco-friendly Products", "Trained Staff", "Customized Plans"]
  },
  // Add more services as needed
];

const categories = [
  "All Services",
  "Home Maintenance",
  "Home Care",
  "Repairs",
  "Installation",
  "Emergency"
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === "All Services" || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
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
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Professional home services tailored to your needs. Quality workmanship guaranteed.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search services..."
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
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{service.icon}</span>
                  <Badge variant="secondary">{service.category}</Badge>
                </div>
                <CardTitle className="mt-4">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>{service.rating} Rating</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{service.responseTime} Response Time</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Available in your area</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="font-semibold text-primary">{service.price}</span>
                <Button>Book Now</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 