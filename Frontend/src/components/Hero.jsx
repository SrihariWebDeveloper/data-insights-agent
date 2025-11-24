import React from 'react';
import image from '../assets/images_data_insitists.webp'

const Hero = () => (
  <section className="bg-linear-to-r from-indigo-600 to-sky-500 text-white py-20 text-center lg:text-left">
    <div className="container flex flex-col lg:flex-row items-center gap-8">
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4">Turn uploaded data into charts and insights</h1>
        <p className="text-lg opacity-90 mb-6">Upload CSV or JSON datasets, chat with the agent about the data, and generate interactive charts and metrics instantly.</p>
        <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
          <a href="/dashboard" className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold">Go to Dashboard</a>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-white/10 p-6 rounded-lg">
          {/* <p className="text-sm">Preview</p>
          <div className="h-40 bg-white/5 rounded mt-3 flex items-center justify-center">Charts & conversation live here</div> */}
          <img src={image} alt="Data Insights" />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
