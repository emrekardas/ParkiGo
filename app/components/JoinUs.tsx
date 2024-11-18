'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function JoinUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#FCC502]/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 relative">
            <Image
              src="/parking-space.jpg"
              alt="Parking Garage"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              Do You Own a Parking Space?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join ParkiGo and turn your parking space into a profitable venture. 
              List your parking spot, set your own rates, and start earning today!
            </p>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#FCC502]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Easy listing process</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#FCC502]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Set your own availability and rates</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#FCC502]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Secure payments and insurance</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#FCC502]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">24/7 customer support</span>
              </li>
            </ul>
            <Link
              href="/join-us"
              className="inline-block mt-6 px-8 py-4 bg-[#FCC502] text-black text-lg font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Join Us Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
