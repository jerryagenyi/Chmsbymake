/**
 * ChurchAfrica ChMS - Import/Export Members Dialog
 * Handles CSV/Excel import and export of member data
 */

import React, { useState, useRef } from 'react';
import { Member } from '../../types/member';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  FileDown,
  FileUp,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from '../ui/alert';

interface ImportExportDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'import' | 'export';
  members?: Member[];
  onImport?: (members: Partial<Member>[]) => void;
}

export function ImportExportDialog({
  open,
  onClose,
  mode,
  members = [],
  onImport,
}: ImportExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (members.length === 0) {
      toast.error('No members to export');
      return;
    }

    // Convert members to CSV
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Gender',
      'Date of Birth',
      'Marital Status',
      'Status',
      'Membership Number',
      'Join Date',
      'Street',
      'City',
      'State',
      'Zip Code',
      'Country',
      'Notes',
    ];

    const rows = members.map((m) => [
      m.firstName,
      m.lastName,
      m.contact.email || '',
      m.contact.phone || '',
      m.gender,
      m.dateOfBirth || '',
      m.maritalStatus || '',
      m.status,
      m.membershipNumber || '',
      m.joinDate,
      m.contact.address?.street || '',
      m.contact.address?.city || '',
      m.contact.address?.state || '',
      m.contact.address?.zipCode || '',
      m.contact.address?.country || '',
      m.notes || '',
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `members_export_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${members.length} members successfully!`);
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('Please select a CSV or Excel file');
      return;
    }

    setImportFile(file);

    // Parse CSV preview (simple implementation)
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(0, 6); // Preview first 5 rows + header
      const preview = lines.map((line) =>
        line.split(',').map((cell) => cell.replace(/^"|"$/g, ''))
      );
      setImportPreview(preview);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());

        const members: Partial<Member>[] = lines.slice(1).map((line, index) => {
          const values = line.split(',').map((v) => v.replace(/^"|"$/g, '').trim());
          
          const member: Partial<Member> = {
            id: `imported_${Date.now()}_${index}`,
            firstName: values[0] || '',
            lastName: values[1] || '',
            contact: {
              email: values[2] || '',
              phone: values[3] || '',
              address: {
                street: values[10] || '',
                city: values[11] || '',
                state: values[12] || '',
                zipCode: values[13] || '',
                country: values[14] || 'Nigeria',
              },
            },
            gender: (values[4] as Member['gender']) || 'male',
            dateOfBirth: values[5] || undefined,
            maritalStatus: (values[6] as Member['maritalStatus']) || undefined,
            status: (values[7] as Member['status']) || 'active',
            membershipNumber: values[8] || `MEM-${Date.now()}-${index}`,
            joinDate: values[9] || new Date().toISOString(),
            notes: values[15] || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return member;
        }).filter(m => m.firstName && m.lastName); // Filter out empty rows

        if (members.length === 0) {
          toast.error('No valid member data found in file');
          return;
        }

        onImport?.(members);
        toast.success(`Imported ${members.length} members successfully!`);
        onClose();
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import members. Please check file format.');
      }
    };
    reader.readAsText(importFile);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Gender',
      'Date of Birth',
      'Marital Status',
      'Status',
      'Membership Number',
      'Join Date',
      'Street',
      'City',
      'State',
      'Zip Code',
      'Country',
      'Notes',
    ];

    const sampleRow = [
      'John',
      'Doe',
      'john.doe@email.com',
      '+234 800 000 0000',
      'male',
      '1990-01-15',
      'married',
      'active',
      'MEM-001234',
      '2024-01-01',
      '123 Main Street',
      'Lagos',
      'Lagos State',
      '100001',
      'Nigeria',
      'Sample member notes',
    ];

    const csvContent = [
      headers.join(','),
      sampleRow.map((cell) => `"${cell}"`).join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'members_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Template downloaded successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'export' ? (
              <>
                <Download className="h-5 w-5 text-primary" />
                Export Members
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 text-primary" />
                Import Members
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'export'
              ? 'Export your member data to CSV or Excel format'
              : 'Import members from a CSV or Excel file'}
          </DialogDescription>
        </DialogHeader>

        {mode === 'export' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV (Comma Separated Values)
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Ready to export {members.length} members. The file will include all member
                information including contact details, membership status, and notes.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Export includes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Personal information (name, gender, DOB, marital status)</li>
                <li>✓ Contact details (email, phone, address)</li>
                <li>✓ Membership information (number, status, join date)</li>
                <li>✓ Additional notes</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="import-file">Select File</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    id="import-file"
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileUp className="h-4 w-4 mr-2" />
                    {importFile ? importFile.name : 'Choose CSV or Excel file'}
                  </Button>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDownloadTemplate}
                className="w-full"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Download Import Template
              </Button>
            </div>

            {importPreview.length > 0 && (
              <div className="space-y-2">
                <Label>Preview (first 5 rows)</Label>
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted">
                        {importPreview[0]?.map((header: string, i: number) => (
                          <th key={i} className="px-2 py-1 text-left font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.slice(1, 6).map((row: string[], i: number) => (
                        <tr key={i} className="border-t">
                          {row.map((cell: string, j: number) => (
                            <td key={j} className="px-2 py-1">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Make sure your file includes columns for: First Name, Last Name, Email, Phone,
                Gender, Status, and other member details. Download the template for the correct
                format.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {mode === 'export' ? (
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export {members.length} Members
            </Button>
          ) : (
            <Button onClick={handleImport} disabled={!importFile} className="gap-2">
              <Upload className="h-4 w-4" />
              Import Members
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
