import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface EnhancedDateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  showTime?: boolean;
  showPresets?: boolean;
  showRange?: boolean;
  placeholder?: string;
  className?: string;
}

interface TimeSlot {
  label: string;
  time: string;
}

const timePresets: TimeSlot[] = [
  { label: 'Morning Service', time: '09:00' },
  { label: 'Sunday School', time: '10:00' },
  { label: 'Main Service', time: '11:00' },
  { label: 'Evening Service', time: '18:00' },
  { label: 'Midweek Service', time: '19:00' },
];

const datePresets = [
  { label: 'Today', getValue: () => new Date() },
  { label: 'Tomorrow', getValue: () => addDays(new Date(), 1) },
  { label: 'This Sunday', getValue: () => {
    const today = new Date();
    const day = today.getDay();
    const daysUntilSunday = day === 0 ? 0 : 7 - day;
    return addDays(today, daysUntilSunday);
  }},
  { label: 'Next Sunday', getValue: () => {
    const today = new Date();
    const day = today.getDay();
    const daysUntilSunday = day === 0 ? 7 : 7 - day;
    return addDays(today, daysUntilSunday + 7);
  }},
];

export const EnhancedDateTimePicker: React.FC<EnhancedDateTimePickerProps> = ({
  value,
  onChange,
  showTime = false,
  showPresets = true,
  showRange = false,
  placeholder = 'Pick a date',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('09:00');

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }

    if (showTime && value) {
      // Preserve the time when changing date
      const newDate = new Date(date);
      newDate.setHours(value.getHours());
      newDate.setMinutes(value.getMinutes());
      onChange(newDate);
    } else {
      onChange(date);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (value) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(value);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      onChange(newDate);
    }
  };

  const handlePresetClick = (preset: { label: string; getValue: () => Date }) => {
    const date = preset.getValue();
    if (showTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      date.setHours(hours);
      date.setMinutes(minutes);
    }
    onChange(date);
    if (!showTime) {
      setOpen(false);
    }
  };

  const handleTimePresetClick = (time: string) => {
    handleTimeChange(time);
    if (value) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`
            w-full justify-start text-left
            border-[#2A2A30] hover:border-[#1CE479] hover:bg-[#1CE479]/10
            ${!value && 'text-gray-500'}
            ${className}
          `}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            showTime ? (
              format(value, 'PPP HH:mm')
            ) : (
              format(value, 'PPP')
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-[#1A1A20] border-[#2A2A30]"
        align="start"
      >
        <div className="flex">
          {/* Date Presets */}
          {showPresets && (
            <div className="border-r border-[#2A2A30] p-3 space-y-1 min-w-[140px]">
              <div className="text-xs text-gray-500 mb-2 px-2">Quick Select</div>
              {datePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-[#2A2A30] text-gray-300 hover:text-white transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Calendar */}
          <div>
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
              className="text-white"
            />

            {/* Time Picker */}
            {showTime && (
              <div className="border-t border-[#2A2A30] p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Select Time</span>
                </div>

                {/* Time Presets */}
                <div className="grid grid-cols-2 gap-2">
                  {timePresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleTimePresetClick(preset.time)}
                      className={`
                        px-3 py-2 text-xs rounded-lg border transition-colors
                        ${selectedTime === preset.time
                          ? 'border-[#1CE479] bg-[#1CE479]/10 text-[#1CE479]'
                          : 'border-[#2A2A30] hover:border-[#1CE479]/50 text-gray-400'
                        }
                      `}
                    >
                      <div className="truncate">{preset.label}</div>
                      <div className="text-xs opacity-75">{preset.time}</div>
                    </button>
                  ))}
                </div>

                {/* Manual Time Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="flex-1 bg-[#0A0A0F] border border-[#2A2A30] rounded-lg px-3 py-2 text-sm text-white focus:border-[#1CE479] focus:outline-none"
                  />
                  <Button
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Range Date Picker
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface EnhancedDateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  showPresets?: boolean;
  placeholder?: string;
  className?: string;
}

const rangePresets = [
  { label: 'This Week', getValue: () => ({
    from: startOfWeek(new Date(), { weekStartsOn: 0 }),
    to: endOfWeek(new Date(), { weekStartsOn: 0 }),
  })},
  { label: 'This Month', getValue: () => ({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })},
  { label: 'Last 7 Days', getValue: () => ({
    from: addDays(new Date(), -7),
    to: new Date(),
  })},
  { label: 'Last 30 Days', getValue: () => ({
    from: addDays(new Date(), -30),
    to: new Date(),
  })},
];

export const EnhancedDateRangePicker: React.FC<EnhancedDateRangePickerProps> = ({
  value,
  onChange,
  showPresets = true,
  placeholder = 'Pick a date range',
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const handlePresetClick = (preset: { label: string; getValue: () => DateRange }) => {
    onChange(preset.getValue());
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`
            w-full justify-start text-left
            border-[#2A2A30] hover:border-[#1CE479] hover:bg-[#1CE479]/10
            ${(!value?.from && !value?.to) && 'text-gray-500'}
            ${className}
          `}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, 'LLL dd, y')} - {format(value.to, 'LLL dd, y')}
              </>
            ) : (
              format(value.from, 'LLL dd, y')
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-[#1A1A20] border-[#2A2A30]"
        align="start"
      >
        <div className="flex">
          {/* Range Presets */}
          {showPresets && (
            <div className="border-r border-[#2A2A30] p-3 space-y-1 min-w-[140px]">
              <div className="text-xs text-gray-500 mb-2 px-2">Quick Select</div>
              {rangePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-[#2A2A30] text-gray-300 hover:text-white transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Calendar */}
          <Calendar
            mode="range"
            selected={value}
            onSelect={(range) => onChange(range as DateRange)}
            numberOfMonths={2}
            className="text-white"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
