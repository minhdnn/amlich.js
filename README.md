# 🗓️ Lịch Vạn Niên & Fun Facts

A beautiful Vietnamese lunar calendar application that displays both Gregorian and Lunar dates, calculates fun birthday facts, and provides date conversion utilities.

## ✨ Features

### 🗓️ **Interactive Calendar View**
- **Dual Calendar Display**: Shows both Gregorian (solar) and Vietnamese lunar dates
- **Month Navigation**: Easy navigation between months and years
- **Today Highlight**: Current date is clearly highlighted
- **Weekend Styling**: Weekends are visually distinguished
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎉 **Birthday Fun Facts**
Calculate interesting statistics about your life:
- **Age Calculation**: Both Gregorian and Lunar age
- **Days Lived**: Total number of days you've been alive
- **Life Milestones**: Important day markers (1K, 5K, 10K, 20K, 30K days)
- **Sunday Counter**: How many Sundays you've experienced
- **Tết Celebrations**: Number of Vietnamese New Years celebrated
- **Weekend Birthdays**: How many birthdays fell on weekends
- **Vietnamese Zodiac**: Your zodiac animal and Can-Chi year
- **Birth Day Info**: What day of the week you were born

### 🔄 **Date Converter**
- **Solar to Lunar**: Convert Gregorian dates to Vietnamese lunar calendar
- **Lunar to Solar**: Convert lunar dates back to Gregorian calendar
- **Leap Month Support**: Handle Vietnamese lunar leap months
- **Can-Chi Display**: Shows traditional Vietnamese year naming

## 🖥️ Screenshots

### Calendar View
The main calendar interface showing both solar and lunar dates for each day.

### Fun Facts
Personalized statistics and milestones based on your birthday.

### Date Converter
Easy conversion between Gregorian and Vietnamese lunar calendar systems.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lunar-calendar-fun-facts.git
   cd lunar-calendar-fun-facts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your API keys if needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Technologies Used

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with CSS variables
- **Vietnamese Lunar Calendar Algorithm** - Accurate lunar date calculations

## 📁 Project Structure

```
lunar-calendar-fun-facts/
├── src/
│   ├── index.tsx          # Main React application
│   ├── index.css          # Global styles
│   ├── amlich.js          # Lunar calendar calculation library
│   └── index.html         # HTML template
├── package.json           # Project dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## 🎨 Features in Detail

### Calendar Algorithm
The application uses a precise Vietnamese lunar calendar algorithm that:
- Calculates lunar dates based on astronomical observations
- Handles leap months in the Vietnamese lunar system
- Provides accurate Can-Chi (Heavenly Stems and Earthly Branches) calculations
- Supports historical and future date conversions

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Desktop Enhanced**: Beautiful desktop experience
- **Touch Friendly**: Easy navigation on touch devices
- **Accessible**: Proper ARIA labels and keyboard navigation

### Performance
- **Fast Rendering**: Optimized React components
- **Efficient Calculations**: Memoized expensive computations
- **Smooth Animations**: CSS transitions for better UX

## 🌟 Usage Examples

### Birthday Fun Facts
1. Navigate to the "Fun Facts" tab
2. Select your birth date
3. Click "Khám phá ngay!" to see your personalized statistics
4. Share interesting facts with friends!

### Date Conversion
1. Go to the "Chuyển Đổi" tab
2. Enter a Gregorian date to convert to lunar
3. Or enter a lunar date to convert to Gregorian
4. Toggle leap month for accurate lunar conversions

## 🔧 Customization

### Styling
The application uses CSS variables for easy theming:

```css
:root {
  --primary-color: #ff6f61;
  --secondary-color: #ffc107;
  --background-color: #fdfaf6;
  --text-color: #333;
  /* ... more variables */
}
```

### Localization
Currently supports Vietnamese language. The application structure allows for easy addition of other languages.

## 🐛 Known Issues

- Some very ancient dates (before 1900) may have minor accuracy variations
- Leap month calculations are optimized for the Vietnamese lunar system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vietnamese lunar calendar algorithm based on astronomical calculations
- Inspired by traditional Vietnamese calendar systems
- Special thanks to the Vietnamese developer community
