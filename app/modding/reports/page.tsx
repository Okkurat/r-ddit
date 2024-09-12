import React from 'react';
import Report from '@/models/report';
import { Report as ReportType } from "@/types/types";
import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import ReportCard from './ReportCard';
import { redirect } from 'next/navigation';
import { checkRole } from '@/app/server-actions';

const ReportsPage = async () => {
  const reports = await Report.find({}).lean().exec();
  const user = await currentUser();
  let data : ReportType[];

  if (!user) {
    return <div>Error</div>;
  }
  if (!checkRole('admin')) {
    redirect('/')
  }
  try {
    await connectDB();
    const reports = await Report.find({}).lean().exec();
    if(!reports){ return <div>No reports available</div>; }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return <div>Error</div>;
  } finally { 
    data = JSON.parse(JSON.stringify(reports));

  }
  const sortedReports = data.sort((a, b) => a.reportReason.localeCompare(b.reportReason));

  return (
    <div className="max-w-7xl mx-auto p-4 bg-[#121212] text-[#CCCCCC] rounded-lg border-2 border-[#242424]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
      </div>
      <div>
        {sortedReports.map((report: ReportType) => (
          <ReportCard key={report._id.toString()} report={report} />
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;