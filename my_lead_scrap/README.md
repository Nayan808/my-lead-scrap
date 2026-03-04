# GMB Audit & Lead Scraper Tool

A powerful web-based tool for auditing Google My Business (GMB) profiles and scraping lead data. This application helps businesses identify opportunities by analyzing GMB listings for missing information, unclaimed profiles, and contact details.

## Features

### 🔍 Search & Scrape
- **Google Places API Integration**: Search for businesses by category and location
- **Comprehensive Data Extraction**: Retrieve business name, address, phone, website, category, rating, and review count
- **Mock Service**: Demo mode for testing without API keys

### 🔍 Audit & Verification
- **Website Analysis**: Automatically flag businesses without websites
- **Email Extraction**: Light web crawling to find public email addresses (contact@, info@, etc.)
- **Phone Verification**: Check for missing phone numbers
- **Claimed Status Detection**: Identify unclaimed GMB profiles

### 🎯 Advanced Filtering
- Filter by website presence (Has/No Website)
- Filter by email availability (Has/No Email)
- Filter by phone number presence (Has/No Phone)
- Filter by rating (e.g., < 3.5 stars for reputation management leads)

### 📊 Data Display & Export
- Clean, responsive table display with status badges
- Real-time filtering with result count
- Export to CSV and Excel formats
- Color-coded status indicators

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd gmb-audit-tool
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser** and navigate to `http://localhost:5173`

## Usage

### Demo Mode (No API Key Required)
The app starts in **Demo Mode** by default, which uses mock data to demonstrate all features:
- Toggle "Demo Mode" off to use real Google Places API
- Test all filtering, export, and email extraction features

### Real API Setup

1. **Get Google Places API Key:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable "Places API"
   - Create API credentials (API Key)
   - Restrict your API key for security

2. **Configure the API Key:**
   - Open `src/services/api.ts`
   - Replace `YOUR_API_KEY_HERE` with your actual API key

3. **Disable Demo Mode:**
   - Toggle "Demo Mode" switch off in the app header

### How to Use

1. **Search for Businesses:**
   - Enter a business category (e.g., "Restaurants", "Plumbers", "Dentists")
   - Enter a location (e.g., "New York", "Los Angeles")
   - Click "Search Businesses"

2. **Apply Filters:**
   - Use the filter panel to narrow results
   - Filter by website, email, phone availability
   - Filter by minimum rating

3. **Extract Emails:**
   - Click "Extract Emails" to find email addresses on business websites
   - Progress is shown in real-time

4. **Export Data:**
   - Use "Export to CSV" or "Export to Excel" buttons
   - Exports include all filtered data with audit results

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Integration**: Axios
- **Data Export**: Papa Parse (CSV), SheetJS (Excel)
- **Email Extraction**: Custom web scraping service

## Project Structure

```
src/
├── components/          # React components
│   ├── SearchForm.tsx  # Search interface
│   ├── FilterPanel.tsx # Advanced filtering
│   ├── BusinessTable.tsx # Results display
│   └── ExportButton.tsx # CSV/Excel export
├── services/           # Business logic
│   ├── api.ts         # Google Places API service
│   └── emailExtractor.ts # Email extraction
├── types.ts           # TypeScript interfaces
└── App.tsx           # Main application
```

## API Rate Limits & Costs

- **Google Places API**: Free tier includes ~$300 monthly credit
- **Typical cost**: ~$0.004 per search result
- **Email extraction**: No additional API costs (direct web requests)

## Security Notes

- API keys should be restricted to your domain in production
- Email extraction respects robots.txt and rate limits
- Consider using a proxy server for production deployments

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Customization

- **Add new filters**: Extend `SearchFilters` interface in `types.ts`
- **Custom email patterns**: Modify regex in `EmailExtractor`
- **Additional data points**: Update `Business` interface and API service

## Troubleshooting

### Common Issues

1. **API Key Errors**: 
   - Verify Google Places API is enabled
   - Check API key restrictions
   - Ensure billing is enabled if needed

2. **Email Extraction Issues**:
   - Some websites block automated requests
   - Rate limiting may occur
   - Consider using a proxy for production

3. **CORS Issues**:
   - Use a proxy server in production
   - Local development should work without issues

## License

This project is for educational and demonstration purposes. Please ensure compliance with Google Maps Platform Terms of Service and website terms of service when using in production.

## Support

For issues and feature requests, please create an issue in the project repository.
