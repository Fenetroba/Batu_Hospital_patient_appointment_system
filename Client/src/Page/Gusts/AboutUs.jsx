import React from 'react';


const AboutUs = () => {

  return (
    <div className="w-full bg-[var(--one)] sm:p-16">
      <div className=" sm:p-16 mx-auto">
        {/* Hospital Info */}
          <h1 className="text-3xl font-bold mb-4">About Batu Hospital</h1>
        <div className="bg-[var(--three)] p-15 sm:flex rounded-xl text-white w-full ">
        <div >
            <h2 className="text-xl font-bold mb-2">Vision</h2>
          <p>    We inspire seeing Batu Hospital being center of excellence in
            the country in quality health care service delivery, and having
            healthy, productive and prosperous community.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Mission</h2>
          <p>   To reduce  morbidity , mortality, disability  and improve  the health  status of the people  through  provision  of quality curative, rehabilitative, promotive  and preventive  health  services.
          </p>
        </div>

        </div>

     

      </div>
    </div>
  );
};

export default AboutUs;

