
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-owl-neutral flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-12 px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          {...fadeIn}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-owl-slate-dark mb-6">About Guardian Owlet</h1>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-subtle space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-owl-slate-dark mb-3">Our Mission</h2>
              <p className="text-owl-slate">
                Guardian Owlet was created with a simple but powerful mission: to transform education through 
                personalization and collaboration. We believe that when parents, teachers, and children work 
                together, learning becomes more engaging, effective, and enjoyable.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-owl-slate-dark mb-3">Our Story</h2>
              <p className="text-owl-slate mb-4">
                Founded by a team of educators and technology experts, Guardian Owlet emerged from a shared 
                frustration with the disconnect between classroom learning and home support. We saw that 
                parents wanted to be more involved in their children's education but lacked the tools and 
                guidance to do so effectively.
              </p>
              <p className="text-owl-slate">
                At the same time, teachers were seeking better ways to track student progress and communicate 
                with families. Our platform bridges these gaps, creating a seamless educational experience that 
                extends beyond school walls.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-owl-slate-dark mb-3">Our Approach</h2>
              <p className="text-owl-slate">
                Guardian Owlet takes a curriculum-first approach, ensuring that all content aligns with 
                educational standards from multiple countries. We've designed our platform to be intuitive 
                for users of all ages, with special attention to making the child's experience both 
                educational and fun.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
