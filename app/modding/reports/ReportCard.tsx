'use client';
import Link from "next/link";
import { Report as ReportType } from "@/types/types";
import { deleteReport } from "@/app/actions";

interface ReportCardProps {
  report: ReportType;
}

const ReportCard = ({ report }: ReportCardProps) => {
  const handleDelete = async () => {
    try {
      await deleteReport({reportId: report._id.toString()});
      console.log('Deleted report');
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  return (
    <div className="relative bg-[#121212] p-4 rounded-lg mb-4 border border-[#242424]">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold mb-2">{report.reportDetails}</h2>
        <button
          onClick={handleDelete}
          className="bg-[#242424] text-[#CCCCCC] py-2 px-4 rounded hover:bg-[#3E3F3E]"
        >
          Done
        </button>
      </div>
      <p><strong>Reason:</strong> {report.reportReason}</p>
      <p><strong>Author:</strong> {report.author}</p>
      <p><strong>Topic:</strong> {report.topic}</p>
      <p><strong>Timestamp: </strong>{report.timestamp}</p>

      <Link href={`/topic/${report.post}#${report.message}`}>
        <span className="inline-block mt-2 px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded">
          View Message
        </span>
      </Link>
    </div>
  );
};

export default ReportCard;
