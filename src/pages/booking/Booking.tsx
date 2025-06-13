import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BookingForm from "@/components/booking/BookingForm";
import { useToast } from "@/components/ui/use-toast";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get service type and provider ID from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const serviceType = searchParams.get("service");
  const providerId = searchParams.get("provider");

  const handleBookingComplete = () => {
    toast({
      title: "Booking Successful!",
      description: "We'll contact you shortly to confirm your appointment.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Book Your Service</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Fill in the details below to schedule your service. We'll confirm your booking shortly.
        </p>
      </motion.div>

      <BookingForm
        serviceType={serviceType || undefined}
        providerId={providerId || undefined}
        onBookingComplete={handleBookingComplete}
      />
    </div>
  );
} 