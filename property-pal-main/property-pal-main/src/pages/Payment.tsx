import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Save, Lock, Calendar, User } from 'lucide-react';

const Payment = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem('pms_payment', JSON.stringify(formData));
      toast({
        title: 'Payment details saved',
        description: 'Your payment information has been securely saved.',
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Payment Details</h2>
        <p className="text-muted-foreground">Manage your payment information</p>
      </div>

      {/* Security Notice */}
      <Card className="border-0 shadow-md bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Secure Payment</p>
              <p className="text-xs text-muted-foreground">
                Your payment information is encrypted and stored securely.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Card Information
            </CardTitle>
            <CardDescription>Enter your credit or debit card details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Card Holder Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="cardHolder"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="cvv"
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="•••"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Input
                id="billingAddress"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleChange}
                placeholder="123 Main Street, City, State, ZIP"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card Preview */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="gradient-primary p-6 text-primary-foreground">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-8 bg-primary-foreground/30 rounded"></div>
              <CreditCard className="w-8 h-8" />
            </div>
            <div className="mb-6">
              <p className="text-xl tracking-widest font-mono">
                {formData.cardNumber || '•••• •••• •••• ••••'}
              </p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-primary-foreground/70 mb-1">Card Holder</p>
                <p className="font-medium uppercase">
                  {formData.cardHolder || 'YOUR NAME'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-primary-foreground/70 mb-1">Expires</p>
                <p className="font-medium">
                  {formData.expiryDate || 'MM/YY'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Payment Details
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
