import { useState } from 'react';
import { useLead } from '@/contexts/LeadContext';
import { useProperty } from '@/contexts/PropertyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Download,
  FileSpreadsheet,
  TrendingUp,
  Users,
  Home,
  DollarSign,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reports = () => {
  const { leads, getLeadStats } = useLead();
  const { properties, getPropertyStats } = useProperty();
  const { toast } = useToast();
  const [reportType, setReportType] = useState('leads');
  const [dateRange, setDateRange] = useState('all');

  const leadStats = getLeadStats();
  const propertyStats = getPropertyStats();

  const leadStatusData = [
    { name: 'Not Started', value: leadStats.notStarted, color: 'hsl(var(--chart-not-started))' },
    { name: 'In Progress', value: leadStats.inProgress, color: 'hsl(var(--chart-in-progress))' },
    { name: 'Complete', value: leadStats.complete, color: 'hsl(var(--chart-complete))' },
  ];

  const propertyStatusData = [
    { name: 'Available', value: propertyStats.available, color: 'hsl(var(--success))' },
    { name: 'Under Contract', value: propertyStats.underContract, color: 'hsl(var(--warning))' },
    { name: 'Sold', value: propertyStats.sold, color: 'hsl(var(--primary))' },
    { name: 'Rented', value: propertyStats.rented, color: 'hsl(var(--accent))' },
  ];

  const leadSourceData = [
    { name: 'Website', count: leads.filter((l) => l.source === 'website').length },
    { name: 'Referral', count: leads.filter((l) => l.source === 'referral').length },
    { name: 'Social Media', count: leads.filter((l) => l.source === 'social-media').length },
    { name: 'Advertisement', count: leads.filter((l) => l.source === 'advertisement').length },
    { name: 'Other', count: leads.filter((l) => l.source === 'other').length },
  ];

  const monthlyData = [
    { month: 'Jan', leads: 12, properties: 5, revenue: 45000 },
    { month: 'Feb', leads: 15, properties: 7, revenue: 62000 },
    { month: 'Mar', leads: 18, properties: 4, revenue: 38000 },
    { month: 'Apr', leads: 22, properties: 8, revenue: 78000 },
    { month: 'May', leads: 19, properties: 6, revenue: 55000 },
    { month: 'Jun', leads: 25, properties: 9, revenue: 92000 },
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text('PMS Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

    if (reportType === 'leads' || reportType === 'all') {
      // Lead Statistics
      doc.setFontSize(16);
      doc.text('Lead Statistics', 14, 45);
      
      autoTable(doc, {
        startY: 50,
        head: [['Status', 'Count']],
        body: [
          ['Not Started', leadStats.notStarted.toString()],
          ['In Progress', leadStats.inProgress.toString()],
          ['Complete', leadStats.complete.toString()],
          ['Total', (leadStats.notStarted + leadStats.inProgress + leadStats.complete).toString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [33, 97, 140] },
      });

      // Lead Details
      doc.setFontSize(16);
      const yPos = (doc as any).lastAutoTable.finalY + 15;
      doc.text('Lead Details', 14, yPos);

      autoTable(doc, {
        startY: yPos + 5,
        head: [['Name', 'Email', 'Phone', 'Property Type', 'Status']],
        body: leads.map((lead) => [
          `${lead.firstName} ${lead.lastName}`,
          lead.email,
          lead.phone,
          lead.propertyType,
          lead.status.replace('-', ' '),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [33, 97, 140] },
        styles: { fontSize: 9 },
      });
    }

    if (reportType === 'properties' || reportType === 'all') {
      if (reportType === 'all') {
        doc.addPage();
      }

      // Property Statistics
      doc.setFontSize(16);
      doc.text('Property Statistics', 14, reportType === 'all' ? 20 : 45);

      autoTable(doc, {
        startY: reportType === 'all' ? 25 : 50,
        head: [['Status', 'Count']],
        body: [
          ['Available', propertyStats.available.toString()],
          ['Under Contract', propertyStats.underContract.toString()],
          ['Sold', propertyStats.sold.toString()],
          ['Rented', propertyStats.rented.toString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [33, 97, 140] },
      });

      // Property Details
      const yPos2 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.text('Property Details', 14, yPos2);

      autoTable(doc, {
        startY: yPos2 + 5,
        head: [['Title', 'Type', 'Price', 'Location', 'Status']],
        body: properties.map((prop) => [
          prop.title,
          prop.propertyType,
          prop.priceUnit === 'total' ? `$${prop.price.toLocaleString()}` : `$${prop.price.toLocaleString()}/${prop.priceUnit}`,
          `${prop.city}, ${prop.state}`,
          prop.status.replace('-', ' '),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [33, 97, 140] },
        styles: { fontSize: 9 },
      });
    }

    doc.save(`PMS_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast({
      title: 'PDF Exported',
      description: 'Your report has been downloaded successfully.',
    });
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    if (reportType === 'leads' || reportType === 'all') {
      // Leads sheet
      const leadsData = leads.map((lead) => ({
        'First Name': lead.firstName,
        'Last Name': lead.lastName,
        'Email': lead.email,
        'Phone': lead.phone,
        'Property Type': lead.propertyType,
        'Requirement': lead.requirement,
        'Budget': lead.budget,
        'Status': lead.status.replace('-', ' '),
        'Source': lead.source.replace('-', ' '),
        'City': lead.city,
        'State': lead.state,
        'Created Date': new Date(lead.createdAt).toLocaleDateString(),
      }));
      const leadsSheet = XLSX.utils.json_to_sheet(leadsData);
      XLSX.utils.book_append_sheet(workbook, leadsSheet, 'Leads');

      // Lead Stats sheet
      const statsData = [
        { 'Status': 'Not Started', 'Count': leadStats.notStarted },
        { 'Status': 'In Progress', 'Count': leadStats.inProgress },
        { 'Status': 'Complete', 'Count': leadStats.complete },
        { 'Status': 'Total', 'Count': leadStats.notStarted + leadStats.inProgress + leadStats.complete },
      ];
      const statsSheet = XLSX.utils.json_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsSheet, 'Lead Statistics');
    }

    if (reportType === 'properties' || reportType === 'all') {
      // Properties sheet
      const propertiesData = properties.map((prop) => ({
        'Title': prop.title,
        'Type': prop.propertyType,
        'Listing Type': prop.listingType,
        'Price': prop.price,
        'Price Unit': prop.priceUnit,
        'Address': prop.address,
        'City': prop.city,
        'State': prop.state,
        'Bedrooms': prop.bedrooms || 'N/A',
        'Bathrooms': prop.bathrooms || 'N/A',
        'Square Footage': prop.squareFootage,
        'Status': prop.status.replace('-', ' '),
        'Created Date': new Date(prop.createdAt).toLocaleDateString(),
      }));
      const propertiesSheet = XLSX.utils.json_to_sheet(propertiesData);
      XLSX.utils.book_append_sheet(workbook, propertiesSheet, 'Properties');

      // Property Stats sheet
      const propStatsData = [
        { 'Status': 'Available', 'Count': propertyStats.available },
        { 'Status': 'Under Contract', 'Count': propertyStats.underContract },
        { 'Status': 'Sold', 'Count': propertyStats.sold },
        { 'Status': 'Rented', 'Count': propertyStats.rented },
      ];
      const propStatsSheet = XLSX.utils.json_to_sheet(propStatsData);
      XLSX.utils.book_append_sheet(workbook, propStatsSheet, 'Property Statistics');
    }

    XLSX.writeFile(workbook, `PMS_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast({
      title: 'Excel Exported',
      description: 'Your report has been downloaded successfully.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">View insights and export your data</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Data</SelectItem>
              <SelectItem value="leads">Leads Only</SelectItem>
              <SelectItem value="properties">Properties Only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={exportToExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-3xl font-bold">{leads.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-3xl font-bold">{properties.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-3xl font-bold">
                  {leads.length > 0
                    ? Math.round((leadStats.complete / leads.length) * 100)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Est. Revenue</p>
                <p className="text-3xl font-bold">$370K</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Lead Analytics</TabsTrigger>
          <TabsTrigger value="properties">Property Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="leads"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="properties"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--success))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Lead Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leadSourceData}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {leadStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {leadStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Lead Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['buy', 'sell', 'rent', 'lease'].map((req) => {
                    const count = leads.filter((l) => l.requirement === req).length;
                    const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
                    return (
                      <div key={req} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{req}</span>
                          <span className="text-muted-foreground">{count} leads ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Property Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {propertyStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {propertyStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Property Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['residential', 'commercial', 'industrial', 'land'].map((type) => {
                    const count = properties.filter((p) => p.propertyType === type).length;
                    const percentage = properties.length > 0 ? (count / properties.length) * 100 : 0;
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span className="text-muted-foreground">{count} properties ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Revenue Overview
              </CardTitle>
              <CardDescription>Monthly revenue trends (sample data)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
