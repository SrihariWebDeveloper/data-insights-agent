import React from 'react'

const HowItWorks = () => {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-4">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div data-aos="fade-up" className="p-6 border rounded-lg reveal">
          <h3 className="font-semibold mb-2">Upload dataset</h3>
          <p className="text-sm text-slate-600">Send CSV or JSON files from the browser. Files are stored in Cloudinary for fast delivery.</p>
        </div>
        <div data-aos="fade-up" data-aos-delay="120" className="p-6 border rounded-lg reveal">
          <h3 className="font-semibold mb-2">Agent analysis</h3>
          <p className="text-sm text-slate-600">The agent analyzes data and generates charts, metrics, and summaries via backend endpoints.</p>
        </div>
        <div data-aos="fade-up" data-aos-delay="240" className="p-6 border rounded-lg reveal">
          <h3 className="font-semibold mb-2">Interact & visualize</h3>
          <p className="text-sm text-slate-600">Chat about the dataset and explore generated charts interactively in the dashboard.</p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
