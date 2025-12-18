import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProperty } from '@/contexts/PropertyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar as CalendarIcon,
  DollarSign,
  Home,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProperty, updateProperty } = useProperty();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const property = id ? getProperty(id) : undefined;

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Property not found</p>
        <Button onClick={() => navigate('/properties')}>Back to Properties</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      'available': 'bg-success/10 text-success',
      'under-contract': 'bg-warning/10 text-warning',
      'sold': 'bg-primary/10 text-primary',
      'rented': 'bg-accent/10 text-accent',
    };
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const formatPrice = (price: number, unit: string) => {
    const formatted = price.toLocaleString();
    if (unit === 'total') return `$${formatted}`;
    return `$${formatted}/${unit}`;
  };

  const toggleDateAvailability = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingAvailability = property.availability.find((a) => a.date === dateStr);

    let newAvailability;
    if (existingAvailability) {
      newAvailability = property.availability.map((a) =>
        a.date === dateStr ? { ...a, available: !a.available } : a
      );
    } else {
      newAvailability = [...property.availability, { date: dateStr, available: false }];
    }

    updateProperty(property.id, { availability: newAvailability });
  };

  const isDateUnavailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const availability = property.availability.find((a) => a.date === dateStr);
    return availability ? !availability.available : false;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/properties')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{property.title}</h2>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(property.status)}
          <Button asChild>
            <Link to={`/properties/${property.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Property
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Gallery */}
          <Card className="border-0 shadow-md overflow-hidden">
            {property.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                <img
                  src={property.photos[0]}
                  alt={property.title}
                  className="col-span-2 w-full h-72 object-cover"
                />
                {property.photos.slice(1, 5).map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-36 object-cover"
                  />
                ))}
              </div>
            ) : (
              <div className="h-72 bg-secondary flex items-center justify-center text-muted-foreground">
                No photos available
              </div>
            )}
          </Card>

          {/* Description */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {property.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.bedrooms || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.bathrooms || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <Square className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.squareFootage.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Sq Ft</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.yearBuilt || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">Year Built</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-secondary rounded-full text-sm flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-success" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold">
                  {formatPrice(property.price, property.priceUnit)}
                </span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Property Type:</span>
                  <span className="capitalize font-medium text-foreground">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Listing Type:</span>
                  <span className="capitalize font-medium text-foreground">For {property.listingType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize font-medium text-foreground">{property.status.replace('-', ' ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Calendar */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Availability Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  unavailable: (date) => isDateUnavailable(date),
                }}
                modifiersStyles={{
                  unavailable: { 
                    backgroundColor: 'hsl(var(--destructive) / 0.1)',
                    color: 'hsl(var(--destructive))',
                  },
                }}
                className="rounded-md border"
              />
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span>Unavailable</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => selectedDate && toggleDateAvailability(selectedDate)}
              >
                Toggle Selected Date
              </Button>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p>Created: {new Date(property.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(property.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
