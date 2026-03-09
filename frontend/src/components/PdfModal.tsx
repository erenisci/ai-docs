import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiFile, FiRefreshCw, FiTrash, FiUploadCloud, FiX } from 'react-icons/fi';

interface PDFModalProps {
  setPdfModalOpen: (open: boolean) => void;
}

const PDFModal: React.FC<PDFModalProps> = ({ setPdfModalOpen }) => {
  const [pdfList, setPdfList] = useState<{ name: string; size_mb: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/list-pdfs/');
      setPdfList(Array.isArray(response.data.pdfs) ? response.data.pdfs : []);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      setPdfList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://127.0.0.1:8000/upload-pdf/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('File uploaded successfully!');
      setFile(null);
      fetchPDFs();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        alert(error.response.data.detail || 'This file already exists.');
      } else {
        console.error('Error uploading file:', error);
        alert('Failed to upload file.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleProcessPDFs = async () => {
    setProcessing(true);
    try {
      await axios.post('http://127.0.0.1:8000/process-pdfs/');
      alert('All PDFs processed successfully!');
      fetchPDFs();
    } catch (error) {
      console.error('Error processing PDFs:', error);
      alert('Failed to process PDFs.');
    } finally {
      setProcessing(false);
    }
  };

  const deletePDF = async (fileName: string) => {
    try {
      const encodedFileName = encodeURIComponent(fileName);
      await axios.delete(`http://127.0.0.1:8000/delete-pdf/?pdf_name=${encodedFileName}`);
      alert('File deleted successfully!');
      fetchPDFs();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file.');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50'>
      <div className='bg-[#0f1320] border border-[#1e2840] rounded-2xl p-6 w-[30rem] shadow-2xl shadow-black/50'>
        {/* Modal Header */}
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-base font-semibold text-[#e8eaf0]'>PDF Files</h2>
          <button
            onClick={() => setPdfModalOpen(false)}
            className='p-1.5 rounded-lg text-[#8892a4] hover:text-[#e8eaf0] hover:bg-[#1c2236] transition-all duration-200'
          >
            <FiX size={16} />
          </button>
        </div>

        {/* PDF List */}
        {loading ? (
          <p className='text-[#505a70] text-sm'>Loading...</p>
        ) : pdfList.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 gap-2'>
            <FiFile
              size={24}
              className='text-[#2a3347]'
            />
            <p className='text-[#505a70] text-sm'>No PDFs yet</p>
          </div>
        ) : (
          <ul className='max-h-[15rem] overflow-y-auto flex flex-col gap-1.5'>
            {pdfList.map((pdf, index) => (
              <li
                key={index}
                className='flex justify-between items-center bg-[#151929] border border-[#1e2840] px-3 py-2 rounded-xl'
              >
                <span className='flex items-center gap-2 text-sm text-[#c8ccd8] truncate'>
                  <FiUploadCloud
                    size={15}
                    className='text-[#6366f1] flex-shrink-0'
                  />
                  {pdf.name.length > 35 ? pdf.name.slice(0, 35).trim() + '...' : pdf.name}
                </span>
                <div className='flex items-center gap-2 ml-2 flex-shrink-0'>
                  <span className='text-xs text-[#505a70]'>{pdf.size_mb} MB</span>
                  <button
                    onClick={() => deletePDF(pdf.name)}
                    className='p-1.5 rounded-lg text-[#505a70] hover:text-[#ef4444] hover:bg-[#2d1515] transition-colors duration-200'
                  >
                    <FiTrash size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Upload Section */}
        <div className='mt-4 flex gap-2'>
          <label className='flex-1 flex items-center gap-2 px-3 py-2.5 bg-[#151929] border border-[#2a3347] hover:border-[#6366f1] transition-all duration-200 rounded-xl cursor-pointer justify-center text-sm text-[#8892a4] hover:text-[#e8eaf0]'>
            <FiFile size={15} />
            <span>
              {file ? file.name.slice(0, 16) + (file.name.length > 16 ? '...' : '') : 'Select PDF'}
            </span>
            <input
              type='file'
              accept='.pdf'
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
              className='hidden'
            />
          </label>
          <button
            onClick={handleFileUpload}
            className='flex-1 bg-[#6366f1] hover:bg-[#4f52d8] transition-all duration-200 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-sm text-white font-medium disabled:opacity-50 shadow-lg shadow-indigo-900/20'
            disabled={uploading || !file}
          >
            <FiUploadCloud size={15} />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <button
          onClick={handleProcessPDFs}
          className='w-full bg-[#1e2040] hover:bg-[#252d5a] border border-[#6366f1]/30 hover:border-[#6366f1]/60 transition-all duration-200 mt-2 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm text-[#818cf8] font-medium disabled:opacity-50'
          disabled={processing}
        >
          <FiRefreshCw
            size={15}
            className={processing ? 'animate-spin' : ''}
          />
          {processing ? 'Synchronizing...' : 'Process PDFs'}
        </button>
      </div>
    </div>
  );
};

export default PDFModal;
