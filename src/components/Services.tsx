import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import ServiceIcon from './ServiceIcon';
import { Phone, MessageSquare, Star, MapPin } from 'lucide-react';

type Service = Tables<'services'>;
type Handyman = Tables<'handyman_profiles'>;

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [handymen, setHandymen] = useState<Handyman[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category');

      // Fetch handymen
      const { data: handymenData } = await supabase
        .from('handyman_profiles')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      setServices(servicesData || []);
      setHandymen(handymenData || []);
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const filteredHandymen = selectedCategory
    ? handymen.filter(h => h.business_name?.toLowerCase().includes(selectedCategory.toLowerCase()))
    : handymen;

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Find Local Handymen
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Connect directly with verified handymen in your area. No middleman, no extra charges.
          </motion.p>
        </div>

        {/* Service Categories */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12"
        >
          {services.map((service) => (
            <motion.button
              key={service.id}
              variants={itemVariants}
              onClick={() => setSelectedCategory(service.category)}
              className={`p-4 rounded-xl text-center transition-all duration-300 ${
                selectedCategory === service.category
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-primary/10'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <ServiceIcon category={service.category} className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{service.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Handymen List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredHandymen.map((handyman) => (
            <motion.div
              key={handyman.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{handyman.business_name}</h3>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1 text-gray-700 dark:text-gray-300">{handyman.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">{handyman.bio}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{handyman.availability}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="mr-2">Experience:</span>
                    <span>{handyman.years_experience} years</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <a
                    href={`tel:${handyman.phone}`}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                  <a
                    href={`https://wa.me/${handyman.phone}`}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
