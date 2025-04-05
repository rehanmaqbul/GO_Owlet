
import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

const ContactPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle the form submission here
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-owl-neutral flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-12 px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          {...fadeIn}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-owl-slate-dark mb-6 text-center">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-subtle">
              <h2 className="text-2xl font-semibold text-owl-slate-dark mb-6">Get In Touch</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-owl-slate mb-1">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-owl-slate mb-1">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="your.email@example.com" required />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-owl-slate mb-1">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-owl-slate mb-1">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us what you need..." 
                    className="min-h-[120px]" 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  {formSubmitted ? 'Message Sent!' : 'Send Message'}
                </Button>
              </form>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-subtle">
              <h2 className="text-2xl font-semibold text-owl-slate-dark mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-owl-blue mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-owl-slate-dark">Email</h3>
                    <p className="text-owl-slate">support@guardianowlet.com</p>
                    <p className="text-owl-slate">info@guardianowlet.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-owl-blue mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-owl-slate-dark">Phone</h3>
                    <p className="text-owl-slate">+1 (555) 123-4567</p>
                    <p className="text-owl-slate">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-owl-blue mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-owl-slate-dark">Address</h3>
                    <p className="text-owl-slate">
                      123 Education Lane<br />
                      Learning City, ED 12345<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 mt-6 border-t border-gray-200">
                  <h3 className="font-medium text-owl-slate-dark mb-2">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-owl-blue hover:text-owl-blue-dark">Twitter</a>
                    <a href="#" className="text-owl-blue hover:text-owl-blue-dark">Facebook</a>
                    <a href="#" className="text-owl-blue hover:text-owl-blue-dark">LinkedIn</a>
                    <a href="#" className="text-owl-blue hover:text-owl-blue-dark">Instagram</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
