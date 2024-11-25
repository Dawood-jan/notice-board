import React from 'react';
import AnimateOnScroll from "../components/dashboard/common/AnimateOnScroll";

const About = () => {
  return (
    <div className="bg-gray-100 p-8">
           <AnimateOnScroll animation="fade-left" duration={1000}>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About Notice Board System</h1>
      </AnimateOnScroll>
     
      <div className="max-w-4xl mx-auto space-y-12">
      <AnimateOnScroll animation="fade-right" duration={1000}>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            To provide a centralized, efficient platform for sharing important announcements and updates within our community. 
            Our digital notice board ensures timely communication while maintaining security and ease of use.
          </p>
        </section>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-right" duration={1000}>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Key Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Real-time notice updates</li>
            <li>Email notifications for new announcements</li>
            <li>Secure user authentication</li>
            <li>Category-based organization</li>
            <li>Mobile-responsive design</li>
            <li>Easy notice management</li>
          </ul>
        </section>

        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-right" duration={1000}>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Who Can Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700">Students</h3>
              <p className="text-gray-600">
                Access academic announcements, events, and important deadlines.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700">Faculty</h3>
              <p className="text-gray-600">
                Post and manage semester-specific notices and updates.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700">Administration</h3>
              <p className="text-gray-600">
                Share official announcements and departmental updates.
              </p>
            </div>
          </div>
        </section>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default About;
