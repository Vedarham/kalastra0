import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Paperclip
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import { submitSupportTicket } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";


const supportMethods = [
  {
    icon: Mail,
    title: "Email Support", 
    description: "Send us a detailed message about your issue",
    availability: "24/7",
    responseTime: "Within 24 hours",
    available: true,
    action: () => window.location.href = "mailto:support@kalastra.com"
  }
];

export default function Support() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    try {
      setIsSubmitting(true);
      await submitSupportTicket({ ...formData, email: user?.email });
      toast({ title: "Ticket submitted successfully!" });
      setFormData({ subject: "", message: "" });
    } catch (error) {
      toast({ title: "Failed to submit ticket", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Support Center
            </h1>
            <p className="text-lg text-muted-foreground">
              Get help with your orders, account, or any other questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Methods</CardTitle>
                  <CardDescription>
                    Choose the best way to reach us
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div 
                        key={method.title}
                        onClick={method.action}
                        className={`p-4 border rounded-lg ${method.available ? 'cursor-pointer hover:bg-muted/50' : 'opacity-50'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{method.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {method.description}
                            </p>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <Clock className="h-3 w-3" />
                                <span>{method.availability}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {method.responseTime}
                              </div>
                            </div>
                            {!method.available && (
                              <Badge variant="secondary" className="mt-2">
                                Currently Unavailable
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Track Your Order
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Return & Refunds
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Account Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Payment Issues
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Seller Support
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reach Out to Us</CardTitle>
                  <CardDescription>
                    We currently use email to track all support queries.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject"
                        placeholder="What is this regarding?" 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message"
                        placeholder="Please describe your issue in detail..." 
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Submit Ticket"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
