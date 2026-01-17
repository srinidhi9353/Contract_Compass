import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle,
  BookOpen,
  MessageCircle,
  LifeBuoy,
  Mail,
  Phone,
  FileText,
  Shield,
  Users,
  Zap,
  Clock,
  Star,
  Search
} from 'lucide-react';

export default function Help() {
  return (
    <MainLayout title="Help Center" subtitle="Find answers to common questions and get support">
      <div className="space-y-8">
        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Quick Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Documentation</h3>
                  <p className="text-sm text-muted-foreground">Learn how to use Contract Compass</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">Get help from our team</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Watch step-by-step guides</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create a new contract?</AccordionTrigger>
              <AccordionContent>
                To create a new contract, navigate to the Contracts section and click on the "New Contract" button. 
                You can either create from scratch or use one of our pre-built templates from the Blueprints section.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I collaborate with others on contracts?</AccordionTrigger>
              <AccordionContent>
                Yes! Contract Compass supports collaboration. You can invite team members to view, edit, 
                and sign contracts. Use the sharing options in the contract details page to send invitations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How secure is my data?</AccordionTrigger>
              <AccordionContent>
                We take security seriously. All your data is encrypted both in transit and at rest. 
                We use industry-standard security protocols and regular security audits to ensure your 
                contracts remain safe and private.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I integrate with other tools?</AccordionTrigger>
              <AccordionContent>
                Yes, Contract Compass offers various integrations with popular business tools. 
                Check out the Integrations section in Settings to connect with your CRM, accounting software, 
                and other platforms you use daily.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
              <AccordionContent>
                You can cancel your subscription anytime from the Billing section in Settings. 
                Your access will continue until the end of your current billing period. 
                Contact support if you need assistance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Support Options */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-primary" />
            Need More Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <CardTitle>Email Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team typically responds within 24 hours during business days.
                </p>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <CardTitle>Live Chat</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Available 24/7 for immediate assistance. Chat with our support agents.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Highlights */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Feature Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="mx-auto p-3 rounded-full bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-medium mb-1">Quick Setup</h3>
              <p className="text-sm text-muted-foreground">Get started in minutes with our intuitive interface</p>
            </Card>
            
            <Card className="text-center p-4">
              <div className="mx-auto p-3 rounded-full bg-green-100 text-green-600 w-12 h-12 flex items-center justify-center mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-medium mb-1">Secure Storage</h3>
              <p className="text-sm text-muted-foreground">Enterprise-grade security for all your documents</p>
            </Card>
            
            <Card className="text-center p-4">
              <div className="mx-auto p-3 rounded-full bg-purple-100 text-purple-600 w-12 h-12 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-medium mb-1">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">Work together seamlessly with your team</p>
            </Card>
            
            <Card className="text-center p-4">
              <div className="mx-auto p-3 rounded-full bg-orange-100 text-orange-600 w-12 h-12 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-medium mb-1">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">Stay informed with live contract status updates</p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}