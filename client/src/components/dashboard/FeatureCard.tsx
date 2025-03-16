import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, path }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="h-32 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-24 w-24 text-navy-800 opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy-900 opacity-70"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white text-xl font-serif font-bold">{title}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href={path}>
          <Button className="w-full bg-navy hover:bg-navy-800 text-white">
            Get Started
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
