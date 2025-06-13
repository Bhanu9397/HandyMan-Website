import { motion } from 'framer-motion';
import { 
  Wrench, 
  Droplet, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Fan, 
  Sparkles, 
  Leaf,
  Home,
  Utensils,
  Sofa,
  Car,
  Phone,
  Wifi,
  Tv,
  Lock
} from 'lucide-react';

interface ServiceIconProps {
  category: string;
  size?: number;
  className?: string;
}

const ServiceIcon = ({ category, size = 24, className = '' }: ServiceIconProps) => {
  const getIcon = () => {
    switch (category.toLowerCase()) {
      case 'plumbing':
        return <Droplet className={className} />;
      case 'electrical':
        return <Zap className={className} />;
      case 'carpentry':
        return <Hammer className={className} />;
      case 'painting':
        return <Paintbrush className={className} />;
      case 'hvac':
        return <Fan className={className} />;
      case 'cleaning':
        return <Sparkles className={className} />;
      case 'appliance repair':
        return <Wrench className={className} />;
      case 'landscaping':
        return <Leaf className={className} />;
      case 'home maintenance':
        return <Home className={className} />;
      case 'kitchen repair':
        return <Utensils className={className} />;
      case 'furniture repair':
        return <Sofa className={className} />;
      case 'car repair':
        return <Car className={className} />;
      case 'mobile repair':
        return <Phone className={className} />;
      case 'internet setup':
        return <Wifi className={className} />;
      case 'tv installation':
        return <Tv className={className} />;
      case 'security installation':
        return <Lock className={className} />;
      default:
        return <Wrench className={className} />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center ${className}`}
    >
      {getIcon()}
    </motion.div>
  );
};

export default ServiceIcon; 