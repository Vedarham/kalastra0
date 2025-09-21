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

const supportTickets = [
  {
    id: "TK-001",
    subject: "Order delivery issue",
    status: "In Progress",
    priority: "High",
    created: "2024-01-15",
    lastUpdate: "2024-01-16"
  },
  {
    id: "TK-002", 
    subject: "Payment refund request",
    status: "Resolved",
    priority: "Medium",
    created: "2024-01-10",
    lastUpdate: "2024-01-12"
  }
];

const supportMethods = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    availability: "24/7",
    responseTime: "Usually within 5 minutes",
    available: true
  },
  {
    icon: Mail,
    title: "Email Support", 
    description: "Send us a detailed message about your issue",
    availability: "24/7",
    responseTime: "Within 24 hours",
    available: true
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with a support representative",
    availability: "Mon-Fri, 9AM-6PM EST",
    responseTime: "Immediate",
    available: false
  }
];

export default function Support() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
    email: "john.doe@example.com"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support ticket created",
      description: "We've received your request and will respond within 24 hours"
    });
    setFormData({
      subject: "",
      category: "",
      priority: "",
      description: "",
      email: "john.doe@example.com"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Open": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-orange-100 text-orange-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
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
              {/* Create Ticket */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                  <CardDescription>
                    Describe your issue and we'll help you resolve it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="order">Order Issues</SelectItem>
                            <SelectItem value="payment">Payment & Billing</SelectItem>
                            <SelectItem value="account">Account Settings</SelectItem>
                            <SelectItem value="technical">Technical Issues</SelectItem>
                            <SelectItem value="seller">Seller Support</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Brief description of your issue"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide detailed information about your issue..."
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <Button type="submit" className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Ticket
                      </Button>
                      <Button type="button" variant="outline" className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        Attach Files
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Support Tickets</CardTitle>
                  <CardDescription>
                    Track the status of your recent support requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {supportTickets.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No support tickets</h3>
                      <p className="text-muted-foreground">
                        You haven't created any support tickets yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {supportTickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{ticket.subject}</h4>
                                <Badge className={getStatusColor(ticket.status)}>
                                  {ticket.status}
                                </Badge>
                                <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">#{ticket.id}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Created: {ticket.created}</span>
                                <span>Last update: {ticket.lastUpdate}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
