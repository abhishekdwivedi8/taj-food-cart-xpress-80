
import React, { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Settings, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ManagerProfileCardProps {
  onLogout?: () => void;
}

const ManagerProfileCard = ({ onLogout }: ManagerProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Restaurant Manager",
    email: "manager@restaurant.com",
    phone: "+1 234 567 8901",
    avatar: "/placeholder.svg"
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Save profile data (would connect to backend in a real app)
    console.log("Profile updated:", profileData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <HoverCard openDelay={200} closeDelay={300}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="end">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profileData.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold">{profileData.name}</h4>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        <Separator className="my-3" />

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-3">
            <div>
              <label htmlFor="name" className="text-xs font-medium block mb-1">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-xs font-medium block mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-xs font-medium block mb-1">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="h-8 text-sm"
              />
            </div>
            <div className="pt-2">
              <Button type="submit" size="sm" className="w-full">
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{profileData.name}</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{profileData.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{profileData.phone}</span>
            </div>
            <div className="pt-2">
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={onLogout}
              >
                Log Out
              </Button>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default ManagerProfileCard;
