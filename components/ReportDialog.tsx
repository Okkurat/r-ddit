import React, { FormEvent, useState } from 'react';

interface ReportDialogProps {
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const ReportDialog = ({ onClose, onSubmit }: ReportDialogProps) => {
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(reportReason, reportDetails);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#171717] p-6 rounded border border-[#242424] max-w-sm w-full"
      >
        <h2 className="text-lg font-bold mb-4">Report Message</h2>
        <p className="mb-6">Please provide details for the report:</p>
        <div className="mb-4">
          <label htmlFor="report-reason" className="block text-sm font-medium text-[#CCCCCC] mb-2">Reason</label>
          <select
            onChange={(e) => setReportReason(e.target.value)}
            name="reason"
            value={reportReason}
            className="w-full bg-[#242424] text-[#CCCCCC] border border-[#3E3F3E] rounded px-3 py-2"
            required
          >
            <option value="">Select a reason</option>
            <option value="spam">Spam</option>
            <option value="abuse">Abuse</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="report-details" className="block text-sm font-medium text-[#CCCCCC] mb-2">Details</label>
          <textarea
            name="details"
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            rows={4}
            className="w-full bg-[#242424] text-[#CCCCCC] border border-[#3E3F3E] rounded px-3 py-2"
            required
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#242424] text-[#CCCCCC] hover:bg-[#3E3F3E] px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#242424] text-[#CCCCCC] hover:bg-[#3E3F3E] px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportDialog;