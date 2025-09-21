import { useState } from "react";
import { ChevronDown, Search, MessageCircle, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MarketplaceHeader from "@/components/MarketplaceHeader";

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        id: "1",
        question: "How do I create an account?",
        answer: "To create an account, click the 'Sign Up' button in the top right corner. Fill in your email, create a password, and verify your email address. You'll be able to start shopping immediately after verification."
      },
      {
        id: "2", 
        question: "Is CraftMarket free to use?",
        answer: "Yes, creating an account and browsing items is completely free. We only charge a small transaction fee when you make a purchase to help us maintain the platform and support our artisans."
      },
      {
        id: "3",
        question: "How do I find specific items?",
        answer: "Use our search bar at the top of the page to find specific items. You can also browse by categories, filter by price range, or explore featured collections from our top creators."
      }
    ]
  },
  {
    category: "Orders & Shipping",
    questions: [
      {
        id: "4",
        question: "How long does shipping take?",
        answer: "Shipping times vary by artisan and your location. Most items ship within 3-5 business days, with delivery taking 5-10 business days for domestic orders and 10-20 business days for international orders."
      },
      {
        id: "5",
        question: "Can I track my order?",
        answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track all your orders in the 'My Orders' section of your profile."
      },
      {
        id: "6",
        question: "What if my item arrives damaged?",
        answer: "We're sorry if your item arrives damaged! Please contact us within 48 hours of delivery with photos of the damage. We'll work with the artisan to provide a replacement or full refund."
      }
    ]
  },
  {
    category: "Payments & Refunds",
    questions: [
      {
        id: "7",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, UPI payments, net banking, and digital wallets like PayPal, Apple Pay, and Google Pay."
      },
      {
        id: "8",
        question: "How do refunds work?",
        answer: "Refunds are processed within 5-7 business days to your original payment method. For UPI and wallet payments, refunds may appear instantly or within 24 hours."
      },
      {
        id: "9",
        question: "Can I cancel my order?",
        answer: "You can cancel your order within 2 hours of placing it, as long as the artisan hasn't started working on it. After that, cancellations depend on the individual artisan's policy."
      }
    ]
  },
  {
    category: "For Sellers",
    questions: [
      {
        id: "10",
        question: "How do I become a seller?",
        answer: "Click 'Sell' in the top navigation and choose 'Become a Seller'. You'll need to provide some basic information about yourself and your craft, upload photos of your work, and agree to our seller terms."
      },
      {
        id: "11",
        question: "What are the seller fees?",
        answer: "We charge a 5% commission on each sale, plus payment processing fees (typically 2.9% + $0.30). There are no listing fees or monthly charges."
      },
      {
        id: "12",
        question: "When do I get paid?",
        answer: "Payments are released to sellers 3 days after the customer receives their order, or 10 days after shipping (whichever comes first). You can view your earnings in your seller dashboard."
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQs = faqData
    .filter(category => selectedCategory === "all" || category.category === selectedCategory)
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
             q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Find answers to common questions about CraftMarket
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === "all" ? "All Categories" : category}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="space-y-6">
            {filteredFAQs.map((category) => (
              <Card key={category.category}>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No FAQs found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
                </p>
                <Button onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}>
                  View All FAQs
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact Section */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Start Live Chat
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}