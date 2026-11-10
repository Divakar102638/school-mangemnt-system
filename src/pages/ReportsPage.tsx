import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart3, 
  Download, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  IndianRupee, 
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  TypeDistributionChart, 
  GrowthBarChart, 
  RevenueBreakdownChart 
} from '../components/charts/InteractiveCharts';
import { formatCurrencyINR, formatNumber } from '../utils/formatters';
import { exportInstitutionsToCSV } from '../utils/csvExport';

export const ReportsPage: React.FC = () => {
  const { institutions, stats } = useData();
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredInstitutions = selectedType === 'ALL'
    ? institutions
    : institutions.filter(i => i.type === selectedType);

  const totalFilteredStudents = filteredInstitutions.reduce((s, i) => s + (i.studentCount || 0), 0);
  const totalFilteredStaff = filteredInstitutions.reduce((s, i) => s + (i.staffCount || 0), 0);
  const totalFilteredRevenue = filteredInstitutions.reduce((s, i) => s + (i.annualAmount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Executive Reports & SaaS Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Audit-ready operational summaries, headcount rosters, and financial license reporting.
          </p>
        </div>

        <button
          onClick={() => exportInstitutionsToCSV(filteredInstitutions)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export All Records (CSV)
        </button>
      </div>

      {/* Filter and Overview Cards */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filter Reports by Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Categories ({institutions.length})</option>
            <option value="School">Schools Only</option>
            <option value="Intermediate College">Intermediate Colleges Only</option>
            <option value="Degree College">Degree Colleges Only</option>
            <option value="Engineering College">Engineering Colleges Only</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500">Campuses: <strong className="text-slate-900">{filteredInstitutions.length}</strong></span>
          <span className="text-slate-500">Students: <strong className="text-slate-900">{formatNumber(totalFilteredStudents)}</strong></span>
          <span className="text-slate-500">Staff: <strong className="text-slate-900">{formatNumber(totalFilteredStaff)}</strong></span>
          <span className="text-slate-500">ARR: <strong className="text-teal-700">{formatCurrencyINR(totalFilteredRevenue)}</strong></span>
        </div>
      </div>

      {/* High-level Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Campus Onboarding & Registration Trends</h3>
          <p className="text-xs text-slate-500">Chronological network expansion by academic quarter</p>
          <GrowthBarChart institutions={filteredInstitutions} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Institution Category Proportion</h3>
          <p className="text-xs text-slate-500">Relative distribution across primary, intermediate, and collegiate levels</p>
          <TypeDistributionChart institutions={filteredInstitutions} />
        </div>
      </div>

      {/* Institution-wise Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Institution-Wise Metric Audit</h3>
            <p className="text-xs text-slate-500">Detailed student headcount, faculty ratios, and contracted values</p>
          </div>
          <button
            onClick={() => exportInstitutionsToCSV(filteredInstitutions)}
            className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download Spreadsheet
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Institution Name & ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Students Enrolled</th>
                <th className="py-3 px-4">Capacity Utilization</th>
                <th className="py-3 px-4">Faculty Staff</th>
                <th className="py-3 px-4">Student : Staff Ratio</th>
                <th className="py-3 px-4 text-right">Annual Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstitutions.map(inst => {
                const util = Math.round(((inst.studentCount || 0) / inst.studentCapacity) * 100);
                const ratio = inst.staffCount > 0 ? Math.round(inst.studentCount / inst.staffCount) : 0;

                return (
                  <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inst.name}</div>
                      <span className="font-mono text-[10px] text-slate-400">ID: {inst.id}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">{inst.type}</td>

                    <td className="py-3.5 px-4 text-slate-700">{inst.city}</td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatNumber(inst.studentCount)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, util)}%` }}
                            className={`h-full rounded-full ${util > 90 ? 'bg-amber-500' : 'bg-teal-600'}`}
                          />
                        </div>
                        <span className="text-[11px] text-slate-600 font-medium">{util}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {inst.staffCount || 25}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {ratio} : 1
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-teal-800">
                      {formatCurrencyINR(inst.annualAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/70 font-bold text-slate-900 border-t border-slate-200">
                <td className="py-3 px-4">Total ({filteredInstitutions.length} campuses)</td>
                <td colSpan={2}></td>
                <td className="py-3 px-4">{formatNumber(totalFilteredStudents)}</td>
                <td></td>
                <td className="py-3 px-4">{formatNumber(totalFilteredStaff)}</td>
                <td></td>
                <td className="py-3 px-4 text-right text-teal-800">
                  {formatCurrencyINR(totalFilteredRevenue)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
