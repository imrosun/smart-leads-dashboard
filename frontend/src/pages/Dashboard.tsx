import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import type { Lead, Pagination } from '../types';
import LeadList from '../components/leads/LeadList';
import LeadFilter from '../components/leads/LeadFilter';
import LeadForm from '../components/leads/LeadForm';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [filters, setFilters] = useState({
    status: '',
    source: '',
    search: '',
    sort: 'latest',
    page: 1,
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/leads', { params: filters });
      setLeads(data.data.leads);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch leads', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters.status, filters.source, filters.search, filters.sort, filters.page]);

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (error) {
        console.error('Failed to delete lead', error);
        alert('Failed to delete lead');
      }
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('No data to export');
      return;
    }
    
    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
    const csvData = leads.map(lead => [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
      new Date(lead.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and track your leads effectively.</p>
        </div>
        
        <button
          onClick={() => { setSelectedLead(null); setIsFormOpen(true); }}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm shadow-blue-500/30"
        >
          <Plus size={20} className="mr-2" />
          Add Lead
        </button>
      </div>

      <LeadFilter 
        filters={filters} 
        setFilters={setFilters} 
        onExport={handleExportCSV} 
      />

      <LeadList 
        leads={leads} 
        pagination={pagination} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))} 
      />

      <LeadForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        lead={selectedLead} 
        onSuccess={fetchLeads} 
      />
    </div>
  );
}
