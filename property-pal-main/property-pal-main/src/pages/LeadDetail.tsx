import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLead } from '@/contexts/LeadContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, User, Mail, Phone, MapPin, Home, FileText, Calendar, Tag } from 'lucide-react';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLead } = useLead();

  const lead = id ? getLead(id) : undefined;

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Lead not found</p>
        <Button onClick={() => navigate('/leads')}>Back to Leads</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      'not-started': 'bg-destructive/10 text-destructive',
      'in-progress': 'bg-warning/10 text-warning',
      'complete': 'bg-success/10 text-success',
    };
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/leads')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{lead.firstName} {lead.lastName}</h2>
            <p className="text-muted-foreground">{lead.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(lead.status)}
          <Button asChild>
            <Link to={`/leads/${lead.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Lead
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{lead.firstName} {lead.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{lead.phone}</p>
              </div>
            </div>
            {lead.dateOfBirth && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{new Date(lead.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Lead Source</p>
                <p className="font-medium capitalize">{lead.source.replace('-', ' ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Requirements */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              Property Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Property Type</p>
                <p className="font-medium capitalize">{lead.propertyType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requirement</p>
                <p className="font-medium capitalize">{lead.requirement}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">{lead.budget || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Location</p>
                <p className="font-medium">{lead.preferredLocation || 'Not specified'}</p>
              </div>
              {lead.bedrooms && (
                <div>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="font-medium">{lead.bedrooms}</p>
                </div>
              )}
              {lead.bathrooms && (
                <div>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p className="font-medium">{lead.bathrooms}</p>
                </div>
              )}
              {lead.squareFootage && (
                <div>
                  <p className="text-sm text-muted-foreground">Square Footage</p>
                  <p className="font-medium">{lead.squareFootage} sq ft</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lead.address || lead.city || lead.state || lead.zipCode ? (
              <div className="space-y-2">
                {lead.address && <p className="font-medium">{lead.address}</p>}
                <p className="text-muted-foreground">
                  {[lead.city, lead.state, lead.zipCode].filter(Boolean).join(', ')}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No address provided</p>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={lead.notes ? '' : 'text-muted-foreground'}>
              {lead.notes || 'No notes added'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timestamps */}
      <Card className="border-0 shadow-md">
        <CardContent className="py-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Created: {new Date(lead.createdAt).toLocaleString()}</span>
            <span>Last Updated: {new Date(lead.updatedAt).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadDetail;
