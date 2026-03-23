import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchParams } from '../types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 
    'India', 'Japan', 'China', 'Brazil', 'Mexico', 'Spain', 'Italy'
  ];

  const canadianProvinces = [
    'Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan',
    'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island',
    'Northwest Territories', 'Yukon', 'Nunavut'
  ];

  const ukCountries = [
    'England', 'Scotland', 'Wales', 'Northern Ireland'
  ];

  const australianStates = [
    'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia',
    'Tasmania', 'Australian Capital Territory', 'Northern Territory'
  ];

  const germanStates = [
    'Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Hesse', 'Saxony',
    'Lower Saxony', 'Berlin', 'Schleswig-Holstein', 'Rhineland-Palatinate', 'Hamburg'
  ];

  const frenchRegions = [
    'Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Hauts-de-France',
    'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', 'Centre-Val de Loire', 'Bourgogne-Franche-Comté'
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry',
    'Chandigarh', 'Ladakh', 'Jammu & Kashmir'
  ];

  const japanesePrefectures = [
    'Tokyo', 'Osaka', 'Kanagawa', 'Aichi', 'Saitama', 'Chiba', 'Hyogo',
    'Hokkaido', 'Fukuoka', 'Shizuoka', 'Kyoto', 'Niigata', 'Gunma'
  ];

  const chineseProvinces = [
    'Beijing', 'Shanghai', 'Guangdong', 'Jiangsu', 'Zhejiang', 'Shandong',
    'Hunan', 'Hubei', 'Fujian', 'Anhui', 'Sichuan', 'Liaoning'
  ];

  const brazilianStates = [
    'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Rio Grande do Sul',
    'Pernambuco', 'Ceará', 'Pará', 'Santa Catarina', 'Goiás', 'Maranhão'
  ];

  const mexicanStates = [
    'Mexico City', 'State of Mexico', 'Jalisco', 'Nuevo León', 'Puebla', 'Guerrero',
    'Veracruz', 'Sinaloa', 'Chihuahua', 'Sonora', 'Coahuila', 'Michoacán'
  ];

  const spanishRegions = [
    'Madrid', 'Catalonia', 'Andalusia', 'Valencia', 'Galicia', 'Castile and León',
    'Basque Country', 'Canary Islands', 'Balearic Islands', 'Aragon', 'Murcia'
  ];

  const italianRegions = [
    'Lombardy', 'Lazio', 'Campania', 'Sicily', 'Veneto', 'Piedmont',
    'Emilia-Romagna', 'Tuscany', 'Liguria', 'Marche', 'Abruzzo'
  ];

  const indianCities = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Navi Mumbai', 'Kolhapur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Raichur'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Kharagpur', 'Haldia', 'Baharampur', 'Jalpaiguri'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Pali'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'North East Delhi', 'North West Delhi', 'South West Delhi', 'Shahdara']
  };

  const indianCityAreas = {
    'Nagpur': [
      'Manewada', 'Dharampeth', 'Civil Lines', 'Sadar', 'Lakadganj', 'Itwari', 'Kamptee', 'Kalmeshwar', 'Hingna', 'Mouda',
      'Umred', 'Bhandara', 'Chandrapur', 'Gondia', 'Wardha', 'Yavatmal', 'Amravati', 'Akola', 'Washim',
      'Buldhana', 'Jalgaon', 'Aurangabad', 'Jalna', 'Parbhani', 'Hingoli', 'Nanded', 'Latur', 'Osmanabad', 'Beed'
    ],
    'Mumbai': [
      'Bandra', 'Andheri', 'Borivali', 'Dadar', 'Ghatkopar', 'Goregaon', 'Jogeshwari', 'Kandivali', 'Kurla', 'Malad',
      'Powai', 'Santacruz', 'Vile Parle', 'Worli', 'Chembur', 'Colaba', 'Cuffe Parade', 'Fort', 'Marine Lines',
      'Nariman Point', 'Churchgate', 'CST', 'Dadar TT', 'Sion', 'Kurla', 'Vikhroli', 'Ghatkopar', 'Bhandup', 'Mulund'
    ],
    'Pune': [
      'Koregaon Park', 'Kalyani Nagar', 'Viman Nagar', 'Shivaji Nagar', 'Camp', 'Deccan', 'Bund Garden', 'Laxmi Road', 'Karve Road', 'Aundh',
      'Baner', 'Balewadi', 'Wakad', 'Hinjewadi', 'Magarpatta', 'Kharadi', 'Hadapsar', 'Fatima Nagar', 'Kondhwa', 'Pashan'
    ],
    'Bangalore': [
      'Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Basavanagudi', 'Malleswaram', 'RT Nagar', 'Hebbal', 'Yelahanka',
      'Electronic City', 'Marathahalli', 'Bellandur', 'Sarjapur', 'Hosur Road', 'Bannerghatta Road', 'Kanakapura', 'BTM Layout', 'JP Nagar'
    ],
    'Chennai': [
      'T Nagar', 'Anna Nagar', 'Adyar', 'Mylapore', 'Tambaram', 'Velachery', 'Porur', 'Guindy', 'Royapettah', 'Nungambakkam',
      'Kodambakkam', 'Triplicane', 'Egmore', 'Chrompet', 'Pallavaram', 'Medavakkam', 'Madhavaram', 'Kolathur', 'Perambur'
    ],
    'Kolkata': [
      'Park Street', 'Camac Street', 'Salt Lake', 'New Town', 'Garia', 'Behala', 'Jadavpur', 'Dum Dum', 'Lake Town', 'Gariahat',
      'Ballygunge', 'Alipore', 'Tollygunge', 'Garia', 'Kasba', 'Maniktala', 'Shyambazar', 'Shobhabazar', 'Chitpur', 'Cossipore'
    ],
    'Hyderabad': [
      'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City', 'Madhapur', 'Kondapur', 'Kukatpally', 'Secunderabad', 'Ameerpet', 'Punjagutta',
      'Begumpet', 'Somajiguda', 'Habsiguda', 'Dilsukhnagar', 'Langer House', 'Nampally', 'Abids', 'Koti', 'Mehdipatnam'
    ],
    'Ahmedabad': [
      'CG Road', 'Ashram Road', 'Bopal', 'Satellite', 'Vastrapur', 'Gurukul', 'Navrangpura', 'Paldi', 'Maninagar', 'Bodakdev',
      'Thaltej', 'Vastrapur', 'Gota', 'Chandkheda', 'Sabarmati', 'Shahibaug', 'Dariapur', 'Kankaria', 'Isanpur'
    ],
    'Jaipur': [
      'MI Road', 'Tonk Road', 'Ajmeri Gate', 'Bapu Nagar', 'Civil Lines', 'C Scheme', 'Jhotwara', 'Malviya Nagar', 'Mansarovar', 'Raja Park',
      'Vaishali Nagar', 'Jagatpura', 'Vidyadhar Nagar', 'Sodala', 'Bani Park', 'Gopalpura', 'Shastri Nagar', 'Vivek Vihar', 'Pratap Nagar'
    ],
    'Lucknow': [
      'Hazratganj', 'Gomti Nagar', 'Alambagh', 'Indira Nagar', 'Mahanagar', 'Aliganj', 'Chowk', 'Aminabad', 'Kaiserbagh', 'Vibhav Khand',
      'Gomti Nagar', 'Jankipuram', 'Vikas Nagar', 'Eldeco', 'Sarojini Nagar', 'Rajendra Nagar', 'Aliganj', 'Mahanagar', 'Chinhat'
    ]
  };

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana',
    'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
    'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const majorCities = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
    'Texas': ['Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
    'Florida': ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale'],
    'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
    'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Lansing'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem']
  };

  const cityAreas = {
    'Los Angeles': [
      'Downtown LA', 'Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice Beach',
      'West Hollywood', 'Pasadena', 'Burbank', 'Culver City', 'Marina Del Rey',
      'Silver Lake', 'Echo Park', 'Koreatown', 'Mid-Wilshire', 'Century City'
    ],
    'San Francisco': [
      'Downtown SF', 'Union Square', 'Fisherman\'s Wharf', 'Chinatown', 'North Beach',
      'Mission District', 'Castro', 'Haight-Ashbury', 'Pacific Heights', 'Marina District',
      'SoMa', 'Nob Hill', 'Richmond District', 'Sunset District', 'Tenderloin'
    ],
    'San Diego': [
      'Downtown SD', 'Gaslamp Quarter', 'La Jolla', 'Pacific Beach', 'Mission Beach',
      'Coronado', 'Point Loma', 'Old Town', 'North Park', 'Hillcrest',
      'Balboa Park', 'Ocean Beach', 'Mission Valley', 'Kearny Mesa', 'Scripps Ranch'
    ],
    'Houston': [
      'Downtown Houston', 'Galleria Area', 'Midtown', 'Montrose', 'Heights',
      'River Oaks', 'Medical Center', 'Energy Corridor', 'Greenway Plaza', 'Memorial',
      'West University', 'Museum District', 'EaDo', 'Third Ward', 'Upper Kirby'
    ],
    'Dallas': [
      'Downtown Dallas', 'Deep Ellum', 'Uptown', 'Oak Lawn', 'Bishop Arts District',
      'Design District', 'Knox/Henderson', 'Lower Greenville', 'Preston Hollow', 'Lakewood',
      'Plano', 'Irving', 'Garland', 'Addison', 'Richardson'
    ],
    'New York City': [
      'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island',
      'Times Square', 'Central Park', 'Wall Street', 'Greenwich Village', 'SoHo',
      'Upper East Side', 'Upper West Side', 'Chelsea', 'Harlem', 'Financial District'
    ],
    'Chicago': [
      'Downtown Chicago', 'Loop', 'River North', 'Lincoln Park', 'Lakeview',
      'Wicker Park', 'Bucktown', 'Gold Coast', 'River North', 'West Loop',
      'South Loop', 'Logan Square', 'Pilsen', 'Bridgeport', 'Hyde Park'
    ],
    'Miami': [
      'Downtown Miami', 'South Beach', 'Brickell', 'Coconut Grove', 'Wynwood',
      'Design District', 'Midtown', 'Key Biscayne', 'Coral Gables', 'Little Havana',
      'Doral', 'Aventura', 'Sunny Isles', 'Bal Harbour', 'Kendall'
    ],
    'Atlanta': [
      'Downtown Atlanta', 'Midtown', 'Buckhead', 'Virginia Highland', 'Inman Park',
      'Little Five Points', 'East Atlanta', 'West Midtown', 'Old Fourth Ward', 'Castleberry Hill',
      'Sandy Springs', 'Dunwoody', 'Alpharetta', 'Roswell', 'Marietta'
    ],
    'Philadelphia': [
      'Center City', 'Old City', 'Society Hill', 'Rittenhouse Square', 'Washington Square',
      'Fishtown', 'Northern Liberties', 'Manayunk', 'University City', 'South Philly',
      'West Philly', 'Germantown', 'Chestnut Hill', 'Bella Vista', 'Queen Village'
    ],
    'Phoenix': [
      'Downtown Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Glendale',
      'Chandler', 'Gilbert', 'Paradise Valley', 'Arcadia', 'Biltmore',
      'Ahwatukee', 'Laveen', 'Maryvale', 'North Phoenix', 'South Mountain'
    ],
    'San Antonio': [
      'Downtown San Antonio', 'River Walk', 'Pearl District', 'Southtown', 'King William',
      'Alamo Heights', 'Stone Oak', 'Helotes', 'Boerne', 'New Braunfels',
      'Schertz', 'Universal City', 'Converse', 'Live Oak', 'Windcrest'
    ]
  };

  const getStatesForCountry = (selectedCountry: string) => {
    switch (selectedCountry) {
      case 'United States': return usStates;
      case 'Canada': return canadianProvinces;
      case 'United Kingdom': return ukCountries;
      case 'Australia': return australianStates;
      case 'Germany': return germanStates;
      case 'France': return frenchRegions;
      case 'India': return indianStates;
      case 'Japan': return japanesePrefectures;
      case 'China': return chineseProvinces;
      case 'Brazil': return brazilianStates;
      case 'Mexico': return mexicanStates;
      case 'Spain': return spanishRegions;
      case 'Italy': return italianRegions;
      default: return [];
    }
  };

  const getCitiesForState = (selectedState: string) => {
    if (country === 'India') {
      return indianCities[selectedState as keyof typeof indianCities] || [];
    } else if (country === 'Canada') {
      return ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Quebec City', 'Winnipeg', 'Hamilton'];
    } else if (country === 'United Kingdom') {
      return ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol', 'Sheffield', 'Newcastle'];
    } else if (country === 'Australia') {
      return ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra'];
    } else if (country === 'Germany') {
      return ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen'];
    } else if (country === 'France') {
      return ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille'];
    } else if (country === 'Japan') {
      return ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo', 'Kobe', 'Fukuoka', 'Sendai'];
    } else if (country === 'China') {
      return ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chongqing', 'Tianjin', 'Wuhan', 'Dongguan', 'Hangzhou'];
    } else if (country === 'Brazil') {
      return ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba'];
    } else if (country === 'Mexico') {
      return ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Toluca', 'Tijuana', 'León', 'Juárez', 'Querétaro'];
    } else if (country === 'Spain') {
      return ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Málaga', 'Murcia', 'Palma', 'Las Palmas'];
    } else if (country === 'Italy') {
      return ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari'];
    }
    return majorCities[selectedState as keyof typeof majorCities] || [];
  };

  const getAreasForCity = (selectedCity: string): string[] => {
    if (country === 'India') {
      return indianCityAreas[selectedCity as keyof typeof indianCityAreas] || [];
    }
    return cityAreas[selectedCity as keyof typeof cityAreas] || [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category.trim() && city.trim()) {
      const location = area ? `${area}, ${city}, ${state}, ${country}` : `${city}, ${state}, ${country}`;
      onSearch({ category: category.trim(), location: location.trim() });
    }
  };

  const popularCategories = [
    'Restaurants', 'Plumbers', 'Electricians', 'Dentists', 
    'Lawyers', 'Real Estate', 'Hair Salons', 'Auto Repair',
    'Veterinarians', 'Accountants', 'Insurance', 'Contractors'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Search GMB Businesses</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Category (Niche)
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Restaurants, Plumbers, Dentists"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {popularCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                disabled={isLoading}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">Select State</option>
              {country === 'India' ? 
                indianStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                )) :
                getStatesForCountry(country).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">Select City</option>
              {getCitiesForState(state).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading || !city}
            >
              <option value="">Select Area</option>
              {getAreasForCity(city).map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !category.trim() || !city.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Searching...' : 'Search Businesses'}
        </button>
      </form>
    </div>
  );
};
