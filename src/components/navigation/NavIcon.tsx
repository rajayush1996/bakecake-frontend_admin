import { FC } from 'react';
import {
  Gauge,
  Package,
  Tags,
  Store,
  List,
  Truck,
  Shield,
  MessageSquare,
  BarChart3,
  Users,
  Cog,
  Clock,
} from 'lucide-react';

const icons = {
  gauge: Gauge,
  package: Package,
  tags: Tags,
  store: Store,
  list: List,
  truck: Truck,
  shield: Shield,
  message: MessageSquare,
  chart: BarChart3,
  users: Users,
  cog: Cog,
  clock: Clock,
};

export const NavIcon: FC<{ name?: string; className?: string }> = ({ name, className }) => {
  if (!name) return null;
  const IconComponent = icons[name as keyof typeof icons];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};
