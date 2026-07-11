"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  label?: string;
  placeholder?: string;
  numberOfMonths?: number;
}

export function DatePickerWithRange({
  value,
  onChange,
  label = "Date Picker Range",
  placeholder = "Pick a date",
  numberOfMonths = 2,
}: DatePickerWithRangeProps) {
  return (
    <Field className="mx-auto w-full">
      <FieldLabel htmlFor="date-picker-range">{label}</FieldLabel>

      <Popover>
        <PopoverTrigger>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal w-full"
          >
            <CalendarIcon data-icon="inline-start" />

            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
