import Billing from '@/components/Billing';
import BMIPage from '@/components/BMIPage';

import Home from '@/components/Home';
import OurProgramms from '@/components/OurProgramms';
import Trainers from '@/components/Trainers';
import WhyChooseUs from '@/components/WhyChooseUs';
import React from 'react';

const Page = () => {
  return (
    <div className="grid">

      
      
      <section id="home">
        <Home />
      </section>

      {/* <section>
        <BMIPage/>
      </section> */}

      
      <section id="why-choose-us">
        <WhyChooseUs />
      </section>

      <section id="our-programmms">
        <OurProgramms/>
      </section>

      <section id='trainers'>
        <Trainers/>
      </section>

      <section id='billing'>
         <Billing/>
      </section>
    </div>
  );
};

export default Page;
