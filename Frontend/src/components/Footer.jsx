import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className="border-t mt-12">
            <div className="container py-6 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} AnalytIQ. All rights reserved.
            </div>
        </footer>
    </div>
  )
}

export default Footer
