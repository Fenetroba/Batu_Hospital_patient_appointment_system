import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const BottomProfile = () => {
  return (
    <div className="h-20 bg-[var(--one)] flex items-center gap-3 px-10  w-full">
      <Avatar className='w-15 h-15'>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p>Name:</p>
        <p>Email:</p>
      </div>
          </div>
  );
};

export default BottomProfile;
