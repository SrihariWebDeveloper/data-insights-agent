import React from 'react';

const Features = () => {
  const items = [
    { title: 'Chat with data', desc: 'Ask questions and get answers about your uploaded dataset.' },
    { title: 'Auto charts', desc: 'Agent suggests charts and metrics based on the data.' },
    { title: 'Shareable files', desc: 'Files are uploaded to Cloudinary and accessible anywhere.' },
  ];

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-4">Uses of this agent</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.title} data-aos="fade-up" className="p-6 border rounded-lg reveal">
            <h4 className="font-semibold mb-2">{it.title}</h4>
            <p className="text-sm text-slate-600">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
