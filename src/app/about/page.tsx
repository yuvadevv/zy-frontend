import { constructMetadata } from '@/lib/seo/metadata';

export const metadata = constructMetadata({
  title: 'About BLINTZY | Campus Printing & Academic Documents',
  description: 'Learn about BLINTZY, a smart campus platform designed to simplify printing and academic document services for students at Ramachandra College of Engineering (RCE), Eluru.',
  canonicalPath: '/about',
});

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">About BLINTZY</h1>
      <div className="text-lg space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-3">What is BLINTZY?</h2>
          <p>
            BLINTZY is a smart campus platform designed to simplify printing and academic document services for students. 
            We provide a fast, easy, and convenient way for students to handle their printing needs without waiting in long queues.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">What Problem Does BLINTZY Solve?</h2>
          <p>
            Students often face long lines, manual file transfers, and last-minute rushes to print essential academic documents like hall tickets and manuals. 
            BLINTZY eliminates these pain points by allowing students to upload their documents online, customize their print options, and pick up their prints—or even have them delivered directly to the classroom.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Services</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Campus Printing:</strong> Order prints directly from your phone.</li>
            <li><strong>Academic Manuals:</strong> Browse and print required course materials.</li>
            <li><strong>Hall Tickets:</strong> Quick, stress-free printing before exams.</li>
            <li><strong>Campus Delivery:</strong> Get your printed documents delivered directly to your classroom.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Where is BLINTZY Available?</h2>
          <p>
            BLINTZY is launching its campus printing and academic document experience for students at Ramachandra College of Engineering (RCE) in Eluru.
          </p>
        </section>
      </div>
    </div>
  );
}
