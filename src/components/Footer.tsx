
import React from "react";
import { ConciergeBell } from "lucide-react";

interface FooterProps {
  restaurantId?: number;
  showMarquee?: boolean;
}

const Footer: React.FC<FooterProps> = ({ restaurantId, showMarquee = false }) => {
  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      {showMarquee && (
        <div className="overflow-hidden bg-secondary py-2">
          <div className="whitespace-nowrap animate-marquee inline-block">
            <span className="mx-4 text-secondary-foreground font-medium">🍽️ FREE DELIVERY ON ORDERS OVER ₹1000</span>
            <span className="mx-4 text-secondary-foreground font-medium">🍲 CHEF'S SPECIAL AVAILABLE EVERY WEEKEND</span>
            <span className="mx-4 text-secondary-foreground font-medium">🎉 BOOK NOW FOR PRIVATE EVENTS AND CELEBRATIONS</span>
            <span className="mx-4 text-secondary-foreground font-medium">🥘 AUTHENTIC INDIAN CUISINE MADE WITH LOCALLY SOURCED INGREDIENTS</span>
            <span className="mx-4 text-secondary-foreground font-medium">🍴 BUSINESS LUNCH SPECIAL - 20% OFF MONDAY TO FRIDAY</span>
            <span className="mx-4 text-secondary-foreground font-medium">🥂 HAPPY HOURS: 5PM - 7PM DAILY</span>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <div className="flex items-center justify-center bg-background p-2 rounded-full h-12 w-12 mr-3">
              <ConciergeBell size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-lg font-serif font-bold">The Taj Flavours</p>
              <p className="text-sm text-primary-foreground/70">
                {restaurantId ? `Table ${restaurantId} - ` : ''} 
                Exquisite Dining Experience
              </p>
            </div>
          </div>
          
          <div className="mb-6 md:mb-0">
            <p className="text-accent-foreground font-serif font-medium mb-2">Hours</p>
            <p className="text-sm">Mon-Thu: 11:00 AM - 10:00 PM</p>
            <p className="text-sm">Fri-Sun: 11:00 AM - 11:00 PM</p>
          </div>
          
          <div>
            <p className="text-accent-foreground font-serif font-medium mb-2">Contact</p>
            <p className="text-sm">+91 (123) 456-7890</p>
            <p className="text-sm">info@tajflavours.com</p>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-6 pt-6 text-center">
          <p className="text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} The Taj Flavours. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
