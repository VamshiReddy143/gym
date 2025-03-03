import Billing from '@/components/Billing';
import Home from '@/components/Home';
import OurProgramms from '@/components/OurProgramms';
import Trainers from '@/components/Trainers';
import WhyChooseUs from '@/components/WhyChooseUs';
import Link from 'next/link';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';

const Page = () => {
  return (
    <div>
      <Link href={"/group-chat"}>

        <div className='fixed bottom-20 right-10 z-50 h-12 w-12 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group'>
          <IoChatbubbleEllipsesOutline className='text-xl animate-bounce group-hover:scale-110 transition-transform duration-300' />
        </div>
      </Link>


      <section id="home">
        <Home />
      </section>
      <section id="why-choose-us">
        <WhyChooseUs />
      </section>
      <section id="our-programmms">
        <OurProgramms />
      </section>
      <section id="trainers">
        <Trainers />
      </section>
      <section id="billing">
        <Billing />
      </section>
    </div>
  );
};

export default Page;