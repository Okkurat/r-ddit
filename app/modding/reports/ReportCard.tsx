import Link from "next/link";
import { Report } from "@/types/types";

interface ReportCardProps {
  report: Report;
}

const ReportCard = ({ report } :ReportCardProps) => (
  <div className="bg-[#121212] p-4 rounded-lg mb-4 border border-[#242424]">
    <h2 className="text-xl font-semibold mb-2">{report.reportDetails}</h2>
    <p><strong>Reason:</strong> {report.reportReason}</p>
    <p><strong>Author:</strong> {report.author}</p>
    <p><strong>Topic:</strong> {report.topic}</p>
    <p><strong>Timestamp:</strong> {new Date(report.timestamp).toLocaleString()}</p>
    <Link href={`/topic/${report.post}#${report.message}`}>
      <span className="inline-block mt-2 px-4 py-2 px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded mt-2">
        View Message
      </span>
    </Link>
  </div>
);

export default ReportCard;