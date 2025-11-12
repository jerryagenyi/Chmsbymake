/**
 * QuickActionDialogs - All quick action dialogs in one place
 * Record Attendance, Create Event, Record Giving, Manage Groups, Generate Report
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  CheckCircle,
  Calendar as CalendarIcon,
  DollarSign,
  Users,
  FileText,
  Loader2,
  CalendarPlus,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { format } from 'date-fns';
import { toast } from 'sonner@2.0.3';

// ============================================================================
// RECORD ATTENDANCE DIALOG
// ============================================================================

interface RecordAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: AttendanceData) => Promise<void>;
}

interface AttendanceData {
  serviceType: string;
  date: Date;
  attendanceCount: number;
  firstTimers: number;
  notes?: string;
}

export function RecordAttendanceDialog({
  open,
  onClose,
  onSubmit,
}: RecordAttendanceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceCount, setAttendanceCount] = useState('');
  const [firstTimers, setFirstTimers] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceType || !attendanceCount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data: AttendanceData = {
        serviceType,
        date,
        attendanceCount: parseInt(attendanceCount),
        firstTimers: parseInt(firstTimers) || 0,
        notes,
      };

      if (onSubmit) {
        await onSubmit(data);
      }

      toast.success('Attendance recorded successfully');
      onClose();
      // Reset form
      setServiceType('');
      setAttendanceCount('');
      setFirstTimers('');
      setNotes('');
    } catch (error) {
      toast.error('Failed to record attendance');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Record Attendance
          </DialogTitle>
          <DialogDescription>
            Quick entry for service attendance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type *</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday_first">Sunday - First Service</SelectItem>
                <SelectItem value="sunday_second">Sunday - Second Service</SelectItem>
                <SelectItem value="midweek">Midweek Service</SelectItem>
                <SelectItem value="prayer">Prayer Meeting</SelectItem>
                <SelectItem value="youth">Youth Service</SelectItem>
                <SelectItem value="special">Special Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Attendance Count */}
          <div className="space-y-2">
            <Label htmlFor="attendanceCount">Total Attendance *</Label>
            <Input
              id="attendanceCount"
              type="number"
              min="0"
              value={attendanceCount}
              onChange={(e) => setAttendanceCount(e.target.value)}
              placeholder="e.g., 342"
            />
          </div>

          {/* First Timers */}
          <div className="space-y-2">
            <Label htmlFor="firstTimers">First-Time Visitors</Label>
            <Input
              id="firstTimers"
              type="number"
              min="0"
              value={firstTimers}
              onChange={(e) => setFirstTimers(e.target.value)}
              placeholder="e.g., 12"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special notes about this service..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Record Attendance
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// CREATE EVENT DIALOG
// ============================================================================

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: EventData) => Promise<void>;
}

interface EventData {
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  location: string;
  capacity?: number;
}

export function CreateEventDialog({
  open,
  onClose,
  onSubmit,
}: CreateEventDialogProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !startDate || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data: EventData = {
        title,
        description,
        category,
        startDate,
        endDate,
        location,
        capacity: capacity ? parseInt(capacity) : undefined,
      };

      if (onSubmit) {
        await onSubmit(data);
      }

      toast.success('Event created successfully');
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setLocation('');
      setCapacity('');
    } catch (error) {
      toast.error('Failed to create event');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-primary" />
            Create New Event
          </DialogTitle>
          <DialogDescription>
            Schedule a new church event or activity
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Youth Conference 2024"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worship">Worship Service</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="seminar">Seminar/Workshop</SelectItem>
                <SelectItem value="social">Social Event</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="youth">Youth Event</SelectItem>
                <SelectItem value="children">Children's Event</SelectItem>
                <SelectItem value="prayer">Prayer Meeting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(d) => d && setStartDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>End date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(d) => d && setEndDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Main Sanctuary, Conference Hall"
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (Optional)</Label>
            <Input
              id="capacity"
              type="number"
              min="0"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g., 500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event details, schedule, special instructions..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Create Event
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// RECORD GIVING DIALOG
// ============================================================================

interface RecordGivingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: GivingData) => Promise<void>;
}

interface GivingData {
  donor: string;
  amount: number;
  category: string;
  method: string;
  date: Date;
  notes?: string;
}

export function RecordGivingDialog({
  open,
  onClose,
  onSubmit,
}: RecordGivingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [donor, setDonor] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [method, setMethod] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!donor || !amount || !category || !method) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data: GivingData = {
        donor,
        amount: parseFloat(amount),
        category,
        method,
        date,
        notes,
      };

      if (onSubmit) {
        await onSubmit(data);
      }

      toast.success('Donation recorded successfully');
      onClose();
      // Reset form
      setDonor('');
      setAmount('');
      setCategory('');
      setMethod('');
      setNotes('');
    } catch (error) {
      toast.error('Failed to record donation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Record Donation
          </DialogTitle>
          <DialogDescription>
            Quick entry for donations and offerings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Donor */}
          <div className="space-y-2">
            <Label htmlFor="donor">Donor Name *</Label>
            <Input
              id="donor"
              value={donor}
              onChange={(e) => setDonor(e.target.value)}
              placeholder="Member name or 'Anonymous'"
              list="member-suggestions"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦) *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 50000"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tithe">Tithe</SelectItem>
                <SelectItem value="offering">Offering</SelectItem>
                <SelectItem value="building_fund">Building Fund</SelectItem>
                <SelectItem value="missions">Missions</SelectItem>
                <SelectItem value="special_project">Special Project</SelectItem>
                <SelectItem value="donation">General Donation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method *</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select method..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="card">Card/POS</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Campaign name, designation, etc."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Record Donation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// GENERATE REPORT DIALOG
// ============================================================================

interface GenerateReportDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate?: (data: ReportData) => Promise<void>;
}

interface ReportData {
  reportType: string;
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
}

export function GenerateReportDialog({
  open,
  onClose,
  onGenerate,
}: GenerateReportDialogProps) {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);

  const handleGenerate = async () => {
    if (!reportType) {
      toast.error('Please select a report type');
      return;
    }

    if (dateRange === 'custom' && (!startDate || !endDate)) {
      toast.error('Please select start and end dates');
      return;
    }

    setLoading(true);
    try {
      const data: ReportData = {
        reportType,
        dateRange,
        startDate,
        endDate,
        format,
        includeCharts,
      };

      if (onGenerate) {
        await onGenerate(data);
      }

      toast.success('Report generated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to generate report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Generate Report
          </DialogTitle>
          <DialogDescription>
            Create detailed reports for your church data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Report Type */}
          <div className="space-y-2">
            <Label>Report Type *</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Attendance Report</SelectItem>
                <SelectItem value="giving">Giving Report</SelectItem>
                <SelectItem value="membership">Membership Report</SelectItem>
                <SelectItem value="growth">Growth Analytics</SelectItem>
                <SelectItem value="events">Events Summary</SelectItem>
                <SelectItem value="financial">Financial Statement</SelectItem>
                <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range *</Label>
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PP') : <span>Start</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PP') : <span>End</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Format */}
          <div className="space-y-2">
            <Label>Export Format *</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Charts */}
          <div className="flex items-center justify-between">
            <Label htmlFor="charts">Include Charts & Graphs</Label>
            <input
              type="checkbox"
              id="charts"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              className="h-4 w-4"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Vue Migration Notes:
 * 
 * All dialogs follow the same pattern:
 * - Use q-dialog for modal
 * - Use q-form for form validation
 * - Use q-select for dropdowns
 * - Use q-date for date pickers
 * - Use q-input for text inputs
 * - Handle loading states with :loading prop
 * - Emit 'submit' event on success
 * 
 * Example:
 * <q-dialog v-model="open" persistent>
 *   <q-card style="min-width: 500px">
 *     <q-card-section>
 *       <div class="text-h6">Dialog Title</div>
 *     </q-card-section>
 *     
 *     <q-card-section>
 *       <q-form @submit="handleSubmit">
 *         <!-- Form fields -->
 *       </q-form>
 *     </q-card-section>
 *     
 *     <q-card-actions align="right">
 *       <q-btn flat label="Cancel" v-close-popup />
 *       <q-btn 
 *         color="primary" 
 *         label="Submit" 
 *         :loading="loading"
 *         @click="handleSubmit" 
 *       />
 *     </q-card-actions>
 *   </q-card>
 * </q-dialog>
 */
