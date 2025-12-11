import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import PropertyCard from '../components/PropertyCard';
import UpcomingProperties from '../components/UpcomingProperties';
import { label } from 'framer-motion/client';

// Mock data - in a real app, this would come from an API
export const mockProperties = [
  {
    id: 1,
    title: 'Luxury 3BHK Apartment in Mumbai',
    price: '₹1.5 Cr',
    location: 'Andheri West, Mumbai',
    type: 'Apartment',
    area: '1450 sqft',
    postedOn: "2 days ago",
    images: [{ url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/007-2.jpg', label: "Hall"},
      { url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/022-1.jpg', label: "Bedroom"},
      { url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/024-1.jpg', label: "Bedroom"},
      { url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/026.jpg', label: "Bedroom"},
      { url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/019-1.jpg', label: "Kitchen"},
      { url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/MG_0080-1.jpg', label: "Bathroom"},
    ],
    beds: 3,
    baths: 2,
    views: 27,
    isFeatured: true,
    purpose: 'for-sale',
    agentId: 1,
    agentName: "Rahul Sharma",
  },
  {
    id: 2,
    title: 'Modern 2BHK Flat in Pune',
    price: '₹75 L',
    location: 'Kharadi, Pune',
    type: 'Flat',
    area: '950 sqft',
    postedOn: "1 days ago",
    images: [{ url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiC3tThHp5Jp39N9AwLG-2CraME1zRfU7t06zKEPvyxUgOgw8Ug453NfojBR-1ap46MF3_UKqwP58cirRWYj_qzyOeCaU7FYBod8ZLE9PK9P-0ELRTucUvtPL0RhESmjBjrEad2XmTdHZOFuqiltFqf1TYI92KL32JNKoNPyf1Vr8cqk7aN2Ve8HEPR/s1600/IMG-20221205-WA0006.jpg', label: "Hall"},
      { url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiRsoshidBczBNQrQQU_WdzcSlbdj4FL_4rZ8WZW0inaB6tsIYnCYNzd_m04ZpZxORRx5vCVfItgupPDU5E-YI_sdZod-KS70OPECocShKj5P9A4v3adxn5fFOLtULjAmNbEumiFNfMMIM7umZJSNiTYdMce2ihU001F7p2EokkFBI5J8dz6x8aZ3sM/s1600/IMG-20221205-WA0014.jpg', label: ""},
      { url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifT8nFOW0sugPUvr6-rBDfmtXgZqu3M3kkuVWmXsDI6GIWPcM5ptdm3iB6dpWjHveJYqkoB_pAEZn7WH2sbq8xm3GAIzSA8TGFZnZw4BBnXOhXbYKcgTovtKp06XdNNpKiat4yEGziwgkfPP-nuiff1mIRDDVkYeGC0d5Ag6rV1WgncfkTugrEG9Mh/s1600/IMG-20221205-WA0008.jpg', label: "Balcony"},
    ],
    beds: 2,
    baths: 2,
    views: 38,
    purpose: 'for-sale',
    agentId: 5,
    agentName: "Vikram Bhosale",
  },
  {
    id: 3,
    title: 'Villa with Private Pool',
    price: '₹3.8 Cr',
    location: 'Whitefield, Bangalore',
    type: 'Villa',
    area: '2800 sqft',
    postedOn: "3 days ago",
    images: [{ url: 'https://villas.kumarinautilus.com/luxury-villas-whitefield-bangalore/1280/POOL%20VIEW%20033.jpg', label: "Property Image"},
      { url: 'https://villas.kumarinautilus.com/luxury-villas-whitefield-bangalore/1280/View_3.jpg', label: "Garden"},
      { url: 'https://villas.kumarinautilus.com/luxury-villas-whitefield-bangalore/1280/View_4.jpg', label: "Garden"},
    ],
    beds: 4,
    baths: 3,
    views: 36,
    purpose: 'for-sale',
    isFeatured: true,
    agentId: 2,
    agentName: "Priya Patel",
  },
  {
    id: 4,
    title: '1BHK Apartment for Rent',
    price: '₹1 Cr',
    location: 'Indiranagar, Bangalore',
    type: 'Apartment',
    area: '650 sqft',
    postedOn: "6 days ago",
    images: [{ url: 'https://media.designcafe.com/wp-content/uploads/2021/06/30135419/modern-1bhk-home-living-room-designed-with-comfortable-couch-and-tv-unit.jpg', label: "Hall"},
      { url: 'https://media.designcafe.com/wp-content/uploads/2021/06/30135412/modern-1bhk-bedroom-design-with-false-ceiling-and-queen-size-bed.jpg', label: "Bedroom"},
      { url: 'https://media.designcafe.com/wp-content/uploads/2021/06/30135426/modern-1-bhk-home-straight-kitchen-with-muted-colours-and-clean-lines.jpg', label: "Kitchen"},
      { url: 'https://media.designcafe.com/wp-content/uploads/2021/06/30135438/modern-1bhk-house-bathroom-design-with-white-and-grey-tiles-and-marble-flooring.jpg', label: "Bathroom"},
    ],
    beds: 1,
    baths: 1,
    views: 15,
    purpose: 'for-sale',
    agentId: 2,
    agentName: "Priya Patel",
  },
  {
    id: 5,
    title: '3BHK Flat in HSR Layout',
    price: '₹1.2 Cr',
    location: 'HSR Layout, Bangalore',
    type: 'Flat',
    area: '1350 sqft',
    postedOn: "1 days ago",
    images: [{ url: 'https://imagecdn.99acres.com/media1/26902/9/538049253M-1755114442118.jpg', label: "Hall"},
      { url: 'https://imagecdn.99acres.com/media1/26902/9/538049261M-1755114427481.jpg', label: "Bedroom"},
      { url: 'https://imagecdn.99acres.com/media1/26902/9/538049265M-1755114624687.jpg', label: "Kitchen"},
      { url: 'https://imagecdn.99acres.com/media1/26902/9/538049267M-1755114914741.jpg', label: "Bathroom"},
    ],
    beds: 3,
    baths: 2,
    views: 39,
    purpose: 'for-sale',
    agentId: 2,
    agentName: "Priya Patel",
  },
  {
    id: 6,
    title: '2BHK Flat in Electronic City',
    price: '₹18,000/month',
    location: 'Electronic City, Bangalore',
    type: 'Flat',
    area: '850 sqft',
    postedOn: "1 week ago",
    images: [{ url: 'https://dyimg2.realestateindia.com/prop_images/1392069/775829_1.jpg', label: "Property Image"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/1392069/775829_2.jpg', label: "Hall"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/1392069/775829_3.jpg', label: "Bedroom"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/1392069/775829_4.jpg', label: "Bedroom"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/1392069/775829_7.jpg', label: "Kitchen"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/1392069/775829_6.jpg', label: "Bathroom"},
    ],
    beds: 2,
    baths: 2,
    views: 25,
    purpose: 'for-rent',
    agentId: 2,
    agentName: "Priya Patel",
  },
  {
    id: 7,
    title: 'Luxury Penthouse with City View',
    price: '₹5.2 Cr',
    location: 'Bandra West, Mumbai',
    type: 'Penthouse',
    area: '3200 sqft',
    postedOn: "4 days ago",
    images: [{ url: 'https://www.guptasen.com/wp-content/uploads/2021/02/5-BHK-Ekta-Empress-Khar-penthouse.jpg', label: "Hall"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2021/02/furnished-penthouse-sale-bandra-Khar.jpg', label: ""},
      { url: 'https://www.guptasen.com/wp-content/uploads/2021/02/duplex-penthouse-furnished-bandra-west.jpg', label: ""},
      { url: 'https://www.guptasen.com/wp-content/uploads/2021/02/penthouse-duplex-homes-bandra-Mumbai.jpg', label: "Balcony"},
    ],
    beds: 3,
    baths: 3,
    views: 44,
    purpose: 'for-sale',
    isFeatured: true,
    agentId: 1,
    agentName: "Rahul Sharma",
  },
  {
    id: 8,
    title: '1BHK Studio Apartment',
    price: '₹15,000/month',
    location: 'Koramangala, Bangalore',
    type: 'Studio',
    area: '500 sqft',
    postedOn: "3 week ago",
    images: [{ url: 'https://newprojects.99acres.com/projects/sriven_properties/sriven_daksha_elite/images/uzuvzhv_1763028449_672272241_med.jpg', label: "Property Image"},
      { url: 'https://newprojects.99acres.com/projects/sriven_properties/sriven_daksha_elite/images/vainlq5_1763028603_672274119_med.jpg', label: "Bedroom"},
    { url: 'https://newprojects.99acres.com/projects/sriven_properties/sriven_daksha_elite/images/wofajmv_1763028606_672274163_med.jpg', label: "Hall"},
  ],
    beds: 1,
    baths: 1,
    views: 27,
    purpose: 'for-rent',
    agentId: 2,
    agentName: "Priya Patel",
  },
  {
    id: 9,
    title: '1BHK Apartment',
    price: '₹16,000/month',
    location: 'Karve Nagar, Pune',
    type: 'Apartment',
    area: '540 sqft',
    postedOn: "5 days ago",
    images: [{ url: 'https://cf.bstatic.com/xdata/images/hotel/max300/785650897.jpg?k=85cec98266e72db4fae55e8cd41f0013d55c6b8b6ea66b1471540b93b123e5f7&o=', label: "Property Image"},
      { url: 'https://cf.bstatic.com/xdata/images/hotel/max300/785650905.jpg?k=aabfe9c32b3297b54887e20022d833e6266f0e0aaf9d489775bb9646bd69e1c9&o=', label: "Hall"},
      { url: 'https://cf.bstatic.com/xdata/images/hotel/max300/785650891.jpg?k=b3a176ada6bcdf4097ae44a6ac7107c91dd759dee708ecf4d06ee4c4b855a337&o=', label: "Bedroom"},
    ],
    beds: 1,
    baths: 1,
    views: 17,
    purpose: 'for-rent',
    agentId: 5,
    agentName: "Vikram Bhosale",
  },
    {
    id: 10,
    title: '2BHK Apartment',
    price: '₹25,000/month',
    location: 'Karve Nagar, Pune',
    type: 'Apartment',
    area: '1050 sqft',
    postedOn: "4 days ago",
    images: [{ url: 'https://dyimg2.realestateindia.com/prop_images/3187878/1403647_5.jpg', label: "Hall"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/3187878/1403647_4.jpg', label: ""},
      { url: 'https://dyimg2.realestateindia.com/prop_images/3187878/1403647_6.jpg', label: "Bedroom"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/3187878/1403647_7.jpg', label: ""},
    ],
    beds: 2,
    baths: 2,
    views: 32,
    purpose: 'for-rent',
    agentId: 8,
    agentName: "Neha Soni",
  },
    {
    id: 11,
    title: 'Modern 2BHK Flat in Mumbai',
    price: '₹1.2 Cr',
    location: 'Lokhandwala, Mumbai',
    type: 'Apartment',
    area: '1050 sqft',
    postedOn: "2 week ago",
    images: [{ url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/10-2.jpg', label: "Property Image"},
      { url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/19-1.jpg', label: "Hall"},
      { url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/5-2.jpg', label: "Bedroom"},
      { url: 'https://www.uniqueshanti.com/wp-content/uploads/2018/11/16-1.jpg', label: "Kitchen"},
      { url:  'https://www.uniqueshanti.com/wp-content/uploads/2018/11/3-2.jpg', label: "Bathroom"},
    ],
    beds: 2,
    baths: 2,
    views: 30,
    purpose: 'for-sale',
    agentId: 1,
    agentName: "Rahul Sharma",
  },
    {
    id: 12,
    title: 'Premium 4BHK Villa',
    price: '₹2.5 Cr',
    location: 'Lonavala, Pune',
    type: 'Villa',
    area: '2200 sqft',
    postedOn: "1 month ago",
    images: [{ url: 'https://www.guptasen.com/wp-content/uploads/2023/06/lobby-oberoi-sky-heights-lokhandwala-andheri-west.webp', label: "Property Image"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2023/06/large-living-room-of-4-BHK-apartment-Oberoi-sky-heights.webp', label: "Hall"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2023/06/bedroom-of-4-BHK-Oberoi-Sky-heights-lokhandwala-back-road-mumbai.webp', label: "Bedroom"},
    ],
    beds: 4,
    baths: 4,
    views: 43,
    purpose: 'for-sale',
    agentId: 8,
    agentName: "Neha Soni",
  },
    {
    id: 13,
    title: '3BHK Apartment',
    price: '₹32,000/month',
    location: 'Karve Nagar, Pune',
    type: 'Apartment',
    area: '1200 sqft',
    postedOn: "6 days ago",
    images: [{ url: 'https://img.squareyards.com/secondaryPortal/IN_638927548243524144-060925112704274.jpeg?aio=w-400;h-250;crop;', label: "Hall"},
      { url: 'https://img.squareyards.com/secondaryPortal/IN_638927548246167195-060925112704274.jpeg?aio=w-400;h-250;crop;', label: "Bedroom"},
      { url: 'https://img.squareyards.com/secondaryPortal/IN_638927548246536780-060925112704274.jpeg?aio=w-400;h-250;crop;', label: "Bedroom"},
      { url: 'https://img.squareyards.com/secondaryPortal/IN_638927548247901983-060925112704274.jpeg?aio=w-400;h-250;crop;', label: "Kitchen"},
      { url: 'https://img.squareyards.com/secondaryPortal/IN_638927548246897695-060925112704274.jpeg?aio=w-400;h-250;crop;', label: "Bathroom"},
    ],
    beds: 3,
    baths: 3,
    views: 34,
    purpose: 'for-rent',
    agentId: 5,
    agentName: "Vikram Bhosale",
  },
   {
    id: 14,
    title: '4BHK Apartment',
    price: '₹36,000/month',
    location: 'Baner, Pune',
    type: 'Apartment',
    area: '2100 sqft',
    postedOn: "3 days ago",
    images: [{ url: 'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-11.webp', label: "Hall"},
      { url: 'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-01.webp', label: "Bedroom"},
      { url: 'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-07.webp', label: "Bedroom"},
      { url: 'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-02.webp', label: "Bedroom"},
      { url: 'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-03.webp', label: "Bedroom"},
    ],
    beds: 4,
    baths: 4,
    views: 21,
    purpose: 'for-rent',
    agentId: 5,
    agentName: "Vikram Bhosale",
  },
   {
    id: 15,
    title: '1BHK Apartment',
    price: '₹50 L',
    location: 'Wakad, Pune',
    type: 'Apartment',
    area: '800 sqft',
    postedOn: "5 days ago",
    images: [{ url: 'https://dynamic.realestateindia.com/prop_images/3760972/1354563_2.jpeg', label: "Hall"},
      { url: 'https://dynamic.realestateindia.com/prop_images/3760972/1354563_5.jpeg', label: "Bedroom"},
      { url: 'https://dynamic.realestateindia.com/prop_images/3760972/1354563_8.jpeg', label: "Kitchen"},
      { url: 'https://dynamic.realestateindia.com/prop_images/3760972/1354563_7.jpeg', label: "Bathroom"},
    ],
    beds: 1,
    baths: 1,
    views: 25,
    purpose: 'for-sale',
    agentId: 5,
    agentName: "Vikram Bhosale",
  },
   {
    id: 16,
    title: 'Premium 3BHK Villa',
    price: '₹2.2 Cr',
    location: 'Koregaon Park, Pune',
    type: 'Villa',
    area: '1600 sqft',
    postedOn: "3 days ago",
    images: [{ url: 'https://www.guptasen.com/wp-content/uploads/2023/02/supreme-villagio-corner-villa-3-BHK.webp', label: "Property Image"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2023/02/4-BHK-supreme-villagio-Pune.webp', label: "Hall"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2023/02/best-budget-villas-for-sale-pune.webp', label: "Bedroom"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2023/02/best-villa-projects-near-pune.webp', label: "Dining Table"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2023/02/supreme-villagio-somatane-pune.webp', label: "Balcony"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2023/02/best-villa-projects-somatane-pune.webp', label: "Bedroom  "},
    ],
    beds: 3,
    baths: 3,
    views: 45,
    purpose: 'for-sale',
    agentId: 8,
    agentName: "Neha Soni",
  },
  {
    id: 17,
    title: '3BHK Luxury Apartment',
    price: '₹32,000/month',
    location: 'Kharadi, Pune',
    type: 'Apartment',
    area: '1500 sqft',
    postedOn: "2 days ago",
    images: [{ url: 'https://dynamic.realestateindia.com/prop_images/3269472/1220018_1.jpg', label: "Hall"},
      { url: 'https://dynamic.realestateindia.com/prop_images/3269472/1220018_2.jpg', label: "Bedroom"},
      { url: 'https://dynamic.realestateindia.com/prop_images/3269472/1220018_7.jpg', label: "Bedroom"},
      { url: 'https://dynamic.realestateindia.com/prop_images/3269472/1220018_4.jpg', label: "Kitchen"},
    ],
    beds: 3,
    baths: 3,
    views: 43,
    purpose: 'for-rent',
    agentId: 8,
    agentName: "Neha Soni",
  },
  {
    id: 18,
    title: '2BHK Premium Flat',
    price: '₹85 L',
    location: 'Andheri West, Mumbai',
    type: 'Apartment',
    area: '950 sqft',
    postedOn: "1 week ago",
    images: [{ url: 'https://dyimg2.realestateindia.com/prop_images/2911909/1141895_1.jpg', label: "Property Image"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/2911909/1141895_2.jpg', label: "Garden"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/2911909/1141895_3.jpg', label: "Bedroom"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/2911909/1141895_5.jpg', label: "Bedroom"},
    ],
    beds: 2,
    baths: 2,
    views: 19,
    purpose: 'for-sale',
    agentId: 1,
    agentName: "Rahul Sharma",
  },
  {
    id: 19,
    title: '4BHK Ultra Luxury Villa',
    price: '₹3.2 Cr',
    location: 'Jubilee Hills, Hyderabad',
    type: 'Villa',
    area: '3000 sqft',
    postedOn: "4 days ago",
    images: [{ url: 'https://www.thepinnaclelist.com/wp-content/uploads/2020/06/06-Lines-of-Light-Luxury-Residence-Faber-Terrace-Singapore-900x546.jpg', label: "Property Image"},
      { url: 'https://www.thepinnaclelist.com/wp-content/uploads/2020/06/12-Lines-of-Light-Luxury-Residence-Faber-Terrace-Singapore-1024x769.jpg', label: ""},
      { url: 'https://www.thepinnaclelist.com/wp-content/uploads/2020/06/25-Lines-of-Light-Luxury-Residence-Faber-Terrace-Singapore-636x847.jpg', label: ""},
      { url: 'https://www.thepinnaclelist.com/wp-content/uploads/2020/06/14-Lines-of-Light-Luxury-Residence-Faber-Terrace-Singapore-688x517.jpg', label: "Kitchen"},

    ],
    beds: 4,
    baths: 4,
    views: 27,
    purpose: 'for-sale',
    agentId: 7,
    agentName: "Karan Desai",
  },
  {
    id: 20,
    title: '1BHK Studio Apartment',
    price: '₹25,000/month',
    location: 'Koramangala, Bengaluru',
    type: 'Apartment',
    area: '600  sqft',
    postedOn: "3 days ago",
    images: [{ url: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIwNDEwNjk0MjExMjEzMjg3OA%3D%3D/original/ff67bdfa-5bae-4590-8cc7-f86d61c176a0.jpeg?im_w=1200', label: "Hall"},
      { url: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIwNDEwNjk0MjExMjEzMjg3OA%3D%3D/original/25280c8d-9d64-464c-aead-fb0692e9e416.jpeg?im_w=1440', label: "Bedroom"},
      { url: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIwNDEwNjk0MjExMjEzMjg3OA%3D%3D/original/dae8151b-811f-4960-bc53-33a9b4cf66a9.jpeg?im_w=1440', label: "Kitchen"},
      { url: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIwNDEwNjk0MjExMjEzMjg3OA%3D%3D/original/9f151c3b-79d3-4b03-99d4-338d3e926b1c.jpeg?im_w=1440', label: "Bathroom"},
    ],
    beds: 1,
    baths: 1,
    views: 33,
    purpose: 'for-rent',
    agentId: 6,
    agentName: "Aishwarya Menon",
  },
    {
    id: 21,
    title: '3BHK Family Home',
    price: '₹1.1 Cr',
    location: 'Dwarka Sector 11, Delhi',
    type: 'Apartment',
    area: '1450 sqft',
    postedOn: "2 weeks ago",
    images: [{ url: 'https://im.proptiger.com/1/3109067/6/dwarka-mor-affordable-homes-elevation-117971152.jpeg?width=1336&height=768', label: "Property Image"},
      { url: 'https://im.proptiger.com/1/3109067/81/dwarka-mor-affordable-homes-kitchen-117971632.jpeg?width=1336&height=768', label: "Hall"},
      { url: 'https://im.proptiger.com/1/3109067/81/dwarka-mor-affordable-homes-kitchen-117971631.jpeg?width=1336&height=768', label: "Kitchen"},
    ],
    beds: 3,
    baths: 3,
    views: 29,
    purpose: 'for-sale',
    agentId: 3,
    agentName: "Amit Singh",
  },
    {
    id: 22,
    title: '2BHK Semi-Furnished Flat',
    price: '₹22,000/month',
    location: 'Wakad, Pune',
    type: 'Apartment',
    area: '900 sqft',
    postedOn: "1 days ago",
    images: [{ url: 'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_153651.jpg', label: "Property Image"},
      { url: 'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_145441.jpg', label: "Hall"},
      { url: 'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_151624.jpg', label: "Kitchen"},
      { url: 'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_145853.jpg', label: "Balcony"},
      { url: 'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_145749.jpg', label: "Bathroom"},
    ],
    beds: 2,
    baths: 2,
    views: 24,
    purpose: 'for-rent',
    agentId: 8,
    agentName: "Neha Soni",
  },
    {
    id: 23,
    title: '4BHK Penthouse',
    price: '₹4.5 Cr',
    location: 'Powai, Mumbai',
    type: 'Penthouse',
    area: '3200 sqft',
    postedOn: "5 days ago",
    images: [{ url: 'https://code-estate.com/wp-content/uploads/2025/03/penthouse-with-open-terrace-khar-west.jpg', label: "Hall"},
      { url: 'https://code-estate.com/wp-content/uploads/2025/03/spacious-4bhk-penthouse-pali-hill.jpg', label: "Dining Table"},
      { url: 'https://code-estate.com/wp-content/uploads/2025/03/cross-ventilated-penthouse-with-natural-light.jpg', label: "Bedrooom"},
      { url: 'https://code-estate.com/wp-content/uploads/2025/03/sea-view-penthouse-mumbai-dr-ambedkar-road.jpg', label: ""},
      { url: 'https://code-estate.com/wp-content/uploads/2025/03/premium-2300sqft-penthouse-sale-mumbai.jpg', label: ""},
    ],
    beds: 4,
    baths: 4,
    views: 38,
    purpose: 'for-sale',
    agentId: 1,
    agentName: "Rahul Sharma",
  },
     {
    id: 24,
    title: '2BHK Fully Furnished Apartment',
    price: '₹38,000/month',
    location: 'Hitech City, Hyderabad',
    type: 'Apartment',
    area: '1100  sqft',
    postedOn: "3 days ago",
    images: [{ url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/8a/2c/4a/skyla-serviced-apartments.jpg?w=1600&h=-1&s=1', label: "Property Image"},
      { url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/8a/2c/47/siting-lounge.jpg?w=2000&h=-1&s=1', label: "Hall"},
      { url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/99/0e/50/skyla-gachibowli.jpg?w=2000&h=-1&s=1', label: "Bedroom"},
      { url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/8a/2c/48/outside-view.jpg?w=1600&h=-1&s=1', label: "Bedroom"},
    ],
    beds: 2,
    baths: 2,
    views: 40,
    purpose: 'for-rent',
    agentId: 4,
    agentName: "Ananya Reddy",
  },
     {
    id: 25,
    title: '1BHK Budget Flat',
    price: '₹45 L',
    location: 'Mira Road, Mumbai',
    type: 'Apartment',
    area: '650 sqft',
    postedOn: "6 days ago",
    images: [{ url: 'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0000.jpg', label: "Hall"},
      { url: 'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0006.jpg', label: "Hall"},
      { url: 'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0001.jpg', label: "Bedroom"},
      { url: 'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0002.jpg', label: "Kitchen"},
      { url: 'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0004.jpg', label: "Bathroom"},
    ],
    beds: 1,
    baths: 1,
    views: 20,
    purpose: 'for-sale',
    agentId: 9,
    agentName: "Aditya Khanna",
  },
    {
    id: 26,
    title: '3BHK Corner Flat',
    price: '₹28,000/month',
    location: 'BTM Layout, Bengaluru',
    type: 'Apartment',
    area: '1300 sqft',
    postedOn: "4 days ago",
    images: [{ url: 'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_2.jpg', label: "Property Image"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_3.jpg', label: "Hall"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_4.jpg', label: "Bedroom"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_6.jpg', label: "Kitchen"},
      { url: 'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_5.jpg', label: "Bathroom"},
    ],
    beds: 3,
    baths: 2,
    views: 28,
    purpose: 'for-rent',
    agentId: 6,
    agentName: "Aishwarya Menon",
  },
    {
    id: 27,
    title: '4BHK Modern Villa',
    price: '₹2.9 Cr',
    location: 'Whitefield, Bengaluru',
    type: 'Villa',
    area: '2800 sqft',
    postedOn: "1 week ago",
    images: [{ url: 'https://www.decorpot.com/images/blogimage1681441444understanding-the-space-for-4-bhk-home.jpg', label: "Hall"},
      { url: 'https://www.decorpot.com/images/blogimage2021248753bedroom-design-for-4-bhk-home.jpg', label: "Bedroom"},
      { url: 'https://www.decorpot.com/images/blogimage1589277315kitchen-for-4-bhk-home.jpg', label: "Kitchen"},
    ],
    beds: 4,
    baths: 4,
    views: 26,
    purpose: 'for-sale',
    agentId: 6,
    agentName: "Aishwarya Menon",
  },
    {
    id: 28,
    title: '3BHK Spacious Home',
    price: '₹52,000/month',
    location: 'Noida Sector 76, Delhi NCR',
    type: 'Apartment',
    area: '1550 sqft',
    postedOn: "2 days ago",
    images: [{ url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595726.jpg?k=3b42c98d7911b80934b0ca30826e6d0c1aee228dd94020d7cd996d61d0088a62&o=', label: "Hall"},
      { url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595777.jpg?k=52b01bcf3b2154e86359dcc100c993a065eadc3c3908be47d4607a96f0677282&o=', label: "Bedroom"},
      { url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595780.jpg?k=0550a31fb032e4132647ee2840711ef06ed31cfcbc825fd223ef240cb39e94b7&o=', label: "Bedroom"},
      { url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595786.jpg?k=1de5ca25632c72318ae5507e5dc989ca32ad4b0b2b7bd232bb6ad41b416bdda2&o=', label: "Kitchen"},
      { url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595766.jpg?k=fc513312d0608f865731611b5cbd6fa30fe7a14c0fcb5cfc54c11ed67eecbef3&o=', label: "Bathroom"},
    ],
    beds: 3,
    baths: 3,
    views: 36,
    purpose: 'for-rent',
    agentId: 3,
    agentName: "Amit Singh",
  },
    {
    id: 29,
    title: '2BHK Compact Flat',
    price: '₹62 L',
    location: 'Kalyani Nagar, Pune',
    type: 'Apartment',
    area: '780 sqft',
    postedOn: "1 week ago",
    images: [{ url: 'https://gladwinsrealty.com/app/web/upload/medium/169_7592478d631874dbd2e2dfddbf88498a.jpg', label: "Hall" },
      { url: 'https://gladwinsrealty.com/app/web/upload/medium/169_3160c6e893938c47a0c014f8fae4d860.jpg', label: "Bedroom" },
      { url: 'https://gladwinsrealty.com/app/web/upload/medium/169_bbe34b0a2f448a75c3ccd34dfb8045b7.jpg', label: "Bedroom" },
      { url: 'https://gladwinsrealty.com/app/web/upload/medium/169_db1993809ffff68551d5e833a40719dc.jpg', label: "Kitchen" },
    ],
    beds: 2,
    baths: 1,
    views: 41,
    purpose: 'for-sale',
    agentId: 8,
    agentName: "Neha Soni",
  },
    {
    id: 30,
    title: '4BHK Premium Apartment',
    price: '₹55,000/month',
    location: 'Gachibowli, Hyderabad',
    type: 'Apartment',
    area: '2400 sqft',
    postedOn: "5 days ago",
    images: [{ url: 'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_141740__Building%20View.jpg', label: "Property Image" },
      { url: 'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_135912__Living%20Room.jpg', label: "Hall" },
      { url: 'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_135527__Bedroom%201.jpg', label: "Bedroom" },
      { url: 'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_140434__Bedroom%203.jpg', label: "Bedroom" },
      { url: 'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_135715__Kitchen.jpg', label: "Kitchen" },
    ],
    beds: 4,
    baths: 4,
    views: 22,
    purpose: 'for-rent',
    agentId: 4,
    agentName: "Ananya Reddy",
  },
   {
    id: 31,
    title: '1BHK Affordable Flat',
    price: '₹32 L',
    location: 'Ulwe, Navi Mumbai',
    type: 'Apartment',
    area: '600 sqft',
    postedOn: "3 days ago",
    images: [{ url: 'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/03/SAM_3161-n.jpg', label: "Hall"},
      { url: 'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/03/SAM_3164-copie-n.jpg', label: "Kitchen"},
      { url: 'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/03/SAM_3163-copie-n.jpg', label: "Bedroom"}
    ],
    beds: 1,
    baths: 1,
    views: 32,
    purpose: 'for-sale',
    agentId: 9,
    agentName: "Aditya Khanna",
  },
   {
    id: 32,
    title: '3BHK Elite Apartment',
    price: '₹48,000/month',
    location: 'Banashankari, Bengaluru',
    type: 'Apartment',
    area: '1600  sqft',
    postedOn: "1 days ago",
    images: [{ url: 'https://cbvalueaddrealty.in/wp-content/uploads/2023/11/3-BHK-Apartment-for-Sale-in-Brigade-Omega-1.jpg', label: "Property Image"},
      { url: 'https://cbvalueaddrealty.in/wp-content/uploads/2023/11/3-BHK-Apartment-for-Sale-in-Brigade-Omega-7.jpeg', label: "Hall"},
      { url: 'https://cbvalueaddrealty.in/wp-content/uploads/2023/11/3-BHK-Apartment-for-Sale-in-Brigade-Omega-9.jpeg', label: "Bedroom"},
      { url: 'https://cbvalueaddrealty.in/wp-content/uploads/2023/11/3-BHK-Apartment-for-Sale-in-Brigade-Omega-10.jpeg', label: "Bathroom"}
    ],
    beds: 3,
    baths: 3,
    views: 29,
    purpose: 'for-rent',
    agentId: 6,
    agentName: "Aishwarya Menon",
  },
   {
    id: 33,
    title: '2BHK Garden Facing Flat',
    price: '₹75 L',
    location: 'Viman Nagar, Pune',
    type: 'Apartment',
    area: '900 sqft',
    postedOn: "6 days ago",
    images: [{ url: 'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-25-1170x785.jpeg', label: "Property Image"},
      { url: 'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-7.jpeg', label: "Hall"},
      { url: 'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-24.jpeg', label: "Bedroom"},
      { url: 'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-17.jpeg', label: "Bedroom"},
      { url: 'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-2.jpeg', label: "Kitchen"},
    ],
    beds: 2,
    baths: 2,
    views: 19,
    purpose: 'for-sale',
    agentId: 5,
    agentName: "Vikram Bhosale",
  },
   {
    id: 34,
    title: '4BHK Large Family Home',
    price: '₹2.1 Cr',
    location: 'Panchkula, Delhi NCR',
    type: 'Independent House',
    area: '2600  sqft',
    postedOn: "1 month ago",
    images: [{ url: 'https://www.guptasen.com/wp-content/uploads/2025/03/bright-airy-living-room-vascon-orchids-linking-road-santacruz-west.webp', label: "Hall"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2025/03/3-BHK-vascon-orchids-linking-road-main-master-bedroom.webp', label: "Bedroom"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2025/03/vascon-orchids-linking-road-master-bedroom-of-2-BHK.webp', label: "Bedroom"},
      { url: 'https://www.guptasen.com/wp-content/uploads/2025/03/kitchen-at-2-BHK-vascon-orchids-linking-road.webp', label: "Kitchen"}
    ],
    beds: 4,
    baths: 4,
    views: 17,
    purpose: 'for-sale',
    agentId: 3,
    agentName: "Amit Singh",
  },
   {
    id: 35,
    title: '3BHK Highrise Flat',
    price: '₹40,000/month',
    location: 'Thane, Mumbai',
    type: 'Apartment',
    area: '1400 sqft',
    postedOn: "3 days ago",
    images: [{ url: 'https://0009.in/wp-content/uploads/classified-listing/2021/12/u.webp', label: "Property Image"},
      { url: 'https://0009.in/wp-content/uploads/classified-listing/2021/12/download-4.jpg', label: "Hall"},
      { url: 'https://0009.in/wp-content/uploads/classified-listing/2021/12/images.jpg', label: "Bedroom"},
      { url: 'https://0009.in/wp-content/uploads/classified-listing/2021/12/57981737_6_PropertyImage630-0185875372603_180_240.jpg', label: "Balcony"}
    ],
    beds: 3,
    baths: 3,
    views: 31,
    purpose: 'for-rent',
    agentId: 9,
    agentName: "Aditya Khanna",
  },
   {
    id: 36,
    title: '2BHK Modern Flat',
    price: '₹60 L',
    location: 'Kondapur, Hyderabad',
    type: 'Apartment',
    area: '850 sqft',
    postedOn: "2 weeks ago",
    images: [{ url: 'https://is1-2.housingcdn.com/4f2250e8/4560dacc3d4e5e99cd138672b8718015/v5/medium.jpg', label: "Property Image"},
      { url: 'https://imagecdn.99acres.com/media1/29751/1/595021271M-1755981280499.webp', label: "Hall"},
     { url: 'https://img.squareyards.com/secondaryPortal/638431872899609934-1002240641294129.jpg', label: "Bedroom"},
     { url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/537255732.jpg?k=c0b110ab2a7669a6c59029345a3d19713480f4cba6ccc00dd9d5d4898616a67e&o=&hp=1', label: "Bedroom"},
    ],
    beds: 2,
    baths: 2,
    views: 35,
    purpose: 'for-sale',
    agentId: 7,
    agentName: "Karan Desai",
  },
    {
    id: 37,
    title: '2BHK Sea-facing Apartment',
    price: '₹55,000/month',
    location: 'Bandra West, Mumbai',
    type: 'Apartment',
    area: '1100 sqft',
    postedOn: "2 days ago",
    images: [{ url: 'https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/false-ceiling-homes-pilot-1660820004-eRVFP/hometour-1660820029-cuOHh/ht-in-lr-0032-1661189252-OByZv/1-1661189264-VuCV5.jpg', label: "Hall"},
      { url: 'https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/false-ceiling-homes-pilot-1660820004-eRVFP/hometour-1660820029-cuOHh/ht-in-lr-0032-1661189252-OByZv/6-1661189292-GtoNb.jpg', label: "Kitchen"},
      { url: 'https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/false-ceiling-homes-pilot-1660820004-eRVFP/hometour-1660820029-cuOHh/ht-in-lr-0032-1661189252-OByZv/8-1661189307-2srhu.jpg', label: "Bedroom"}
    ],
    beds: 2,
    baths: 2,
    views: 15,
    purpose: 'for-rent',
    agentId: 9,
    agentName: "Aditya Khanna",
  },
    {
    id: 38,
    title: '3BHK Luxury Apartment',
    price: '₹1.35 Cr',
    location: 'Dwarka Sector 10, Delhi',
    type: 'Apartment',
    area: '1500 sqft',
    postedOn: "1 weeks ago",
    images: [{ url: 'https://imagecdn.99acres.com/media1/27013/0/540260619M-1755111487117.jpg', label: "Property Image"},
      { url: 'https://imagecdn.99acres.com/media1/27013/0/540260625M-1755111844086.jpg', label: "Hall"},
      { url: 'https://imagecdn.99acres.com/media1/27013/0/540260627M-1755111888041.jpg', label: ""}
    ],
    beds: 3,
    baths: 3,
    views: 21,
    purpose: 'for-sale',
    agentId: 3,
    agentName: "Amit Singh",
  },
    {
    id: 39,
    title: '2BHK Modern Flat',
    price: '₹48,000/month',
    location: 'Gachibowli, Hyderabad',
    type: 'Apartment',
    area: '1000 sqft',
    postedOn: "4 days ago",
    images: [{ url: 'https://dynamic.realestateindia.com/prop_images/1716752/880923_1.jpg', label: "Property Image"},
      {url: 'https://dynamic.realestateindia.com/prop_images/1716752/880923_2.jpeg', label: "Hall"},
      {url: 'https://dynamic.realestateindia.com/prop_images/1716752/880923_5.jpeg', label: "Bedroom"},
      {url: 'https://dynamic.realestateindia.com/prop_images/1716752/880923_4.jpeg', label: "Parking"},
      {url: 'https://dynamic.realestateindia.com/prop_images/1716752/880923_3.jpeg', label: "Kitchen"}
    ],
    beds: 2,
    baths: 2,
    views: 42,
    purpose: 'for-rent',
    agentId: 7,
    agentName: "Karan Desai",
  },
    {
    id: 40,
    title: '4BHK Premium Villa',
    price: '₹2.2 Cr',
    location: 'Whitefield, Bengaluru',
    type: 'Villa',
    area: '2600 sqft',
    postedOn: "2 weeks ago",
    images:[ { url :'https://newprojects.99acres.com/projects/urban_housing/urban_the_empress/images/empress.jpg', label: "Property Image"},
    {url :'https://imagecdn.99acres.com/media1/25650/0/513000925O-1755112546448.jpg', label: "Bedroom"},
    {url :'https://imagecdn.99acres.com/media1/25650/0/513000923O-1755112549513.jpg', label: "Bedroom"}
    ],
    beds: 4,
    baths: 3,
    views: 25,
    purpose: 'for-sale',
    agentId: 6,
    agentName: "Aishwarya Menon",    
  },
];

const propertyTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'apartment', name: 'Apartment' },
  { id: 'flat', name: 'Flat' },
  { id: 'villa', name: 'Villa' },
  { id: 'penthouse', name: 'Penthouse' },
  { id: 'studio', name: 'Studio' },
];

const bedOptions = [
  { id: 'any', name: 'Any' },
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4+', name: '4+' },
];

const purpose = [
  { id: 'all', name: 'All Types' },
  { id: 'for-rent', name: 'For Rent' },
  { id: 'for-sale', name: 'For Sale' },
];

const agentName = [
  { id: 'all', name: 'All Agent' },
  { id: 'Rahul Sharma', name: 'Rahul Sharma' },
  { id: 'Priya Patel', name: 'Priya Patel' },
  { id: 'Amit Singh', name: 'Amit Singh' },
  { id: 'Ananya Reddy', name: 'Ananya Reddy' },
  { id: 'Vikram Bhosale', name: 'Vikram Bhosale' },
  { id: 'Aishwarya Menon', name: 'Aishwarya Menon' },
  { id: 'Karan Desai', name: 'Karan Desai' },
  { id: 'Neha Soni', name: 'Neha Soni' },
  { id: 'Aditya Khanna', name: 'Aditya Khanna' },
];

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    purpose: searchParams.get('purpose') || 'all',
    agentName: searchParams.get('agentName') || 'all',
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('property-type') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    beds: searchParams.get('beds') || 'any',
    sortBy: 'newest',
  });

    // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6; 
  
  const [activeFilters, setActiveFilters] = useState({
    location: false,
    propertyType: false,
    price: false,
    beds: false,
    purpose: false,
    agentName: false,
  });

  // Filter properties based on search parameters
  const filteredProperties = mockProperties.filter(property => {
    // Filter by purpose (buy/rent)
    if (filters.purpose && filters.purpose !== 'all' && property.purpose !==filters.purpose) {return false;}
    
    // Filter by Agent
    if (filters.agentName && filters.agentName !== 'all' && property.agentName !==filters.agentName) {return false;}
    
    // Filter by location
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by property type
    if (filters.propertyType !== 'all' && property.type.toLowerCase() !== filters.propertyType) {
      return false;
    }
    
    // Filter by number of bedrooms
    if (filters.beds !== 'any') {
      if (filters.beds === '4+' && property.beds < 4) return false;
      if (filters.beds !== '4+' && property.beds !== parseInt(filters.beds)) return false;
    }
    
    // Filter by price range (simplified for demo)
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice.replace(/[^0-9]/g, ''));
      const propertyPrice = parseInt(property.price.replace(/[^0-9]/g, ''));
      if (propertyPrice < minPrice) return false;
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice.replace(/[^0-9]/g, ''));
      const propertyPrice = parseInt(property.price.replace(/[^0-9]/g, ''));
      if (propertyPrice > maxPrice) return false;
    }
    
    return true;
  });

  // Convert price from Cr / L to number
const convertPrice = (price) => {
  let p = price.replace(/[₹,]/g, "").trim();

  if (p.includes("Cr")) {
    return parseFloat(p) * 10000000; // 1 Cr = 1 Crore
  }
  if (p.includes("L") || p.includes("Lakh")) {
    return parseFloat(p) * 100000;   // 1 Lakh
  }
  if (p.includes("month")) {    
    return parseInt(p);  // rent case monthly
  }
  return parseInt(p);
};


  // Sort properties

  const sortedProperties = [...filteredProperties].sort((a, b) => {
  if (filters.sortBy === 'price-asc') {
    return convertPrice(a.price) - convertPrice(b.price);
  } 
  else if (filters.sortBy === 'price-desc') {
    return convertPrice(b.price) - convertPrice(a.price);
  } 
  else if (filters.sortBy === 'newest') {
    return b.id - a.id;
  }
  return 0;
});


    // ✅ Pagination calculation
const indexOfLastCard = currentPage * cardsPerPage;
const indexOfFirstCard = indexOfLastCard - cardsPerPage;
const currentCards = sortedProperties.slice(indexOfFirstCard, indexOfLastCard);

// ✅ Total pages
const totalPages = Math.ceil(sortedProperties.length / cardsPerPage);



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFilterSection = (section) => {
    setActiveFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    setFilters({
      purpose: 'all',
      location: '',
      propertyType: 'all',
      minPrice: '',
      maxPrice: '',
      beds: 'any',
      sortBy: 'newest',
      agentName: 'all'
    });
  };

  return (
    <div className="pt-16 pb-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {filters.purpose === 'for-rent' ? 'Properties for Rent' : 'Properties for Sale'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {filteredProperties.length} properties found
            {filters.location && ` in ${filters.location}`}
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Hidden on mobile by default */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Clear All
                </button>
              </div>
              
              {/* Location Filter */}
              <div className="mb-6">
                <button 
                  className="flex justify-between items-center w-full text-left mb-2"
                  onClick={() => toggleFilterSection('location')}
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">Location</span>
                  {activeFilters.location ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {activeFilters.location && (
                  <div className="mt-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        placeholder="Search location..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Property Type Filter */}
              <div className="mb-6">
                <button 
                  className="flex justify-between items-center w-full text-left mb-2"
                  onClick={() => toggleFilterSection('propertyType')}
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">Property Type</span>
                  {activeFilters.propertyType ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {activeFilters.propertyType && (
                  <div className="mt-2 space-y-2">
                    {propertyTypes.map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="radio"
                          name="propertyType"
                          value={type.id}
                          checked={filters.propertyType === type.id}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Property purpose */}
              <div className="mb-6">
                <button 
                  className="flex justify-between items-center w-full text-left mb-2"
                  onClick={() => toggleFilterSection('purpose')}
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">Property Purpose</span>
                  {activeFilters.purpose ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {activeFilters.purpose && (
                  <div className="mt-2 space-y-2">
                    {purpose.map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="radio"
                          name="purpose"
                          value={type.id}
                          checked={filters.purpose === type.id}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Agent Filter */}
              <div className="mb-6">
                <button 
                  className="flex justify-between items-center w-full text-left mb-2"
                  onClick={() => toggleFilterSection('agentName')}
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">Agent Filter</span>
                  {activeFilters.agentName ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {activeFilters.agentName && (
                  <div className="mt-2 space-y-2">
                    {agentName.map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="radio"
                          name="agentName"
                          value={type.id}
                          checked={filters.agentName === type.id}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <button 
                  className="flex justify-between items-center w-full text-left mb-2"
                  onClick={() => toggleFilterSection('price')}
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">Price Range</span>
                  {activeFilters.price ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {activeFilters.price && (
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Min Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="text"
                          name="minPrice"
                          value={filters.minPrice}
                          onChange={handleFilterChange}
                          placeholder="Min"
                          className="block w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="text"
                          name="maxPrice"
                          value={filters.maxPrice}
                          onChange={handleFilterChange}
                          placeholder="Max"
                          className="block w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Beds Filter */}
              <div className="mb-6">
                <button 
                  className="flex justify-between items-center w-full text-left mb-2"
                  onClick={() => toggleFilterSection('beds')}
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">Bedrooms</span>
                  {activeFilters.beds ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {activeFilters.beds && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {bedOptions.map((option) => (
                      <label key={option.id} className="flex items-center">
                        <input
                          type="radio"
                          name="beds"
                          value={option.id}
                          checked={filters.beds === option.id}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and Filter Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <button 
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center text-gray-700 dark:text-gray-300 mr-4"
                >
                  <FiFilter className="mr-2" />
                  <span>Filters</span>
                </button>
                
                <div className="flex flex-wrap gap-2">
                  {filters.propertyType !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {propertyTypes.find(t => t.id === filters.propertyType)?.name}
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, propertyType: 'all' }))}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                  
                  {filters.beds !== 'any' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {filters.beds === '4+' ? '4+ Beds' : `${filters.beds} Bed`}
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, beds: 'any' }))}
                        className="ml-2 text-green-500 hover:text-green-700"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                  
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {filters.minPrice && `₹${filters.minPrice}${filters.maxPrice ? ' - ' + '₹' + filters.maxPrice : '+'}`}
                      {!filters.minPrice && filters.maxPrice && `Up to ₹${filters.maxPrice}`}
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}
                        className="ml-2 text-purple-500 hover:text-purple-700"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-300 mr-2 whitespace-nowrap">
                  Sort By:
                </label>
                {/* <select
                  id="sort"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select> */}

                <select 
              name="sortBy"
              value={filters.sortBy}
               onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low To High</option>
              <option value="price-desc">Price: High To Low</option>
              </select>
              </div>
            </div>
            
            {/* Property Grid */}
            {currentCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCards.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No properties found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We couldn't find any properties matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Clear all filters
                </button>
              </div>
            )}

      {/* ✅ Pagination Buttons */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-5 py-2 rounded-lg text-white ${
            currentPage === 1 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        {/* Page numbers */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-3 py-1 rounded-md ${
            currentPage === index + 1
              ? "bg-primary text-white"
              : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {index + 1}
        </button>
      ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-5 py-2 rounded-lg text-white ${
            currentPage === totalPages ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>



          </div>
        </div>
        <div>
          <UpcomingProperties/>
        </div>
      </div>
    </div>
  );
}
