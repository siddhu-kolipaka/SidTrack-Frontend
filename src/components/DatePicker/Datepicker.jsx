"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker = ({ date, setDate, className }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            " justify-start text-left font-normal bg-back text-txt border-border hover:bg-pri rounded-lg",
            !date && "text-muted-foreground ",
            className
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-back text-white">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => date > new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
