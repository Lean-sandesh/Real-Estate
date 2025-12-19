import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiShare2, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaBed, FaBath, FaRulerCombined, FaParking, FaSwimmingPool, FaWifi, FaTv, FaSnowflake, FaDumbbell, FaUtensils, FaCoffee, FaWineGlassAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
// import similarProperties from '../data/similarProperties.json';

// Mock data - in a real app, this would come from an API
const mockProperty = [{
  id: 1,
  title: 'Luxury 3BHK Apartment in Mumbai',
  price: '₹1.5 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Andheri West, Mumbai, Maharashtra',
  landmarks: [
    { name: 'Andheri West Metro Station', distance: '1.4 km' },
    { name: 'Infinity Mall, Andheri', distance: '2.1 km' },
    { name: 'Lokhandwala Market', distance: '2.8 km' },
    { name: 'Juhu Beach', distance: '3.5 km' }
  ],
  address: 'Flat No. 1203, Shree Heights, Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053',
  type: 'Apartment',
  area: '1450 sqft',
  carpetArea: '1250 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 25,
  floorNo: 12,
  description: 'This luxurious 3BHK apartment is located in the heart of Andheri West, offering a perfect blend of comfort and style. The property features a spacious living room, modern kitchen with modular fittings, and elegant flooring throughout. The master bedroom comes with an attached bathroom and walk-in closet. The apartment offers a stunning view of the city skyline and is equipped with all modern amenities.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/007-2.jpg',
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/022-1.jpg',
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/024-1.jpg',
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/026.jpg', 
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/019-1.jpg',
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/MG_0080-1.jpg'
  ],
  agent: {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@estatepro.com',
    image: 'https://www.constructionweekonline.in/cloud/2022/12/15/AmFI3uBe-Siddhart-Goel-1-1200x1201.jpg',
    company: 'EstatePro Realtors',
    experience: '12+ years',
    propertiesListed: 245,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 2,
  title: 'Modern 2BHK Flat in Pune',
  price: '₹75 L',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Kharadi, Pune, Maharashtra',
  landmarks: [
    { name: 'EON IT Park', distance: '1.6 km' },
    { name: 'World Trade Center Pune', distance: '2.3 km' },
    { name: 'Phoenix Marketcity, Viman Nagar', distance: '4.8 km' },
    { name: 'Pune International Airport', distance: '7.5 km' }
  ],
  address: 'Flat No. 502, Sky Avenue Apartments, EON IT Park Road, Kharadi, Pune, Maharashtra 411014',
  type: 'Flat',
  area: '950 sqft',
  carpetArea: '750 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 5,
  floorNo: 3,
  description: 'This modern 2BHK flat is located in the prime residential area of Kharadi, Pune, offering a perfect balance of comfort and convenience. The property features a well-designed living hall with ample natural light, a functional kitchen, and premium flooring throughout the home. Both bedrooms are spacious and thoughtfully planned, with well-ventilated bathrooms fitted with modern fixtures. The balcony provides a refreshing outdoor space, ideal for relaxation. Situated close to IT parks, schools, hospitals, and shopping hubs, this flat is an excellent choice for families and working professionals looking for a quality lifestyle in Pune.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiC3tThHp5Jp39N9AwLG-2CraME1zRfU7t06zKEPvyxUgOgw8Ug453NfojBR-1ap46MF3_UKqwP58cirRWYj_qzyOeCaU7FYBod8ZLE9PK9P-0ELRTucUvtPL0RhESmjBjrEad2XmTdHZOFuqiltFqf1TYI92KL32JNKoNPyf1Vr8cqk7aN2Ve8HEPR/s1600/IMG-20221205-WA0006.jpg',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiRsoshidBczBNQrQQU_WdzcSlbdj4FL_4rZ8WZW0inaB6tsIYnCYNzd_m04ZpZxORRx5vCVfItgupPDU5E-YI_sdZod-KS70OPECocShKj5P9A4v3adxn5fFOLtULjAmNbEumiFNfMMIM7umZJSNiTYdMce2ihU001F7p2EokkFBI5J8dz6x8aZ3sM/s1600/IMG-20221205-WA0014.jpg',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifT8nFOW0sugPUvr6-rBDfmtXgZqu3M3kkuVWmXsDI6GIWPcM5ptdm3iB6dpWjHveJYqkoB_pAEZn7WH2sbq8xm3GAIzSA8TGFZnZw4BBnXOhXbYKcgTovtKp06XdNNpKiat4yEGziwgkfPP-nuiff1mIRDDVkYeGC0d5Ag6rV1WgncfkTugrEG9Mh/s1600/IMG-20221205-WA0008.jpg',
  ],
  agent: {
    name: 'Vikram Bhosale',
    phone: '+91 88556 77012',
    email: 'vikram.bhosale@commercialhub.in',
    image: 'https://tse3.mm.bing.net/th/id/OIP.FGXPANbJ2zYz5gcf87vkRgHaJ4?pid=Api&h=220&P=0',
    company: 'EstatePro Realtors',
    experience: '13+ years',
    propertiesListed: 310,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 3,
  title: 'Villa with Private Pool',
  price: '₹3.8 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Whitefield, Bangalore, Karnataka',
  landmarks: [
    { name: 'ITPL (International Tech Park)', distance: '2.8 km' },
    { name: 'Forum Neighbourhood Mall', distance: '4.1 km' },
    { name: 'Vydehi Hospital', distance: '3.6 km' },
    { name: 'Hope Farm Junction Metro Station', distance: '3.2 km' }
  ],
  address: 'Villa No. 18, Adarsh Palm Retreat, Off Varthur Road, Whitefield, Bangalore, Karnataka 560066',
  type: 'Villa',
  area: '2800 sqft',
  carpetArea: '2600 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 2,
  floorNo: 0,
  description: 'This premium villa with a private pool is located in the upscale residential locality of Whitefield, Bangalore, offering an unmatched blend of luxury, privacy, and modern living. Spread across a generous 2800 sq.ft built-up area with 2600 sq.ft carpet space, the villa features spacious living and dining areas, elegant interiors, and high-quality finishes throughout. The private swimming pool adds a resort-like feel, perfect for relaxation and entertaining guests. Designed with a north-facing layout, the villa ensures excellent natural light and ventilation. With world-class amenities, ready-to-move-in status, and proximity to IT hubs, international schools, hospitals, and premium shopping destinations, this property is an ideal choice for families seeking an exclusive and sophisticated lifestyle in Bangalore.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://villas.kumarinautilus.com/luxury-villas-whitefield-bangalore/1280/POOL%20VIEW%20033.jpg',
    'https://villas.kumarinautilus.com/luxury-villas-whitefield-bangalore/1280/View_3.jpg',
    'https://villas.kumarinautilus.com/luxury-villas-whitefield-bangalore/1280/View_4.jpg',
  ],
  agent: {
    name: 'Priya Patel',
    phone: '+91 98765 43211',
    email: 'priya.patel@realestate.com',
    image: 'https://images.timesnownews.com/thumb/msid-119158435,thumbsize-24784,width-1280,height-720,resizemode-75/119158435.jpg',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 187,
    rating: 4.8,
    reviews: 128,
  }
},
{
  id: 4,
  title: '2BHK Apartment',
  price: '₹1 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Indiranagar, Bangalore, Karnataka',
  landmarks: [
    { name: 'Indiranagar Metro Station', distance: '0.9 km' },
    { name: '100 Feet Road', distance: '1.2 km' },
    { name: 'Manipal Hospital, Old Airport Road', distance: '2.6 km' },
    { name: 'MG Road', distance: '4.5 km' }
  ],
  address: 'Flat No. 304, Sri Sai Residency, 12th Main Road, HAL 2nd Stage, Indiranagar, Bangalore, Karnataka 560038',
  type: 'Apartment',
  area: '650 sqft',
  carpetArea: '500 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 10,
  floorNo: 6,
  description: 'This well-planned 1BHK apartment is located in the prime residential area of Indiranagar, Bangalore, making it an ideal choice for working professionals and small families. Spread across 650 sq.ft of built-up area with a 500 sq.ft carpet area, the apartment features a comfortable living space, a modern kitchen with efficient layout, and a spacious bedroom with ample ventilation. Situated on the 6th floor of a 10-storey building, the south-facing apartment receives good natural light and airflow throughout the day. The property is ready to move and offers access to essential and lifestyle amenities such as lift, power backup, parking, gym, and swimming pool. With excellent connectivity to metro stations, IT hubs, cafes, and shopping zones, this apartment offers a convenient and comfortable urban lifestyle in Bangalore.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://media.designcafe.com/wp-content/uploads/2021/06/30135419/modern-1bhk-home-living-room-designed-with-comfortable-couch-and-tv-unit.jpg',
    'https://media.designcafe.com/wp-content/uploads/2021/06/30135412/modern-1bhk-bedroom-design-with-false-ceiling-and-queen-size-bed.jpg',
    'https://media.designcafe.com/wp-content/uploads/2021/06/30135426/modern-1-bhk-home-straight-kitchen-with-muted-colours-and-clean-lines.jpg',
    'https://media.designcafe.com/wp-content/uploads/2021/06/30135438/modern-1bhk-house-bathroom-design-with-white-and-grey-tiles-and-marble-flooring.jpg'
    ],
  agent: {
    name: 'Priya Patel',
    phone: '+91 98765 43211',
    email: 'priya.patel@realestate.com',
    image: 'https://images.timesnownews.com/thumb/msid-119158435,thumbsize-24784,width-1280,height-720,resizemode-75/119158435.jpg',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 187,
    rating: 4.8,
    reviews: 128,
  }
},
{
  id: 5,
  title: '3BHK Flat in HSR Layout',
  price: '₹1.2 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'HSR Layout, Bangalore, Karnataka',
  landmarks: [
    { name: 'HSR BDA Complex', distance: '1.3 km' },
    { name: 'Agara Lake', distance: '2.4 km' },
    { name: 'NIFT College', distance: '1.9 km' },
    { name: 'Silk Board Junction', distance: '3.2 km' }
  ],
  address: 'Flat No. 401, Green View Residency, 5th Sector, HSR Layout, Bangalore, Karnataka 560102',
  type: 'Flat',
  area: '1350 sqft',
  carpetArea: '1200 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 20,
  floorNo: 12,
  description: 'This spacious 3BHK flat is located in the well-established and highly sought-after residential area of HSR Layout, Bangalore. Spread across a 1350 sq.ft built-up area with 1200 sq.ft carpet space, the flat offers a thoughtfully designed living and dining area, a modern kitchen, and three well-proportioned bedrooms with excellent ventilation. Situated on the 12th floor of a 20-storey building, the east-facing apartment enjoys abundant natural light and pleasant views. The property is ready to move and comes equipped with premium amenities including lift, power backup, parking, gym, and swimming pool. With close proximity to IT hubs, reputed schools, hospitals, shopping centers, and easy connectivity to major parts of the city, this flat is an ideal choice for families looking for a comfortable and modern lifestyle in Bangalore.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://imagecdn.99acres.com/media1/26902/9/538049253M-1755114442118.jpg',
    'https://imagecdn.99acres.com/media1/26902/9/538049261M-1755114427481.jpg',
    'https://imagecdn.99acres.com/media1/26902/9/538049265M-1755114624687.jpg',   
    'https://imagecdn.99acres.com/media1/26902/9/538049267M-1755114914741.jpg' 
    ],
  agent: {
    name: 'Priya Patel',
    phone: '+91 98765 43211',
    email: 'priya.patel@realestate.com',
    image: 'https://images.timesnownews.com/thumb/msid-119158435,thumbsize-24784,width-1280,height-720,resizemode-75/119158435.jpg',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 187,
    rating: 4.8,
    reviews: 128,
  }
},
{
  id: 6,
  title: '2BHK Flat in Electronic City',
  price: '₹18,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Electronic City, Bangalore, Karnataka',
  landmarks: [
    { name: 'Infosys Campus, Electronic City', distance: '1.8 km' },
    { name: 'Electronic City Metro Station', distance: '2.2 km' },
    { name: 'NeoMall', distance: '3.1 km' },
    { name: 'Hosur Road', distance: '1.4 km' }
  ],
  address: 'Flat No. 702, SJR Blue Waters Apartments, Phase 1, Electronic City, Bangalore, Karnataka 560100',
  type: 'Flat',
  area: '850 sqft',
  carpetArea: '700 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 4,
  floorNo: 2,
  description: 'This well-designed 2BHK flat is located in the prime residential area of Electronic City, Bangalore, making it an ideal option for working professionals and families. Spread across an 850 sq.ft built-up area with 700 sq.ft carpet space, the flat offers a comfortable living and dining area, a functional kitchen, and two spacious bedrooms with good ventilation. Situated on the 2nd floor of a 4-storey building, the west-facing apartment enjoys ample natural light and airflow. The property is ready to move and comes with essential and lifestyle amenities such as lift, power backup, parking, gym, and swimming pool. With excellent connectivity to IT parks, offices, schools, and daily convenience stores, this flat provides a convenient and comfortable rental living experience in Bangalore.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://dyimg2.realestateindia.com/prop_images/1392069/775829_1.jpg',
    'https://dyimg2.realestateindia.com/prop_images/1392069/775829_2.jpg',
    'https://dyimg2.realestateindia.com/prop_images/1392069/775829_3.jpg',   
    'https://dyimg2.realestateindia.com/prop_images/1392069/775829_4.jpg',
    'https://dyimg2.realestateindia.com/prop_images/1392069/775829_7.jpg',
    'https://dyimg2.realestateindia.com/prop_images/1392069/775829_6.jpg' 
    ],
  agent: {
    name: 'Priya Patel',
    phone: '+91 98765 43211',
    email: 'priya.patel@realestate.com',
    image: 'https://images.timesnownews.com/thumb/msid-119158435,thumbsize-24784,width-1280,height-720,resizemode-75/119158435.jpg',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 187,
    rating: 4.8,
    reviews: 128,
  }
},
{
  id: 7,
  title: 'Luxury Penthouse with City View',
  price: '₹5.2 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Bandra West, Mumbai, Maharashtra',
  landmarks: [
    { name: 'Bandra Bandstand', distance: '1.9 km' },
    { name: 'Mount Mary Church', distance: '1.4 km' },
    { name: 'Linking Road', distance: '2.2 km' },
    { name: 'Bandra Railway Station', distance: '2.6 km' }
  ],
  address: 'Penthouse No. PH-1, Sea Breeze Towers, Pali Hill Road, Bandra West, Mumbai, Maharashtra 400050',
  type: 'Penthouse',
  area: '3200 sqft',
  carpetArea: '3000 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 0,
  floorNo: 0,
 description: "This exclusive luxury penthouse is located in the upscale locality of Bandra West, Mumbai, offering breathtaking panoramic views of the city skyline. Spread across a spacious 3200 sq.ft built-up area with 3000 sq.ft carpet space, the penthouse is thoughtfully designed to deliver a premium living experience. It features a grand living and dining area with large windows, a modern modular kitchen with high-end fittings, and expansive bedrooms with attached bathrooms. The north-facing layout ensures ample natural light and ventilation throughout the day. This ready-to-move penthouse comes equipped with world-class amenities including lift, power backup, swimming pool, gym, parking, and 24x7 water supply. Located close to premium restaurants, cafes, shopping hubs, and entertainment zones, this penthouse is ideal for those seeking luxury, privacy, and an elite lifestyle in the heart of Mumbai.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://www.guptasen.com/wp-content/uploads/2021/02/5-BHK-Ekta-Empress-Khar-penthouse.jpg',
    'https://www.guptasen.com/wp-content/uploads/2021/02/furnished-penthouse-sale-bandra-Khar.jpg',
    'https://www.guptasen.com/wp-content/uploads/2021/02/duplex-penthouse-furnished-bandra-west.jpg',
    'https://www.guptasen.com/wp-content/uploads/2021/02/penthouse-duplex-homes-bandra-Mumbai.jpg'
  ],
  agent: {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@estatepro.com',
    image: 'https://www.constructionweekonline.in/cloud/2022/12/15/AmFI3uBe-Siddhart-Goel-1-1200x1201.jpg',
    company: 'EstatePro Realtors',
    experience: '12+ years',
    propertiesListed: 245,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 8,
  title: '1BHK Studio Apartment',
  price: '₹15,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Koramangala, Bangalore, Karnataka',
  landmarks: [
    { name: 'Forum Mall', distance: '1.2 km' },
    { name: 'Jyoti Nivas College', distance: '0.8 km' },
    { name: 'Sony World Signal', distance: '1.6 km' },
    { name: 'Christ University', distance: '2.9 km' }
  ],
  address: 'Flat No. 205, Sunrise Residency, 5th Block, Koramangala, Bangalore, Karnataka 560034',
  type: 'Studio',
  area: '500 sqft',
  carpetArea: '400 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 4,
  floorNo: 2,
  description: "This modern 1BHK studio apartment is located in the vibrant and well-connected locality of Koramangala, Bangalore, making it an excellent choice for students, working professionals, and bachelors. Spread across a 500 sq.ft built-up area with 400 sq.ft carpet space, the studio offers a smartly designed living and sleeping area, a functional kitchenette, and a well-ventilated bathroom. Situated on the 2nd floor of a 4-storey building, the south-facing apartment receives good natural light throughout the day. The property is ready to move and comes with essential and lifestyle amenities such as lift, power backup, parking, gym, swimming pool, and WiFi. With close proximity to IT hubs, cafes, restaurants, shopping streets, and public transport, this studio apartment provides a comfortable and convenient urban living experience in Koramangala.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://newprojects.99acres.com/projects/sriven_properties/sriven_daksha_elite/images/uzuvzhv_1763028449_672272241_med.jpg',
    'https://newprojects.99acres.com/projects/sriven_properties/sriven_daksha_elite/images/vainlq5_1763028603_672274119_med.jpg',
    'https://newprojects.99acres.com/projects/sriven_properties/sriven_daksha_elite/images/wofajmv_1763028606_672274163_med.jpg'
    ],
  agent: {
    name: 'Priya Patel',
    phone: '+91 98765 43211',
    email: 'priya.patel@realestate.com',
    image: 'https://images.timesnownews.com/thumb/msid-119158435,thumbsize-24784,width-1280,height-720,resizemode-75/119158435.jpg',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 187,
    rating: 4.8,
    reviews: 128,
  }
},
{
  id: 9,
  title: '1BHK Apartment',
  price: '₹16,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Karve Nagar, Pune, Maharashtra',
  landmarks: [
    { name: 'Karve Nagar Bus Stop', distance: '0.6 km' },
    { name: 'Karve Road', distance: '1.4 km' },
    { name: 'MIT College of Engineering', distance: '2.3 km' },
    { name: 'Cummins College Road', distance: '2.0 km' }
  ],
  address: 'Flat No. 302, Shree Ganesh Residency, Karve Nagar Main Road, Karve Nagar, Pune, Maharashtra 411052',
  type: 'Apartment',
  area: '550 sqft',
  carpetArea: '450 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 5,
  floorNo: 2,
  description: "This well-planned 1BHK apartment is located in the peaceful and well-connected locality of Karve Nagar, Pune, making it an ideal choice for working professionals, students, and small families. Spread across a 550 sq.ft built-up area with 450 sq.ft carpet space, the apartment offers a comfortable living room, a functional kitchen, and a spacious bedroom with good ventilation. Situated on the 2nd floor of a 5-storey building, the north-facing apartment enjoys ample natural light and a pleasant living environment. The property is ready to move and is conveniently located close to educational institutes, IT parks, daily convenience stores, and public transport, offering a comfortable and hassle-free rental living experience in Pune.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://cf.bstatic.com/xdata/images/hotel/max300/785650897.jpg?k=85cec98266e72db4fae55e8cd41f0013d55c6b8b6ea66b1471540b93b123e5f7&o=',
    'https://cf.bstatic.com/xdata/images/hotel/max300/785650905.jpg?k=aabfe9c32b3297b54887e20022d833e6266f0e0aaf9d489775bb9646bd69e1c9&o=',
    'https://cf.bstatic.com/xdata/images/hotel/max300/785650891.jpg?k=b3a176ada6bcdf4097ae44a6ac7107c91dd759dee708ecf4d06ee4c4b855a337&o='
  ],
  agent: {
    name: 'Vikram Bhosale',
    phone: '+91 88556 77012',
    email: 'vikram.bhosale@commercialhub.in',
    image: 'https://tse3.mm.bing.net/th/id/OIP.FGXPANbJ2zYz5gcf87vkRgHaJ4?pid=Api&h=220&P=0',
    company: 'EstatePro Realtors',
    experience: '13+ years',
    propertiesListed: 310,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 10,
  title: '2BHK Apartment',
  price: '₹25,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Karve Nagar, Pune, Maharashtra',
  landmarks: [
    { name: 'Karve Nagar Garden', distance: '0.5 km' },
    { name: 'Karve Nagar Bus Stop', distance: '0.8 km' },
    { name: 'MIT College Road', distance: '2.1 km' },
    { name: 'Warje Malwadi', distance: '3.0 km' }
  ],
  address: 'Flat No. 504, Shubham Heights, Near Karve Nagar Garden, Karve Nagar, Pune, Maharashtra 411052',
  type: 'Apartment',
  area: '1050 sqft',
  carpetArea: '900 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 12,
  floorNo: 8,
  description: "This spacious and well-designed 2BHK apartment is located in the peaceful and well-connected locality of Karve Nagar, Pune, making it an excellent choice for families and working professionals. Spread across a generous 1050 sq.ft built-up area with 900 sq.ft carpet space, the apartment features a bright living and dining area, a functional kitchen, and two comfortable bedrooms with good ventilation. Situated on the 8th floor of a 12-storey building, the south-facing apartment receives ample natural light and offers pleasant open views. The property is ready to move and is conveniently located close to educational institutes, IT parks, daily convenience stores, and public transport, ensuring a comfortable and hassle-free rental living experience in Pune.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://dyimg2.realestateindia.com/prop_images/3187878/1403647_5.jpg',
    'https://dyimg2.realestateindia.com/prop_images/3187878/1403647_4.jpg',
    'https://dyimg2.realestateindia.com/prop_images/3187878/1403647_6.jpg',
    'https://dyimg2.realestateindia.com/prop_images/3187878/1403647_7.jpg'
  ],
  agent: {
    name: 'Neha Soni',
    phone: '+91 98670 44821',
    email: 'neha.soni@rentpremium.in',
    image: 'https://img.freepik.com/premium-photo/young-professional-indian-woman-smiling-giving-thumbs-up-gesture-showing-confidence-positivity-busy-environment_822916-4056.jpg',
    company: 'EstatePro Realtors',
    experience: '6+ years',
    propertiesListed: 140,
    rating: 4.5,
    reviews: 128,
  }
},
{
  id: 11,
  title: 'Modern 2BHK Flat in Mumbai',
  price: '₹1.2 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Lokhandwala, Mumbai, Maharashtra',
  landmarks: [
    { name: 'Lokhandwala Market', distance: '0.6 km' },
    { name: 'Infinity Mall, Andheri', distance: '1.8 km' },
    { name: 'Versova Metro Station', distance: '2.1 km' },
    { name: 'Juhu Beach', distance: '3.4 km' }
  ],
  address: 'Flat No. 903, Emerald Heights, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053',
  type: 'Apartment',
  area: '1050 sqft',
  carpetArea: '900 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 27,
  floorNo: 15,
  description: "This modern and well-designed 2BHK apartment is located in the premium residential locality of Lokhandwala, Mumbai, offering a perfect blend of comfort, convenience, and urban lifestyle. Spread across a 1050 sq.ft built-up area with 900 sq.ft carpet space, the apartment features a spacious living and dining area, a stylish modular kitchen, and two well-planned bedrooms with attached modern bathrooms. Situated on the 15th floor of a 27-storey high-rise, the east-facing apartment enjoys abundant natural light, ventilation, and pleasant city views. The property is ready to move and comes with a host of modern amenities, making it an ideal choice for families and professionals seeking quality living in one of Mumbai’s most sought-after neighborhoods.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/10-2.jpg',
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/19-1.jpg',
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/5-2.jpg',
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/16-1.jpg',
    'https://www.uniqueshanti.com/wp-content/uploads/2018/11/3-2.jpg'
  ],
  agent: {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@estatepro.com',
    image: 'https://www.constructionweekonline.in/cloud/2022/12/15/AmFI3uBe-Siddhart-Goel-1-1200x1201.jpg',
    company: 'EstatePro Realtors',
    experience: '12+ years',
    propertiesListed: 245,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 12,
  title: 'Premium 4BHK Villa',
  price: '₹2.5 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Lonavala, Pune, Maharashtra',
  landmarks: [
    { name: 'Lion’s Point', distance: '3.6 km' },
    { name: 'Lonavala Lake', distance: '2.4 km' },
    { name: 'Bhushi Dam', distance: '5.1 km' },
    { name: 'Lonavala Railway Station', distance: '2.9 km' }
  ],
  address: 'Villa No. 12, Green Valley Villas, Old Pune–Mumbai Highway, Lonavala, Maharashtra 410401',
  type: 'Villa',
  area: '2200 sqft',
  carpetArea: '2000 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 0,
  floorNo: 0,
  description: "This premium 4BHK villa is located in the serene and scenic surroundings of Lonavala, Pune, offering a perfect blend of luxury, privacy, and nature. Spread across a spacious 2200 sq.ft built-up area with 2000 sq.ft carpet space, the villa features a grand living and dining area, a modern kitchen, and four well-appointed bedrooms designed for maximum comfort. The west-facing villa enjoys beautiful sunset views and excellent natural ventilation throughout the day. This ready-to-move property is ideal for families seeking a peaceful retreat, a holiday home, or a premium investment option. Located close to popular tourist spots, greenery, and essential conveniences, this villa provides a relaxed yet luxurious lifestyle away from city noise.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://www.guptasen.com/wp-content/uploads/2023/06/lobby-oberoi-sky-heights-lokhandwala-andheri-west.webp',
    'https://www.guptasen.com/wp-content/uploads/2023/06/large-living-room-of-4-BHK-apartment-Oberoi-sky-heights.webp',
    'https://www.guptasen.com/wp-content/uploads/2023/06/bedroom-of-4-BHK-Oberoi-Sky-heights-lokhandwala-back-road-mumbai.webp'
  ],
  agent: {
    name: 'Neha Soni',
    phone: '+91 98670 44821',
    email: 'neha.soni@rentpremium.in',
    image: 'https://img.freepik.com/premium-photo/young-professional-indian-woman-smiling-giving-thumbs-up-gesture-showing-confidence-positivity-busy-environment_822916-4056.jpg',
    company: 'EstatePro Realtors',
    experience: '6+ years',
    propertiesListed: 140,
    rating: 4.5,
    reviews: 128,
  }
},
{
  id: 13,
  title: '3BHK Apartment',
  price: '₹32,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Karve Nagar, Pune, Maharashtra',
  landmarks: [
    { name: 'Karve Nagar Chowk', distance: '0.7 km' },
    { name: 'Karve Nagar Garden', distance: '0.9 km' },
    { name: 'MIT College Road', distance: '2.0 km' },
    { name: 'Warje Malwadi Bus Depot', distance: '3.2 km' }
  ],
  address: 'Flat No. 701, Sai Shraddha Residency, Near Karve Nagar Chowk, Karve Nagar, Pune, Maharashtra 411052',
  type: 'Apartment',
  area: '1200 sqft',
  carpetArea: '1000 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 12,
  floorNo: 9,
  description: "This spacious and well-planned 3BHK apartment is located in the peaceful and well-connected locality of Karve Nagar, Pune, making it an ideal choice for families and working professionals. Spread across a 1200 sq.ft built-up area with 1000 sq.ft carpet space, the apartment features a bright living and dining area, a functional kitchen, and three comfortable bedrooms with good ventilation. Situated on the 9th floor of a 12-storey building, the north-facing apartment enjoys ample natural light, fresh air, and pleasant open views. The property is ready to move and is conveniently located close to educational institutes, IT parks, daily convenience stores, and public transport, ensuring a comfortable and hassle-free rental living experience in Pune.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://img.squareyards.com/secondaryPortal/IN_638927548243524144-060925112704274.jpeg?aio=w-400;h-250;crop;',
    'https://img.squareyards.com/secondaryPortal/IN_638927548246167195-060925112704274.jpeg?aio=w-400;h-250;crop;',
    'https://img.squareyards.com/secondaryPortal/IN_638927548246536780-060925112704274.jpeg?aio=w-400;h-250;crop;',
    'https://img.squareyards.com/secondaryPortal/IN_638927548247901983-060925112704274.jpeg?aio=w-400;h-250;crop;',
    'https://img.squareyards.com/secondaryPortal/IN_638927548246897695-060925112704274.jpeg?aio=w-400;h-250;crop;'
  ],
  agent: {
    name: 'Vikram Bhosale',
    phone: '+91 88556 77012',
    email: 'vikram.bhosale@commercialhub.in',
    image: 'https://tse3.mm.bing.net/th/id/OIP.FGXPANbJ2zYz5gcf87vkRgHaJ4?pid=Api&h=220&P=0',
    company: 'EstatePro Realtors',
    experience: '13+ years',
    propertiesListed: 310,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 14,
  title: '4BHK Apartment',
  price: '₹36,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Baner, Pune, Maharashtra',
  landmarks: [
    { name: 'Baner Road', distance: '1.1 km' },
    { name: 'Balewadi High Street', distance: '2.6 km' },
    { name: 'Pashan Lake', distance: '3.4 km' },
    { name: 'Hinjewadi IT Park', distance: '6.8 km' }
  ],
  address: 'Flat No. 1002, Blue Ridge Residency, Baner–Pashan Link Road, Baner, Pune, Maharashtra 411045',
  type: 'Apartment',
  area: '2100 sqft',
  carpetArea: '1900 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 20,
  floorNo: 12,
  description: "This spacious and premium 4BHK apartment is located in the prime residential locality of Baner, Pune, making it an excellent choice for large families and senior professionals. Spread across an expansive 2100 sq.ft built-up area with 1900 sq.ft carpet space, the apartment features a grand living and dining area, a well-designed kitchen, and four generously sized bedrooms with excellent ventilation. Situated on the 12th floor of a 20-storey building, the south-facing apartment receives abundant natural light and offers pleasant open city views. The property is ready to move and enjoys close proximity to IT parks, business hubs, schools, hospitals, shopping malls, and major highways, ensuring a comfortable and convenient rental lifestyle in one of Pune’s most sought-after areas.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-11.webp',
    'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-01.webp',
    'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-07.webp',
    'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-02.webp',
    'https://malvigajjar.com/wp-content/uploads/2024/05/4-BHK-Luxury-Apartment-03.webp'
  ],
  agent: {
    name: 'Vikram Bhosale',
    phone: '+91 88556 77012',
    email: 'vikram.bhosale@commercialhub.in',
    image: 'https://tse3.mm.bing.net/th/id/OIP.FGXPANbJ2zYz5gcf87vkRgHaJ4?pid=Api&h=220&P=0',
    company: 'EstatePro Realtors',
    experience: '13+ years',
    propertiesListed: 310,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 15,
  title: '1BHK Apartment',
  price: '₹50 L',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Wakad, Pune, Maharashtra',
  landmarks: [
    { name: 'Wakad Bus Stop', distance: '0.5 km' },
    { name: 'Amanora Mall', distance: '3.2 km' },
    { name: 'Hinjewadi IT Park', distance: '6.5 km' },
    { name: 'Rajiv Gandhi Infotech Park', distance: '6.8 km' }
  ],
  address: 'Flat No. 204, Sunshine Residency, Near Wakad Chowk, Wakad, Pune, Maharashtra 411057',
  type: 'Apartment',
  area: '800 sqft',
  carpetArea: '650 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 10,
  floorNo: 6,
  description: "This well-designed 1BHK apartment is located in the fast-developing and well-connected locality of Wakad, Pune, making it an ideal choice for first-time home buyers and investors. Spread across a built-up area of 800 sq.ft with 650 sq.ft carpet space, the apartment offers a comfortable living room, a functional kitchen, and a spacious bedroom with good ventilation. Situated on the 6th floor of a 10-storey building, the east-facing apartment receives ample morning sunlight and fresh air. The property is ready to move and is conveniently located close to IT parks, shopping centers, schools, hospitals, and major road connectivity, providing a comfortable and convenient urban living experience.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://dynamic.realestateindia.com/prop_images/3760972/1354563_2.jpeg',
    'https://dynamic.realestateindia.com/prop_images/3760972/1354563_5.jpeg',
    'https://dynamic.realestateindia.com/prop_images/3760972/1354563_8.jpeg',
    'https://dynamic.realestateindia.com/prop_images/3760972/1354563_7.jpeg'
  ],
  agent: {
    name: 'Vikram Bhosale',
    phone: '+91 88556 77012',
    email: 'vikram.bhosale@commercialhub.in',
    image: 'https://tse3.mm.bing.net/th/id/OIP.FGXPANbJ2zYz5gcf87vkRgHaJ4?pid=Api&h=220&P=0',
    company: 'EstatePro Realtors',
    experience: '13+ years',
    propertiesListed: 310,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 16,
  title: 'Premium 3BHK Villa',
  price: '₹2.2 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Koregaon Park, Pune, Maharashtra',
  landmarks: [
    { name: 'Osho Ashram', distance: '0.5 km' },
    { name: 'Koregaon Park Plaza', distance: '1.2 km' },
    { name: 'Magarpatta City', distance: '5.8 km' },
    { name: 'Pune Airport', distance: '12 km' }
  ],
  address: 'Villa No. 7, Emerald Residency, North Main Road, Koregaon Park, Pune, Maharashtra 411001',
  type: 'Villa',
  area: '1600 sqft',
  carpetArea: '1450 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 0,
  floorNo: 0,
  description: "This premium 3BHK villa is located in the upscale and prestigious locality of Koregaon Park, Pune, offering an exclusive blend of luxury, privacy, and urban convenience. Spread across a spacious 1600 sq.ft built-up area with 1450 sq.ft carpet space, the villa features an elegant living and dining area, a modern kitchen, and three well-designed bedrooms with excellent ventilation. The west-facing villa enjoys abundant natural light and pleasant evening views, creating a warm and comfortable living atmosphere. This ready-to-move property is ideal for families and high-end buyers seeking a premium lifestyle in one of Pune’s most sought-after residential neighborhoods. With close proximity to top restaurants, cafes, schools, hospitals, and business hubs, this villa ensures a refined and convenient living experience.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://www.guptasen.com/wp-content/uploads/2023/02/supreme-villagio-corner-villa-3-BHK.webp',
    'https://www.guptasen.com/wp-content/uploads/2023/02/4-BHK-supreme-villagio-Pune.webp',
    'https://www.guptasen.com/wp-content/uploads/2023/02/best-budget-villas-for-sale-pune.webp',
    'https://www.guptasen.com/wp-content/uploads/2023/02/best-villa-projects-near-pune.webp',
    'https://www.guptasen.com/wp-content/uploads/2023/02/supreme-villagio-somatane-pune.webp',
    'https://www.guptasen.com/wp-content/uploads/2023/02/best-villa-projects-somatane-pune.webp'
  ],
  agent: {
    name: 'Neha Soni',
    phone: '+91 98670 44821',
    email: 'neha.soni@rentpremium.in',
    image: 'https://img.freepik.com/premium-photo/young-professional-indian-woman-smiling-giving-thumbs-up-gesture-showing-confidence-positivity-busy-environment_822916-4056.jpg',
    company: 'EstatePro Realtors',
    experience: '6+ years',
    propertiesListed: 140,
    rating: 4.5,
    reviews: 128,
  }
},
{
  id: 17,
  title: '3BHK Luxury Apartment',
  price: '₹32,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Kharadi, Pune, Maharashtra',
  landmarks: [
    { name: 'EON IT Park', distance: '1.5 km' },
    { name: 'World Trade Center Pune', distance: '2.3 km' },
    { name: 'Phoenix Marketcity, Viman Nagar', distance: '4.7 km' },
    { name: 'Pune International Airport', distance: '7.4 km' }
  ],
  address: 'Flat No. 1205, Galaxy Residency, EON IT Park Road, Kharadi, Pune, Maharashtra 411014',
  type: 'Apartment',
  area: '1500 sqft',
  carpetArea: '1300 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 12,
  floorNo: 10,
  description: "This spacious 3BHK luxury apartment is located in the prime locality of Kharadi, Pune. Spread across 1500 sq.ft with 1300 sq.ft carpet area, it offers a well-planned living space with modern interiors and excellent ventilation. The north-facing, ready-to-move apartment is ideal for families and professionals, with close proximity to IT parks, schools, shopping centers, and daily conveniences.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://dynamic.realestateindia.com/prop_images/3269472/1220018_1.jpg',
    'https://dynamic.realestateindia.com/prop_images/3269472/1220018_2.jpg',
    'https://dynamic.realestateindia.com/prop_images/3269472/1220018_7.jpg',
    'https://dynamic.realestateindia.com/prop_images/3269472/1220018_4.jpg'
  ],
  agent: {
    name: 'Neha Soni',
    phone: '+91 98670 44821',
    email: 'neha.soni@rentpremium.in',
    image: 'https://img.freepik.com/premium-photo/young-professional-indian-woman-smiling-giving-thumbs-up-gesture-showing-confidence-positivity-busy-environment_822916-4056.jpg',
    company: 'EstatePro Realtors',
    experience: '6+ years',
    propertiesListed: 140,
    rating: 4.5,
    reviews: 128,
  }
},
{
  id: 18,
  title: '2BHK Premium Flat',
  price: '₹85 L',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Andheri West, Mumbai, Maharashtra',
  landmarks: [
    { name: 'Andheri West Metro Station', distance: '1.2 km' },
    { name: 'Infinity Mall, Andheri', distance: '2.0 km' },
    { name: 'Lokhandwala Market', distance: '1.8 km' },
    { name: 'Juhu Beach', distance: '3.5 km' }
  ],
  address: 'Flat No. 1204, Silver Oaks Residency, Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053',
  type: 'Apartment',
  area: '950 sqft',
  carpetArea: '800 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 30,
  floorNo: 17,
  description: "This premium 2BHK apartment is located in the heart of Andheri West, Mumbai. Spread across 950 sq.ft with 800 sq.ft carpet area, the south-facing flat offers a well-designed living space, modern interiors, and excellent city views from the 17th floor. Ready to move, it is ideal for families and professionals seeking a comfortable lifestyle with excellent connectivity and amenities.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://dyimg2.realestateindia.com/prop_images/2911909/1141895_1.jpg',
    'https://dyimg2.realestateindia.com/prop_images/2911909/1141895_2.jpg',
    'https://dyimg2.realestateindia.com/prop_images/2911909/1141895_3.jpg',
    'https://dyimg2.realestateindia.com/prop_images/2911909/1141895_5.jpg'
  ],
  agent: {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@estatepro.com',
    image: 'https://www.constructionweekonline.in/cloud/2022/12/15/AmFI3uBe-Siddhart-Goel-1-1200x1201.jpg',
    company: 'EstatePro Realtors',
    experience: '12+ years',
    propertiesListed: 245,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 19,
  title: '4BHK Ultra Luxury Villa',
  price: '₹3.2 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Jubilee Hills, Hyderabad, Telangana',
  landmarks: [
    { name: 'Jubilee Hills Check Post', distance: '0.9 km' },
    { name: 'Shilparamam Cultural Village', distance: '2.5 km' },
    { name: 'Inorbit Mall, Jubilee Hills', distance: '1.8 km' },
    { name: 'Raj Bhavan, Hyderabad', distance: '3.2 km' }
  ],
  address: 'Villa No. 5, Palm Grove Residency, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
  type: 'Villa',
  area: '3000 sqft',
  carpetArea: '2800 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 0,
  floorNo: 0,
  description: "This ultra-luxury 4BHK villa is located in the prestigious locality of Jubilee Hills, Hyderabad. Spread across 3000 sq.ft with premium interiors, the east-facing villa offers spacious living areas, privacy, and abundant natural light. Ready to move, it is ideal for high-end buyers seeking an exclusive and upscale lifestyle.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://www.thepinnaclelist.com/wp-content/uploads/2020/06/06-Lines-of-Light-Luxury-Residence-Faber-Terrace-Singapore-900x546.jpg',
    'https://www.thepinnaclelist.com/wp-content/uploads/2020/06/12-Lines-of-Light-Luxury-Residence-Faber-Terrace-Singapore-1024x769.jpg',
    'https://www.thepinnaclelist.com/wp-content/uploads/2020/06/25-Lines-of-Light-Luxury-Residence-Faber-Terrace-Singapore-636x847.jpg',
    'https://www.thepinnaclelist.com/wp-content/uploads/2020/06/14-Lines-of-Light-Luxury-Residence-Faber-Terrace-Singapore-688x517.jpg'
  ],
  agent: {
    name: 'Karan Desai',
    phone: '+91 95123 22110',
    email: 'karan.desai@cityrentals.in',
    image: 'https://static.toiimg.com/imagenext/toiblogs/photo/blogs/wp-content/uploads/2017/11/blog-picture.jpg',
    company: 'EstatePro Realtors',
    experience: '6+ years',
    propertiesListed: 150,
    rating: 4.6,
    reviews: 128,
  }
},
{
  id: 20,
  title: '1BHK Studio Apartment',
  price: '₹25,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Koramangala, Bengaluru, Karnataka',
  landmarks: [
    { name: 'Forum Mall Koramangala', distance: '1.2 km' },
    { name: 'Jyoti Nivas College', distance: '0.9 km' },
    { name: 'St. John’s Hospital', distance: '1.5 km' },
    { name: 'Koramangala 80 Feet Road', distance: '1.0 km' }
  ],
  address: 'Flat No. 306, Maple Residency, 7th Block, Koramangala, Bengaluru, Karnataka 560095',
  type: 'Apartment',
  area: '600 sqft',
  carpetArea: '500 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 15,
  floorNo: 7,
  description: "This modern 1BHK studio apartment is located in the prime locality of Koramangala, Bengaluru. Spread across 600 sq.ft with 500 sq.ft carpet area, the west-facing apartment offers a compact yet comfortable living space on the 7th floor. Ready to move, it is ideal for working professionals seeking convenience and connectivity.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIwNDEwNjk0MjExMjEzMjg3OA%3D%3D/original/ff67bdfa-5bae-4590-8cc7-f86d61c176a0.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIwNDEwNjk0MjExMjEzMjg3OA%3D%3D/original/25280c8d-9d64-464c-aead-fb0692e9e416.jpeg?im_w=1440',
    'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIwNDEwNjk0MjExMjEzMjg3OA%3D%3D/original/dae8151b-811f-4960-bc53-33a9b4cf66a9.jpeg?im_w=1440',
    'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIwNDEwNjk0MjExMjEzMjg3OA%3D%3D/original/9f151c3b-79d3-4b03-99d4-338d3e926b1c.jpeg?im_w=1440'
  ],
  agent: {
    name: 'Aishwarya Menon',
    phone: '+91 90903 33321',
    email: 'aishwarya.menon@elitevilla.in',
    image: 'https://imgv3.fotor.com/images/slider-image/a-woman-in-a-suit.png',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 195,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 21,
  title: '3BHK Family Home',
  price: '₹1.1 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Dwarka Sector 11, Delhi',
  landmarks: [
    { name: 'Dwarka Sector 11 Metro Station', distance: '0.8 km' },
    { name: 'Dwarka District Park', distance: '1.5 km' },
    { name: 'Maharaja Surajmal Institute', distance: '2.3 km' },
    { name: 'IGI Airport', distance: '11 km' }
  ],
  address: 'Flat No. 403, Green Residency, Sector 11, Dwarka, Delhi, Delhi 110075',
  type: 'Apartment',
  area: '1450 sqft',
  carpetArea: '1300 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 5,
  floorNo: 2,
  description: "This spacious 3BHK family apartment is located in the prime locality of Dwarka Sector 11, Delhi Spread across 1450 sq.ft with 1300 sq.ft carpet area the north-facing home on the 2nd floor offers comfortable and well-planned living Ready to move it is ideal for families seeking space convenience and a peaceful residential environment.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://im.proptiger.com/1/3109067/6/dwarka-mor-affordable-homes-elevation-117971152.jpeg?width=1336&height=768',
    'https://im.proptiger.com/1/3109067/81/dwarka-mor-affordable-homes-kitchen-117971632.jpeg?width=1336&height=768',
    'https://im.proptiger.com/1/3109067/81/dwarka-mor-affordable-homes-kitchen-117971631.jpeg?width=1336&height=768'
  ],
  agent: {
    name: 'Amit Singh',
    phone: '+91 98765 43212',
    email: 'amit.singh@realestate.com',
    image: 'http://www.track2realty.track2media.com/wp-content/uploads/2012/12/Brotin-Banerjee_MD-CEO-at-Tata-Housing.jpg',
    company: 'EstatePro Realtors',
    experience: '15+ years',
    propertiesListed: 312,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 22,
  title: '2BHK Semi-Furnished Flat',
  price: '₹22,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Wakad, Pune, Maharashtra',
  landmarks: [
    { name: 'Wakad Bus Stop', distance: '0.5 km' },
    { name: 'Amanora Mall', distance: '3.1 km' },
    { name: 'Hinjewadi IT Park', distance: '6.7 km' },
    { name: 'Rajiv Gandhi Infotech Park', distance: '6.9 km' }
  ],
  address: 'Flat No. 405, Shree Sai Residency, Near Wakad Chowk, Wakad, Pune, Maharashtra 411057',
  type: 'Apartment',
  area: '900 sqft',
  carpetArea: '750 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 30,
  floorNo: 16,
  description: "This 2BHK semi-furnished apartment is located in the prime locality of Wakad, Pune Spread across 900 sq.ft with 750 sq.ft carpet area, the south-facing home on the 16th floor offers comfortable living with good ventilation Ready to move it is ideal for families or professionals seeking convenience and excellent connectivity.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_153651.jpg',
    'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_145441.jpg',
    'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_151624.jpg',
    'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_145853.jpg',
    'https://s3-ap-southeast-1.amazonaws.com/apnacomplexdocs/user_content/xerbia-hinjewadi-phase-2/classifieds/b9f667b77f4de21d58da83b45665ff44___IMG_20190712_145749.jpg'
  ],
  agent: {
    name: 'Neha Soni',
    phone: '+91 98670 44821',
    email: 'neha.soni@rentpremium.in',
    image: 'https://img.freepik.com/premium-photo/young-professional-indian-woman-smiling-giving-thumbs-up-gesture-showing-confidence-positivity-busy-environment_822916-4056.jpg',
    company: 'EstatePro Realtors',
    experience: '6+ years',
    propertiesListed: 140,
    rating: 4.5,
    reviews: 128,
  }
},
{
  id: 23,
  title: '4BHK Penthouse',
  price: '₹4.5 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Powai, Mumbai, Maharashtra',
  landmarks: [
    { name: 'Powai Lake', distance: '0.5 km' },
    { name: 'Hiranandani Business Park', distance: '1.2 km' },
    { name: 'Inorbit Mall, Powai', distance: '1.8 km' },
    { name: 'International Institute of Hotel Management', distance: '2.5 km' }
  ],
  address: 'Penthouse No. PH-5, Lakeview Towers, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
  type: 'Penthouse',
  area: '3200 sqft',
  carpetArea: '3000 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 15,
  floorNo: 12,
  description: 'This luxurious 4BHK penthouse is located in the prime locality of Powai, Mumbai. Spread across 3200 sq.ft with 3000 sq.ft carpet area, the east-facing home on the 12th floor offers expansive living spaces and stunning city views. Ready to move, it is ideal for those seeking premium comfort, privacy, and a high-end lifestyle.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://code-estate.com/wp-content/uploads/2025/03/penthouse-with-open-terrace-khar-west.jpg',
    'https://code-estate.com/wp-content/uploads/2025/03/spacious-4bhk-penthouse-pali-hill.jpg',
    'https://code-estate.com/wp-content/uploads/2025/03/cross-ventilated-penthouse-with-natural-light.jpg',
    'https://code-estate.com/wp-content/uploads/2025/03/sea-view-penthouse-mumbai-dr-ambedkar-road.jpg',
    'https://code-estate.com/wp-content/uploads/2025/03/premium-2300sqft-penthouse-sale-mumbai.jpg'
  ],
  agent: {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@estatepro.com',
    image: 'https://www.constructionweekonline.in/cloud/2022/12/15/AmFI3uBe-Siddhart-Goel-1-1200x1201.jpg',
    company: 'EstatePro Realtors',
    experience: '12+ years',
    propertiesListed: 245,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 24,
  title: '2BHK Fully Furnished Apartment',
  price: '₹38,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Hitech City, Hyderabad, Telangana',
  landmarks: [
    { name: 'Hitech City Metro Station', distance: '1.1 km' },
    { name: 'Cyber Towers', distance: '1.5 km' },
    { name: 'Inorbit Mall, Hitech City', distance: '2.3 km' },
    { name: 'Gachibowli Stadium', distance: '4.0 km' }
  ],
  address: 'Flat No. 504, Skyline Residency, Near Laxmi Cyber City, Hitech City, Hyderabad, Telangana 500081',
  type: 'Apartment',
  area: '1100 sqft',
  carpetArea: '950 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 3,
  floorNo: 2,
  description: 'This 2BHK fully furnished apartment is located in the prime locality of Hitech City, Hyderabad. Spread across 1100 sq.ft with 950 sq.ft carpet area, the west-facing home on the 2nd floor offers comfortable and modern living. Ready to move, it is ideal for professionals or small families seeking convenience and excellent connectivity.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/8a/2c/4a/skyla-serviced-apartments.jpg?w=1600&h=-1&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/8a/2c/47/siting-lounge.jpg?w=2000&h=-1&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/99/0e/50/skyla-gachibowli.jpg?w=2000&h=-1&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/8a/2c/48/outside-view.jpg?w=1600&h=-1&s=1'
  ],
  agent: {
    name: 'Ananya Reddy',
    phone: '+91 98765 43213',
    email: 'ananya.reddy@realestate.com',
    image: 'https://repleteinc.com/wp-content/uploads/2021/10/replete-employee.jpg',
    company: 'EstatePro Realtors',
    experience: '7+ years',
    propertiesListed: 156,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 25,
  title: '1BHK Budget Flat',
  price: '₹45 L',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Mira Road, Mumbai, Maharashtra',
  landmarks: [
    { name: 'Mira Road Railway Station', distance: '1.0 km' },
    { name: 'Orchid School', distance: '1.5 km' },
    { name: 'Infiniti Mall, Malad', distance: '6.8 km' },
    { name: 'Gorai Beach', distance: '8.5 km' }
  ],
  address: 'Flat No. 203, Shree Sai Residency, Mira Road West, Mumbai, Maharashtra 401107',
  type: 'Apartment',
  area: '650 sqft',
  carpetArea: '500 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 10,
  floorNo: 3,
  description: 'This 1BHK budget-friendly apartment is located in Mira Road, Mumbai. Spread across 650 sq.ft with 500 sq.ft carpet area, the north-facing home on the 3rd floor offers practical and comfortable living. Ready to move, it is ideal for first-time buyers or small families seeking affordability and convenience.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0000.jpg',
    'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0006.jpg',
    'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0001.jpg',
    'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0002.jpg',
    'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/11/IMG-20141115-WA0004.jpg'
  ],
  agent: {
    name: 'Aditya Khanna',
    phone: '+91 90823 55147',
    email: 'aditya.khanna@luxuryestate.in',
    image: 'https://media.istockphoto.com/id/1363118407/photo/portrait-of-young-businessman.jpg?s=612x612&w=0&k=20&c=e9xjo1AdlIbr7ttZe3iBG3CBWKUBwdTMLkPus9DxA_s=',
    company: 'EstatePro Realtors',
    experience: '9+ years',
    propertiesListed: 160,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 26,
  title: '3BHK Corner Flat',
  price: '₹28,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'BTM Layout, Bengaluru, Karnataka',
  landmarks: [
    { name: 'BTM Layout Bus Stop', distance: '0.7 km' },
    { name: 'Forum Mall, Koramangala', distance: '2.5 km' },
    { name: 'St. John’s Hospital', distance: '1.8 km' },
    { name: 'Koramangala 80 Feet Road', distance: '2.2 km' }
  ],
  address: 'Flat No. 702, Greenfield Residency, 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076',
  type: 'Apartment',
  area: '1300 sqft',
  carpetArea: '1100 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 3,
  floorNo: 1,
  description: "This spacious 3BHK corner apartment is located in BTM Layout, Bengaluru. Spread across 1300 sq.ft with 1100 sq.ft carpet area, the south-facing home on the 1st floor offers excellent ventilation and privacy. Ready to move, it is ideal for families seeking comfort and a well-connected neighborhood.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
  ],
  images: [
    'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_2.jpg',
    'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_3.jpg',
    'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_4.jpg',
    'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_6.jpg',
    'https://dyimg2.realestateindia.com/prop_images/2830198/1114388_5.jpg'
  ],
  agent: {
    name: 'Aishwarya Menon',
    phone: '+91 90903 33321',
    email: 'aishwarya.menon@elitevilla.in',
    image: 'https://imgv3.fotor.com/images/slider-image/a-woman-in-a-suit.png',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 195,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 27,
  title: '4BHK Modern Villa',
  price: '₹2.9 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Whitefield, Bengaluru, Karnataka',
  landmarks: [
    { name: 'ITPL (International Tech Park)', distance: '2.5 km' },
    { name: 'Forum Neighbourhood Mall', distance: '3.8 km' },
    { name: 'Vydehi Hospital', distance: '4.0 km' },
    { name: 'Hope Farm Junction Metro Station', distance: '3.3 km' }
  ],
  address: 'Villa No. 22, Palm Grove Villas, Varthur Road, Whitefield, Bengaluru, Karnataka 560066',
  type: 'Villa',
  area: '2800 sqft',
  carpetArea: '1100 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 0,
  floorNo: 0,
  description: "This modern 4BHK villa is located in the prime area of Whitefield, Bengaluru. Spread across 2800 sq.ft, the east-facing home offers spacious interiors with privacy and comfort. Ready to move, it is ideal for families seeking a premium lifestyle in a well-developed locality.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://www.decorpot.com/images/blogimage1681441444understanding-the-space-for-4-bhk-home.jpg',
    'https://www.decorpot.com/images/blogimage2021248753bedroom-design-for-4-bhk-home.jpg',
    'https://www.decorpot.com/images/blogimage1589277315kitchen-for-4-bhk-home.jpg'
  ],
  agent: {
    name: 'Aishwarya Menon',
    phone: '+91 90903 33321',
    email: 'aishwarya.menon@elitevilla.in',
    image: 'https://imgv3.fotor.com/images/slider-image/a-woman-in-a-suit.png',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 195,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 28,
  title: '3BHK Spacious Home',
  price: '₹52,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Noida Sector 76, Delhi NCR',
  landmarks: [
    { name: 'Sector 76 Metro Station', distance: '1.1 km' },
    { name: 'The Great India Place Mall', distance: '5.8 km' },
    { name: 'Shiv Nadar School', distance: '2.3 km' },
    { name: 'Noida Golf Course', distance: '3.7 km' }
  ],
  address: 'Flat No. 1203, Royale Residency, Sector 76, Noida, Uttar Pradesh 201301',
  type: 'Apartment',
  area: '1550 sqft',
  carpetArea: '1350 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 20,
  floorNo: 9,
  description: "This spacious 3BHK apartment is located in Noida Sector 76, Delhi NCR. Spread across 1550 sq.ft with 1350 sq.ft carpet area, the west-facing home on the 9th floor offers comfortable and well-planned living. Ready to move, it is ideal for families seeking space, convenience, and good connectivity.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595726.jpg?k=3b42c98d7911b80934b0ca30826e6d0c1aee228dd94020d7cd996d61d0088a62&o=',
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595777.jpg?k=52b01bcf3b2154e86359dcc100c993a065eadc3c3908be47d4607a96f0677282&o=',
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595780.jpg?k=0550a31fb032e4132647ee2840711ef06ed31cfcbc825fd223ef240cb39e94b7&o=',
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595786.jpg?k=1de5ca25632c72318ae5507e5dc989ca32ad4b0b2b7bd232bb6ad41b416bdda2&o=',
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/668595766.jpg?k=fc513312d0608f865731611b5cbd6fa30fe7a14c0fcb5cfc54c11ed67eecbef3&o='
  ],
  agent: {
    name: 'Amit Singh',
    phone: '+91 98765 43212',
    email: 'amit.singh@realestate.com',
    image: 'http://www.track2realty.track2media.com/wp-content/uploads/2012/12/Brotin-Banerjee_MD-CEO-at-Tata-Housing.jpg',
    company: 'EstatePro Realtors',
    experience: '15+ years',
    propertiesListed: 312,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 29,
  title: '2BHK Compact Flat',
  price: '₹62 L',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Kalyani Nagar, Pune, Maharashtra',
  landmarks: [
    { name: 'Kalyani Nagar Bus Stop', distance: '0.7 km' },
    { name: 'Phoenix Marketcity Mall', distance: '1.5 km' },
    { name: 'Ruby Hall Clinic', distance: '1.2 km' },
    { name: 'Magarpatta City', distance: '3.6 km' }
  ],
  address: 'Flat No. 305, Silver Oak Residency, Kalyani Nagar Main Road, Pune, Maharashtra 411006',
  type: 'Apartment',
  area: '780 sqft',
  carpetArea: '600 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 25,
  floorNo: 21,
  description: "This 2BHK compact apartment is located in the prime locality of Kalyani Nagar, Pune. Spread across 780 sq.ft with 600 sq.ft carpet area, the north-facing home on the 21st floor offers efficient living with great views. Ready to move, it is ideal for professionals or small families seeking convenience and connectivity.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://gladwinsrealty.com/app/web/upload/medium/169_7592478d631874dbd2e2dfddbf88498a.jpg',
    'https://gladwinsrealty.com/app/web/upload/medium/169_3160c6e893938c47a0c014f8fae4d860.jpg',
    'https://gladwinsrealty.com/app/web/upload/medium/169_bbe34b0a2f448a75c3ccd34dfb8045b7.jpg',
    'https://gladwinsrealty.com/app/web/upload/medium/169_db1993809ffff68551d5e833a40719dc.jpg'
  ],
  agent: {
    name: 'Neha Soni',
    phone: '+91 98670 44821',
    email: 'neha.soni@rentpremium.in',
    image: 'https://img.freepik.com/premium-photo/young-professional-indian-woman-smiling-giving-thumbs-up-gesture-showing-confidence-positivity-busy-environment_822916-4056.jpg',
    company: 'EstatePro Realtors',
    experience: '6+ years',
    propertiesListed: 140,
    rating: 4.5,
    reviews: 128,
  }
},
{
  id: 30,
  title: '4BHK Premium Apartment',
  price: '₹55,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Gachibowli, Hyderabad, Telangana',
  landmarks: [
    { name: 'Gachibowli Metro Station', distance: '1.2 km' },
    { name: 'Microsoft Campus', distance: '2.0 km' },
    { name: 'Inorbit Mall, Hitech City', distance: '3.5 km' },
    { name: 'Gachibowli Stadium', distance: '2.8 km' }
  ],
  address: 'Flat No. 1208, Palm Grove Residency, Near Hitech City Road, Gachibowli, Hyderabad, Telangana 500032',
  type: 'Apartment',
  area: '2400 sqft',
  carpetArea: '2200 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 10,
  floorNo: 4,
  description: 'This 4BHK premium apartment is located in Gachibowli, Hyderabad. Spread across 2400 sq.ft with 2200 sq.ft carpet area, the south-facing home on the 4th floor offers spacious and comfortable living. Ready to move, it is ideal for families seeking a premium home with excellent connectivity.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_141740__Building%20View.jpg',
    'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_135912__Living%20Room.jpg',
    'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_135527__Bedroom%201.jpg',
    'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_140434__Bedroom%203.jpg',
    'http://d131n82dij7gxv.cloudfront.net/upload/uploadedfiles/65ae2e63-6395-468f-b11d-bebed0b39328_IMG_20150609_135715__Kitchen.jpg'
  ],
  agent: {
    name: 'Ananya Reddy',
    phone: '+91 98765 43213',
    email: 'ananya.reddy@realestate.com',
    image: 'https://repleteinc.com/wp-content/uploads/2021/10/replete-employee.jpg',
    company: 'EstatePro Realtors',
    experience: '7+ years',
    propertiesListed: 156,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 31,
  title: '1BHK Affordable Flat',
  price: '₹32 L',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Ulwe, Navi Mumbai, Maharashtra',
  landmarks: [
    { name: 'Ulwe Railway Station', distance: '1.0 km' },
    { name: 'Palm Beach Road', distance: '3.5 km' },
    { name: 'CIDCO Garden', distance: '2.1 km' },
    { name: 'Belapur CBD', distance: '6.8 km' }
  ],
  address: 'Flat No. 102, Shree Sai Residency, Sector 12, Ulwe, Navi Mumbai, Maharashtra 410206',
  type: 'Apartment',
  area: '600 sqft',
  carpetArea: '450 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 25,
  floorNo: 5,
  description: 'This 1BHK affordable apartment is located in Ulwe, Navi Mumbai. Spread across 600 sq.ft with 450 sq.ft carpet area, the east-facing home on the 5th floor offers comfortable and practical living. Ready to move, it is ideal for first-time buyers seeking affordability and good connectivity.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/03/SAM_3161-n.jpg',
    'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/03/SAM_3164-copie-n.jpg',
    'https://www.expatpropertiesmumbai.com/wp-content/uploads/2014/03/SAM_3163-copie-n.jpg'
  ],
  agent: {
    name: 'Aditya Khanna',
    phone: '+91 90823 55147',
    email: 'aditya.khanna@luxuryestate.in',
    image: 'https://media.istockphoto.com/id/1363118407/photo/portrait-of-young-businessman.jpg?s=612x612&w=0&k=20&c=e9xjo1AdlIbr7ttZe3iBG3CBWKUBwdTMLkPus9DxA_s=',
    company: 'EstatePro Realtors',
    experience: '9+ years',
    propertiesListed: 160,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 32,
  title: '3BHK Elite Apartment',
  price: '₹48,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Banashankari, Bengaluru, Karnataka',
  landmarks: [
    { name: 'Banashankari Temple', distance: '1.2 km' },
    { name: 'Kengeri Metro Station', distance: '4.5 km' },
    { name: 'Jayanagar Shopping Complex', distance: '3.8 km' },
    { name: 'Sri Adichunchanagiri College', distance: '2.6 km' }
  ],
  address: 'Flat No. 603, Green Meadows Residency, 3rd Stage, Banashankari, Bengaluru, Karnataka 560085',
  type: 'Apartment',
  area: '1600 sqft',
  carpetArea: '1400 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 30,
  floorNo: 20,
  description: "This 3BHK elite apartment is located in Banashankari, Bengaluru. Spread across 1600 sq.ft with 1400 sq.ft carpet area, the west-facing home on the 20th floor offers spacious and comfortable living. Ready to move, it is ideal for families seeking a premium lifestyle with excellent connectivity.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://cbvalueaddrealty.in/wp-content/uploads/2023/11/3-BHK-Apartment-for-Sale-in-Brigade-Omega-1.jpg',
    'https://cbvalueaddrealty.in/wp-content/uploads/2023/11/3-BHK-Apartment-for-Sale-in-Brigade-Omega-7.jpeg',
    'https://cbvalueaddrealty.in/wp-content/uploads/2023/11/3-BHK-Apartment-for-Sale-in-Brigade-Omega-9.jpeg',
    'https://cbvalueaddrealty.in/wp-content/uploads/2023/11/3-BHK-Apartment-for-Sale-in-Brigade-Omega-10.jpeg'
  ],
  agent: {
    name: 'Aishwarya Menon',
    phone: '+91 90903 33321',
    email: 'aishwarya.menon@elitevilla.in',
    image: 'https://imgv3.fotor.com/images/slider-image/a-woman-in-a-suit.png',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 195,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 33,
  title: '2BHK Garden Facing Flat',
  price: '₹75 L',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Viman Nagar, Pune, Maharashtra',
  landmarks: [
    { name: 'Viman Nagar Bus Stop', distance: '0.6 km' },
    { name: 'Phoenix Marketcity Mall', distance: '2.0 km' },
    { name: 'Symbiosis College', distance: '1.5 km' },
    { name: 'Pune International Airport', distance: '4.5 km' }
  ],
  address: 'Flat No. 302, Green Acres Residency, Viman Nagar Main Road, Pune, Maharashtra 411014',
  type: 'Apartment',
  area: '900 sqft',
  carpetArea: '750 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 15,
  floorNo: 11,
  description: "This 2BHK garden-facing apartment is located in Viman Nagar, Pune. Spread across 900 sq.ft with 750 sq.ft carpet area, the north-facing home on the 11th floor offers peaceful views and comfortable living. Ready to move, it is ideal for families or professionals seeking a well-connected and serene neighborhood.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-25-1170x785.jpeg',
    'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-7.jpeg',
    'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-24.jpeg',
    'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-17.jpeg',
    'https://www.key2home.in/wp-content/uploads/2020/09/2-bhk-fully-furnished-golden-trellis-balewadi-baner-pune-2.jpeg'
  ],
  agent: {
    name: 'Vikram Bhosale',
    phone: '+91 88556 77012',
    email: 'vikram.bhosale@commercialhub.in',
    image: 'https://tse3.mm.bing.net/th/id/OIP.FGXPANbJ2zYz5gcf87vkRgHaJ4?pid=Api&h=220&P=0',
    company: 'EstatePro Realtors',
    experience: '13+ years',
    propertiesListed: 310,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 34,
  title: '4BHK Large Family Home',
  price: '₹2.1 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Panchkula, Delhi NCR',
  landmarks: [
    { name: 'Panchkula Bus Stand', distance: '1.2 km' },
    { name: 'Leisure Valley Park', distance: '2.0 km' },
    { name: 'St. Soldier School', distance: '1.8 km' },
    { name: 'Chandigarh Airport', distance: '12 km' }
  ],
  address: 'House No. 56, Green Valley Residency, Sector 7, Panchkula, Haryana 134109',
  type: 'Independent House',
  area: '2600 sqft',
  carpetArea: '2450 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 30,
  floorNo: 25,
  description: "This 4BHK large family home is located in Panchkula, Delhi NCR. Spread across 2600 sq.ft with 2450 sq.ft carpet area, the west-facing home offers spacious and comfortable living for large families. Ready to move, it is ideal for those seeking space, privacy, and a premium residential environment.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://www.guptasen.com/wp-content/uploads/2025/03/bright-airy-living-room-vascon-orchids-linking-road-santacruz-west.webp',
    'https://www.guptasen.com/wp-content/uploads/2025/03/3-BHK-vascon-orchids-linking-road-main-master-bedroom.webp',
    'https://www.guptasen.com/wp-content/uploads/2025/03/vascon-orchids-linking-road-master-bedroom-of-2-BHK.webp',
    'https://www.guptasen.com/wp-content/uploads/2025/03/kitchen-at-2-BHK-vascon-orchids-linking-road.webp'
  ],
  agent: {
    name: 'Amit Singh',
    phone: '+91 98765 43212',
    email: 'amit.singh@realestate.com',
    image: 'http://www.track2realty.track2media.com/wp-content/uploads/2012/12/Brotin-Banerjee_MD-CEO-at-Tata-Housing.jpg',
    company: 'EstatePro Realtors',
    experience: '15+ years',
    propertiesListed: 312,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 35,
  title: '3BHK Highrise Flat',
  price: '₹40,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Thane, Mumbai, Maharashtra',
  landmarks: [
    { name: 'Thane Railway Station', distance: '3.0 km' },
    { name: 'Korum Mall', distance: '1.8 km' },
    { name: 'Upvan Lake', distance: '2.5 km' },
    { name: 'Hiranandani Hospital', distance: '2.2 km' }
  ],
  address: 'Flat No. 1205, Skyline Towers, Ghodbunder Road, Thane West, Mumbai, Maharashtra 400607',
  type: 'Apartment',
  area: '1400 sqft',
  carpetArea: '1200 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 35,
  floorNo: 30,
  description: 'This 3BHK high-rise apartment is located in Thane, Mumbai. Spread across 1400 sq.ft with 1200 sq.ft carpet area, the east-facing home on the 30th floor offers spacious living with panoramic city views. Ready to move, it is ideal for families seeking comfort, elevation, and excellent connectivity.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://0009.in/wp-content/uploads/classified-listing/2021/12/u.webp',
    'https://0009.in/wp-content/uploads/classified-listing/2021/12/download-4.jpg',
    'https://0009.in/wp-content/uploads/classified-listing/2021/12/images.jpg',
    'https://0009.in/wp-content/uploads/classified-listing/2021/12/57981737_6_PropertyImage630-0185875372603_180_240.jpg'
  ],
  agent: {
    name: 'Aditya Khanna',
    phone: '+91 90823 55147',
    email: 'aditya.khanna@luxuryestate.in',
    image: 'https://media.istockphoto.com/id/1363118407/photo/portrait-of-young-businessman.jpg?s=612x612&w=0&k=20&c=e9xjo1AdlIbr7ttZe3iBG3CBWKUBwdTMLkPus9DxA_s=',
    company: 'EstatePro Realtors',
    experience: '9+ years',
    propertiesListed: 160,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 36,
  title: '2BHK Modern Flat',
  price: '₹60 L',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Kondapur, Hyderabad, Telangana',
  landmarks: [
    { name: 'Mindspace IT Park', distance: '1.0 km' },
    { name: 'Hitech City Metro Station', distance: '2.2 km' },
    { name: 'Forum Sujana Mall', distance: '3.5 km' },
    { name: 'Inorbit Mall, Hitech City', distance: '2.8 km' }
  ],
  address: 'Flat No. 305, Maple Residency, Near Mindspace IT Park, Kondapur, Hyderabad, Telangana 500081',
  type: 'Apartment',
  area: '850 sqft',
  carpetArea: '700 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 4,
  floorNo: 4,
  description: "This 2BHK modern apartment is located in Kondapur, Hyderabad. Spread across 850 sq.ft with 700 sq.ft carpet area, the west-facing home on the 5th floor offers comfortable and well-planned living. Ready to move, it is ideal for professionals or small families seeking convenience and connectivity.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://is1-2.housingcdn.com/4f2250e8/4560dacc3d4e5e99cd138672b8718015/v5/medium.jpg',
    'https://imagecdn.99acres.com/media1/29751/1/595021271M-1755981280499.webp',
    'https://img.squareyards.com/secondaryPortal/638431872899609934-1002240641294129.jpg',
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/537255732.jpg?k=c0b110ab2a7669a6c59029345a3d19713480f4cba6ccc00dd9d5d4898616a67e&o=&hp=1'
  ],
  agent: {
    name: 'Karan Desai',
    phone: '+91 95123 22110',
    email: 'karan.desai@cityrentals.in',
    image: 'https://static.toiimg.com/imagenext/toiblogs/photo/blogs/wp-content/uploads/2017/11/blog-picture.jpg',
    company: 'EstatePro Realtors',
    experience: '6+ years',
    propertiesListed: 150,
    rating: 4.6,
    reviews: 128,
  }
},
{
  id: 37,
  title: '2BHK Sea-facing Apartment',
  price: '₹55,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Bandra West, Mumbai, Maharashtra',
  landmarks: [
    { name: 'Bandra Bandstand', distance: '0.8 km' },
    { name: 'Mount Mary Church', distance: '1.2 km' },
    { name: 'Linking Road', distance: '1.5 km' },
    { name: 'Bandra Railway Station', distance: '2.0 km' }
  ],
  address: 'Flat No. 703, Sea Breeze Residency, Pali Hill Road, Bandra West, Mumbai, Maharashtra 400050',
  type: 'Apartment',
  area: '1100 sqft',
  carpetArea: '900 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'North',
  totalFloors: 30,
  floorNo: 10,
  description: 'This 2BHK sea-facing apartment is located in Bandra West, Mumbai. Spread across 1100 sq.ft with 900 sq.ft carpet area, the north-facing home on the 10th floor offers serene sea views and comfortable living. Ready to move, it is ideal for professionals or families seeking a premium coastal lifestyle.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
  ],
  images: [
    'https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/false-ceiling-homes-pilot-1660820004-eRVFP/hometour-1660820029-cuOHh/ht-in-lr-0032-1661189252-OByZv/1-1661189264-VuCV5.jpg',
    'https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/false-ceiling-homes-pilot-1660820004-eRVFP/hometour-1660820029-cuOHh/ht-in-lr-0032-1661189252-OByZv/6-1661189292-GtoNb.jpg',
    'https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/false-ceiling-homes-pilot-1660820004-eRVFP/hometour-1660820029-cuOHh/ht-in-lr-0032-1661189252-OByZv/8-1661189307-2srhu.jpg'
  ],
  agent: {
    name: 'Aditya Khanna',
    phone: '+91 90823 55147',
    email: 'aditya.khanna@luxuryestate.in',
    image: 'https://media.istockphoto.com/id/1363118407/photo/portrait-of-young-businessman.jpg?s=612x612&w=0&k=20&c=e9xjo1AdlIbr7ttZe3iBG3CBWKUBwdTMLkPus9DxA_s=',
    company: 'EstatePro Realtors',
    experience: '9+ years',
    propertiesListed: 160,
    rating: 4.7,
    reviews: 128,
  }
},
{
  id: 38,
  title: '3BHK Luxury Apartment',
  price: '₹1.35 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Dwarka Sector 10, Delhi',
  landmarks: [
    { name: 'Dwarka Sector 10 Metro Station', distance: '0.7 km' },
    { name: 'Dwarka District Park', distance: '1.5 km' },
    { name: 'Maharaja Surajmal Institute', distance: '2.1 km' },
    { name: 'Indira Gandhi International Airport', distance: '10 km' }
  ],
  address: 'Flat No. 1205, Royal Residency, Sector 10, Dwarka, Delhi 110075',
  type: 'Apartment',
  area: '1500 sqft',
  carpetArea: '1300 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'South',
  totalFloors: 5,
  floorNo: 5,
  description: "This 3BHK luxury apartment is located in Dwarka Sector 10, Delhi. Spread across 1500 sq.ft with 1300 sq.ft carpet area, the south-facing home on the 5th floor offers spacious and elegant living. Ready to move, it is ideal for families seeking comfort, style, and excellent connectivity.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
  ],
  images: [
    'https://imagecdn.99acres.com/media1/27013/0/540260619M-1755111487117.jpg',
    'https://imagecdn.99acres.com/media1/27013/0/540260625M-1755111844086.jpg',
    'https://imagecdn.99acres.com/media1/27013/0/540260627M-1755111888041.jpg'
  ],
  agent: {
    name: 'Amit Singh',
    phone: '+91 98765 43212',
    email: 'amit.singh@realestate.com',
    image: 'http://www.track2realty.track2media.com/wp-content/uploads/2012/12/Brotin-Banerjee_MD-CEO-at-Tata-Housing.jpg',
    company: 'EstatePro Realtors',
    experience: '15+ years',
    propertiesListed: 312,
    rating: 4.9,
    reviews: 128,
  }
},
{
  id: 39,
  title: '2BHK Modern Flat',
  price: '₹48,000/month',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Gachibowli, Hyderabad, Telangana',
  landmarks: [
    { name: 'Gachibowli Metro Station', distance: '1.0 km' },
    { name: 'Microsoft Campus', distance: '1.8 km' },
    { name: 'Inorbit Mall, Hitech City', distance: '3.2 km' },
    { name: 'Gachibowli Stadium', distance: '2.5 km' }
  ],
  address: 'Flat No. 502, Palm Grove Residency, Near Hitech City Road, Gachibowli, Hyderabad, Telangana 500032',
  type: 'Apartment',
  area: '1000 sqft',
  carpetArea: '800 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'West',
  totalFloors: 4,
  floorNo: 2,
  description: "This 2BHK modern apartment is located in Gachibowli, Hyderabad. Spread across 1000 sq.ft with 800 sq.ft carpet area, the west-facing home on the 2nd floor offers comfortable and well-planned living. Ready to move, it is ideal for professionals or small families seeking excellent connectivity.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
  ],
  images: [
    'https://dynamic.realestateindia.com/prop_images/1716752/880923_1.jpg',
    'https://dynamic.realestateindia.com/prop_images/1716752/880923_2.jpeg',
    'https://dynamic.realestateindia.com/prop_images/1716752/880923_5.jpeg',
    'https://dynamic.realestateindia.com/prop_images/1716752/880923_4.jpeg',
    'https://dynamic.realestateindia.com/prop_images/1716752/880923_3.jpeg'
  ],
  agent: {
    name: 'Karan Desai',
    phone: '+91 95123 22110',
    email: 'karan.desai@cityrentals.in',
    image: 'https://static.toiimg.com/imagenext/toiblogs/photo/blogs/wp-content/uploads/2017/11/blog-picture.jpg',
    company: 'EstatePro Realtors',
    experience: '6+ years',
    propertiesListed: 150,
    rating: 4.6,
    reviews: 128,
  }
},
{
  id: 40,
  title: '4BHK Premium Villa',
  price: '₹3.2 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Whitefield, Bengaluru, Karnataka',
  landmarks: [
    { name: 'ITPL (International Tech Park)', distance: '2.3 km' },
    { name: 'Forum Neighbourhood Mall', distance: '3.7 km' },
    { name: 'Vydehi Hospital', distance: '3.9 km' },
    { name: 'Hope Farm Junction Metro Station', distance: '3.2 km' }
  ],
  address: 'Villa No. 15, Palm Grove Villas, Varthur Road, Whitefield, Bengaluru, Karnataka 560066',
  type: 'Villa',
  area: '2600 sqft',
  carpetArea: '2400 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 6,
  floorNo: 0,
  description: "This 4BHK premium villa is located in Whitefield, Bengaluru. Spread across 2600 sq.ft with 2400 sq.ft carpet area, the east-facing home offers spacious interiors and privacy. Ready to move, it is ideal for families seeking a luxurious lifestyle in a well-developed locality.",
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://newprojects.99acres.com/projects/urban_housing/urban_the_empress/images/empress.jpg',
    'https://imagecdn.99acres.com/media1/25650/0/513000925O-1755112546448.jpg',
    'https://imagecdn.99acres.com/media1/25650/0/513000923O-1755112549513.jpg'
  ],
  agent: {
    name: 'Aishwarya Menon',
    phone: '+91 90903 33321',
    email: 'aishwarya.menon@elitevilla.in',
    image: 'https://imgv3.fotor.com/images/slider-image/a-woman-in-a-suit.png',
    company: 'EstatePro Realtors',
    experience: '8+ years',
    propertiesListed: 195,
    rating: 4.7,
    reviews: 128,
  }
},
];

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarList, setSimilarList] = useState([]);


  // In a real app, fetch property data based on ID
  // useEffect(() => {
  //   // Simulate API call
  //   const fetchProperty = () => {
  //     setTimeout(() => {
  //       setProperty(mockProperty);
  //       setLoading(false);
  //     }, 500);
  //   };

  //   fetchProperty();
  // }, [id]);

  useEffect(() => {
  setLoading(true);

  const foundProperty = mockProperty.find(
    (p) => String(p.id) === String(id)
  );

  setProperty(foundProperty || null);
  setLoading(false);
}, [id]);



useEffect(() => {
  if (!property) return;

  const filtered = mockProperty.filter(
    (p) =>
      p.id !== property.id &&
      p.type === property.type &&
      p.location.split(',')[1]?.trim() === property.location.split(',')[1]?.trim()
  );

  setSimilarList(filtered.slice(0, 3)); // max 3 cards
}, [property]);


  // const nextImage = () => {
  //   setCurrentImageIndex((prevIndex) => 
  //     prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  // const prevImage = () => {
  //   setCurrentImageIndex((prevIndex) =>
  //     prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
  //   );
  // };

  const nextImage = () => {
  if (!property) return;
  setCurrentImageIndex((prev) =>
    prev === property.images.length - 1 ? 0 : prev + 1
  );
};

const prevImage = () => {
  if (!property) return;
  setCurrentImageIndex((prev) =>
    prev === 0 ? property.images.length - 1 : prev - 1
  );
};


  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, update favorite status in the backend
  };

  const handleContactAgent = (method) => {
    // In a real app, this would trigger a call/email/chat
    switch (method) {
      case 'call':
        window.location.href = `tel:${property.agent.phone}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${property.agent.phone.replace(/\D/g, '')}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${property.agent.email}`;
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Property not found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const displayedAmenities = showAllAmenities 
    ? property.amenities 
    : property.amenities.slice(0, 6);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            <FiChevronLeft className="mr-1" /> Back to results
          </button>
        </div>
      </div>

      {/* Property Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
                <FiMapPin className="mr-1" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FiHeart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <FiShare2 className="h-6 w-6" />
              </button>
              <div className="hidden md:block bg-primary text-white px-6 py-2 rounded-lg font-medium">
                {property.price}
              </div>
            </div>
          </div>
          
          <div className="md:hidden mt-4 bg-primary text-white px-4 py-2 rounded-lg font-medium inline-block">
            {property.price}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-6" style={{ paddingBottom: '60%' }}>
              <img
                src={property.images[currentImageIndex]}
                alt={`Property ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md focus:outline-none"
                aria-label="Previous image"
              >
                <FiChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md focus:outline-none"
                aria-label="Next image"
              >
                <FiChevronRight className="h-6 w-6" />
              </button>
              
              {/* Image Thumbnails */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-2 py-1 rounded">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>
            
            {/* Image Thumbnails Grid (for larger screens) */}
            <div className="hidden md:grid grid-cols-4 gap-2 mb-8">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative overflow-hidden rounded-lg ${currentImageIndex === index ? 'ring-2 ring-primary' : ''}`}
                  style={{ paddingBottom: '75%' }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Property Details</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Property Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.price} <span className="text-sm text-gray-500">({property.pricePerSqft})</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.area} <span className="text-sm text-gray-500">({property.carpetArea} carpet)</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Floors</p>
                  <p className="font-medium text-gray-900 dark:text-white">Floor {property.floorNo} of {property.totalFloors}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Facing</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.facing}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>
            
            {/* Amenities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Amenities</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-2 text-primary">
                      {amenity.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{amenity.name}</span>
                  </div>
                ))}
              </div>
              
              {property.amenities.length > 6 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-4 text-primary hover:text-primary-dark font-medium flex items-center"
                >
                  {showAllAmenities ? 'Show Less' : `+${property.amenities.length - 6} More`}
                </button>
              )}
            </div>
            
            {/* Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{property.address}</p>
              
              {/* Map Placeholder */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FiMapPin className="mx-auto h-12 w-12 mb-2" />
                    <p>Map of {property.location}</p>
                  </div>
                </div>
                {/* In a real app, you would use Google Maps or similar */}
              </div>
              
              {/* <div className="mt-4 text-sm text-gray-500">
                <p>Landmarks:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Andheri Railway Station - 1.2 km</li>
                  <li>Infinity Mall - 2.5 km</li>
                  <li>Juhu Beach - 3.8 km</li>
                  <li>Mumbai Airport - 6.2 km</li>
                </ul>
              </div> */}

            <div className="mt-4 text-sm text-gray-500">
              <p>Landmarks:</p>
              <ul className="list-disc list-inside mt-2">
                  {property.landmarks?.map((landmark, index) => (
                  <li key={index}>
                  {landmark.name} - {landmark.distance}
                  </li>
                  ))}
              </ul>
            </div>

            {!property.landmarks?.length && (
            <p className="text-gray-400">Nearby landmarks not available</p>
           )}
            </div>
            
            {/* Similar Properties */}
            {/* <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Similar Properties</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProperties.map((similar) => (
                  <div key={similar.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <Link to={`/property/${similar.id}`}>
                      <div className="relative">
                        <img 
                          src={similar.image} 
                          alt={similar.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md">
                          <FiHeart className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{similar.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-2">
                          <FiMapPin className="mr-1" size={12} />
                          <span className="line-clamp-1">{similar.location}</span>
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary">{similar.price}</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaBed className="mr-1" />
                            <span className="mr-3">{similar.beds}</span>
                            <FaBath className="mr-1" />
                            <span>{similar.baths}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div> */}

           <div className="mb-8">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
    Similar Properties
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {similarList.length > 0 ? (
      similarList.map((similar) => (
        <div
          key={similar.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <Link to={`/property/${similar.id}`}>
            {/* IMAGE */}
            <div className="relative">
              <img
                src={similar.images?.[0]}
                alt={similar.title}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">
              {/* TITLE */}
              <h3 className="text-base font-semibold text-blue-600 mb-1">
                {similar.title}
              </h3>

              {/* LOCATION */}
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-2">
                <FiMapPin className="mr-1" size={12} />
                <span>{similar.location}</span>
              </p>

              {/* PRICE + BEDS/BATHS */}
              <div className="flex justify-between items-center">
                {/* PRICE – SAME SIZE AS TITLE */}
                <span className="text-base font-semibold text-primary">
                  {similar.price}
                </span>

                <div className="flex items-center text-sm text-gray-500">
                  <FaBed className="mr-1" />
                  <span className="mr-3">{similar.beds ?? 2}</span>
                  <FaBath className="mr-1" />
                  <span>{similar.baths ?? 2}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No similar properties found</p>
    )}
  </div>
</div>


          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Contact Agent */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Agent</h2>
              
              <div className="flex items-center mb-6">
                <img 
                  src={property.agent.image} 
                  alt={property.agent.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{property.agent.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{property.agent.company}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(property.agent.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({property.agent.reviews})</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleContactAgent('call')}
                  className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <FaPhoneAlt className="mr-2" />
                  Call Now
                </button>
                
                <button
                  onClick={() => handleContactAgent('whatsapp')}
                  className="w-full flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <FaWhatsapp className="mr-2 text-xl" />
                  WhatsApp
                </button>
                
                <button
                  onClick={() => handleContactAgent('email')}
                  className="w-full flex items-center justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <FaEnvelope className="mr-2" />
                  Email Agent
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Schedule a Visit</h3>
                <div className="space-y-3">
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <select
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                  >
                    <option>Select Time</option>
                    <option>9:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 12:00 PM</option>
                    <option>2:00 PM - 3:00 PM</option>
                    <option>3:00 PM - 4:00 PM</option>
                    <option>4:00 PM - 5:00 PM</option>
                  </select>
                  <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    Schedule Visit
                  </button>
                </div>
              </div>
            </div>
            
            {/* Price Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Price Trends</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Price in {property.location.split(',')[0]}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">₹12,500/sq.ft</p>
                  <p className="text-sm text-green-600">+5.2% from last year</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price per sq.ft (This Project)</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{property.pricePerSqft}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">EMI Calculator</p>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Estimated EMI</p>
                    <p className="text-xl font-bold text-primary">₹78,450/month</p>
                    <p className="text-xs text-gray-500 mt-1">For 20 years at 8.5% interest</p>
                    <button className="mt-2 text-sm text-primary hover:underline">View EMI Plan</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Safety Tips */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Safety Tips for Buyers</h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Never pay any advance before visiting the property</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Verify all documents before making any payment</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Meet the agent in person before finalizing the deal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
