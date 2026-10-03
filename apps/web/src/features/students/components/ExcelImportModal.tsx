import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Student } from '../../../shared/types/student.types';
import toast from 'react-hot-toast';

export interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (students: Partial<Student>[]) => { added: number; errors: string[] };
}

export const ExcelImportModal = ({
  isOpen,
  onClose,
  onImport,
}: ExcelImportModalProps) => {
  const [parsedData, setParsedData] = useState<Partial<Student>[]>([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const formatted = json.map((row) => ({
          name: row['Full Name'] || row['Name'] || row['name'] || 'Student',
          email: row['Email'] || row['email'] || `student${Math.floor(Math.random() * 1000)}@college.edu`,
          phone: row['Phone'] || '+91 98000 00000',
          registerNumber: row['Register No'] || row['RegNo'] || '',
          department: row['Department'] || 'Computer Applications',
          course: row['Course'] || 'BCA',
          section: row['Section'] || 'A',
          academic: {
            tenthPercentage: Number(row['10th %'] || 80),
            twelfthPercentage: Number(row['12th %'] || 80),
            cgpa: Number(row['CGPA'] || 7.5),
            activeBacklogs: Number(row['Active Backlogs'] || 0),
            clearedBacklogs: 0,
            semesterScores: [{ semester: 1, sgpa: Number(row['CGPA'] || 7.5) }],
          },
          placement: {
            status: (row['Placement Status'] as any) || 'Eligible',
            companyName: row['Placed Company'] || row['Company'],
            packageLPA: row['Package (LPA)'] ? Number(row['Package (LPA)']) : undefined,
            appliedCount: 0,
            interviewsCount: 0,
            offersCount: 0,
          },
          skills: row['Skills'] ? String(row['Skills']).split(',').map((s) => s.trim()) : ['Core Engineering'],
        }));

        setParsedData(formatted);
        setIsProcessing(false);
      } catch (err) {
        toast.error('Failed to parse Excel file. Please ensure standard spreadsheet format.');
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleConfirmImport = () => {
    if (parsedData.length === 0) return;
    const res = onImport(parsedData);
    if (res.added > 0) {
      toast.success(`Successfully imported ${res.added} students!`);
      setParsedData([]);
      setFileName('');
      onClose();
    } else {
      toast.error('Import failed. Please verify student attributes.');
    }
  };

  const handleReset = () => {
    setParsedData([]);
    setFileName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Import Students"
      description="Upload an Excel (.xlsx) or CSV file with student records."
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {parsedData.length === 0 ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-stone-200 dark:border-stone-800 hover:border-indigo-400 bg-stone-50/50 dark:bg-stone-900/30'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-50">
              Drag & drop spreadsheet here, or click to browse
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Supports .xlsx, .xls, and .csv files up to 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Selected Badge */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                    {fileName}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-300">
                    {parsedData.length} valid student rows parsed
                  </div>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-stone-800 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Live Data Preview Table */}
            <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">CGPA</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {parsedData.slice(0, 8).map((stu, i) => (
                    <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                      <td className="py-2 px-3 font-semibold text-stone-800 dark:text-stone-100">{stu.name}</td>
                      <td className="py-2 px-3 text-stone-500">{stu.email}</td>
                      <td className="py-2 px-3 text-stone-500">{stu.course}</td>
                      <td className="py-2 px-3 font-bold text-indigo-600">{stu.academic?.cgpa}</td>
                      <td className="py-2 px-3">{stu.placement?.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
          <span className="text-[11px] text-stone-400">
            Columns: Full Name, Email, Course, Department, CGPA, Placement Status
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" pill onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              pill
              disabled={parsedData.length === 0 || isProcessing}
              onClick={handleConfirmImport}
            >
              Import {parsedData.length > 0 ? `(${parsedData.length} Rows)` : ''}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
