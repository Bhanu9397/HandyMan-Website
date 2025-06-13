
import { motion } from 'framer-motion';
import { Wrench, Zap, Droplets, Hammer, PaintBucket, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Wrench,
      title: 'General Repairs',
      description: 'Fix broken items, install fixtures, and handle various household repairs.',
      price: 'Starting at $75',
      features: ['Quick diagnosis', 'Quality parts', 'Same-day service']
    },
    {
      icon: Zap,
      title: 'Electrical Work',
      description: 'Safe and certified electrical installations, repairs, and maintenance.',
      price: 'Starting at $120',
      features: ['Licensed electrician', 'Code compliant', 'Safety guaranteed']
    },
    {
      icon: Droplets,
      title: 'Plumbing Services',
      description: 'Professional plumbing solutions for leaks, clogs, and installations.',
      price: 'Starting at $95',
      features: ['Emergency service', 'Leak detection', 'Pipe repair']
    },
    {
      icon: Hammer,
      title: 'Carpentry',
      description: 'Custom woodwork, furniture assembly, and carpentry projects.',
      price: 'Starting at $85',
      features: ['Custom designs', 'Quality materials', 'Precise craftsmanship']
    },
    {
      icon: PaintBucket,
      title: 'Painting',
      description: 'Interior and exterior painting with professional finish.',
      price: 'Starting at $200',
      features: ['Premium paints', 'Clean finish', 'Color consultation']
    },
    {
      icon: Shield,
      title: 'Home Security',
      description: 'Install and maintain security systems, locks, and safety features.',
      price: 'Starting at $150',
      features: ['Smart systems', 'Professional install', '24/7 monitoring']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional handyman services for all your home improvement needs. Quality workmanship guaranteed.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <service.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-2xl font-bold text-blue-600 mb-4">{service.price}</div>
              </div>

              <div className="space-y-3 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Book Service
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
