# Restaurant Hub - Restaurant Management & Ordering System

## 🍽️ Project Overview

Restaurant Hub is a comprehensive web-based restaurant management and food ordering platform that showcases multiple restaurants with their menus, ordering capabilities, and customer management features. The system is designed to provide a seamless experience for both restaurant owners and customers.

## 🌟 Features

### For Customers
- **Multi-Restaurant Browsing**: Explore different restaurants and their menus
- **Interactive Menu Display**: Beautiful image carousels showcasing restaurant dishes
- **Shopping Cart System**: Add items to cart with real-time total calculation
- **Multiple Ordering Methods**: WhatsApp integration, phone calls, and dine-in options
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### For Restaurant Owners
- **Customizable Menus**: Easy-to-update menu items with images and pricing
- **Order Management**: Integrated cart system for order processing
- **Contact Integration**: Direct WhatsApp and phone number integration
- **Professional Presentation**: Modern, attractive restaurant pages

## 🏪 Featured Restaurants

### 1. Esbak Kitchen
- **Cuisine**: Authentic Ghanaian
- **Specialties**: Traditional dishes, local ingredients
- **Location**: Sunyani, Ghana
- **Features**: 7-image carousel, authentic menu items

### 2. Airport Framiclad Restaurant
- **Cuisine**: Ghanaian Continental
- **Specialties**: Jollof rice, grilled tilapia, fresh salads
- **Features**: 7-image carousel, premium menu selection

### 3. First Choice Grills
- **Cuisine**: Premium Grilled Dishes
- **Specialties**: BBQ platters, grilled meats, local favorites
- **Location**: Airport Road, Sunyani
- **Features**: 4-image carousel, grill-focused menu

### 4. Sika Cuisine
- **Cuisine**: De CUISINE MASTERS
- **Specialties**: Jollof rice, fried rice, noodles, local drinks
- **Features**: 4-image carousel, authentic Sika branding

## 🛠️ Technologies & Tools Used

### Frontend Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with custom properties
- **JavaScript (ES6+)**: Interactive functionality and cart management
- **Bootstrap 5.3.0**: Responsive grid system and components
- **Font Awesome 6.4.0**: Icon library for enhanced UI

### Development Tools
- **Visual Studio Code**: Primary code editor
- **Git**: Version control system
- **GitHub**: Repository hosting and collaboration
- **Web Browser DevTools**: Testing and debugging

### Design & Assets
- **Custom CSS**: Tailored styling for restaurant themes
- **Image Optimization**: WebP and JPEG formats for performance
- **Responsive Design**: Mobile-first approach
- **Color Schemes**: Restaurant-specific branding

## 📁 Project Structure

```
Restaurant/
├── css/
│   └── style.css              # Main stylesheet
├── images/                    # Restaurant images and logos
│   ├── logo-Restaurant Hub.png
│   ├── esbak*.webp           # Esbak Kitchen images
│   ├── framiclad*.webp       # Framiclad Restaurant images
│   ├── first choice*.jpg     # First Choice Grills images
│   ├── sika*.jpg             # Sika Cuisine images
│   └── [other restaurant images]
├── js/
│   └── script.js             # JavaScript functionality
├── index.html                # Home page with restaurant listings
├── restaurant1.html          # Esbak Kitchen page
├── restaurant2.html          # Framiclad Restaurant page
├── restaurant3.html          # First Choice Grills page
├── restaurant4.html          # Sika Cuisine page
└── README.md                 # This documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)
- Git (for version control)

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Kodara-HQ/Restaurant.git
   cd Restaurant
   ```

2. **Open in Browser**
   - Simply open `index.html` in your web browser
   - Or use a local server for development

3. **Local Development Server** (Optional)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## 💻 How to Use the Site

### For Customers

#### 1. **Browse Restaurants**
   - Visit the home page to see all featured restaurants
   - Each restaurant has an image carousel showcasing their dishes
   - Click "View Menu" to explore individual restaurant pages

#### 2. **View Menus**
   - Navigate through different menu categories (Starters, Main Courses, Drinks)
   - See high-quality images of each dish
   - View prices in local currency (GH₵ for Ghanaian restaurants)

#### 3. **Order Food**
   - **Add to Cart**: Click "Add to Cart" button on any menu item
   - **View Cart**: Click the cart icon in the navigation bar
   - **Cart Management**: 
     - View selected items and total
     - Remove items if needed
     - Place order when ready

#### 4. **Contact Restaurants**
   - **WhatsApp**: Direct integration with restaurant WhatsApp numbers
   - **Phone**: Call restaurants directly
   - **Dine-in**: Get information about visiting the restaurant

### For Restaurant Owners

#### 1. **Update Restaurant Information**
   - Modify restaurant details in respective HTML files
   - Update contact information, hours, and descriptions
   - Change menu items, prices, and images

#### 2. **Add New Menu Items**
   - Add new menu cards following the existing structure
   - Include images, descriptions, and pricing
   - Update cart functionality for new items

#### 3. **Customize Branding**
   - Replace restaurant logos and hero images
   - Update color schemes and styling
   - Modify restaurant-specific content

## 🔧 Customization Guide

### Adding a New Restaurant

1. **Create Restaurant Page**
   ```html
   <!-- Copy existing restaurant template -->
   <!-- Update restaurant name, description, and contact info -->
   <!-- Replace images with restaurant-specific photos -->
   ```

2. **Update Home Page**
   ```html
   <!-- Add new restaurant card to index.html -->
   <!-- Include image carousel and restaurant details -->
   <!-- Link to the new restaurant page -->
   ```

3. **Update Navigation**
   ```html
   <!-- Ensure all links point to correct pages -->
   <!-- Update cart functionality if needed -->
   ```

### Modifying Menu Items

1. **Update Images**
   - Replace image sources in HTML
   - Ensure images are optimized for web
   - Maintain consistent aspect ratios

2. **Update Prices**
   - Change price values in HTML
   - Update cart functionality accordingly
   - Consider currency formatting

3. **Update Descriptions**
   - Modify menu item descriptions
   - Ensure accuracy and appeal
   - Maintain consistent tone

## 📱 Responsive Design Features

- **Mobile-First Approach**: Optimized for mobile devices
- **Flexible Grid System**: Bootstrap-based responsive layout
- **Touch-Friendly Interface**: Large buttons and touch targets
- **Optimized Images**: WebP format for better performance
- **Adaptive Typography**: Readable text at all screen sizes

## 🎨 Design System

### Color Palette
- **Primary**: Bootstrap primary blue (#0d6efd)
- **Secondary**: Bootstrap secondary gray (#6c757d)
- **Success**: Bootstrap success green (#198754)
- **Warning**: Bootstrap warning yellow (#ffc107)
- **Dark**: Bootstrap dark (#212529)

### Typography
- **Headings**: Bootstrap display classes for hierarchy
- **Body Text**: System fonts for readability
- **Icons**: Font Awesome for visual elements

### Components
- **Cards**: Consistent card design for menu items
- **Buttons**: Bootstrap button styles with custom hover effects
- **Carousels**: Image carousels with navigation controls
- **Navigation**: Fixed top navigation with cart integration

## 🚀 Performance Optimization

### Image Optimization
- WebP format for modern browsers
- JPEG fallbacks for compatibility
- Optimized image sizes for web
- Lazy loading for better performance

### Code Optimization
- Minified CSS and JavaScript
- Efficient DOM manipulation
- Optimized Bootstrap usage
- Clean, semantic HTML

## 🔒 Security Considerations

- **Input Validation**: Client-side form validation
- **XSS Prevention**: Proper HTML escaping
- **Secure Links**: HTTPS for external resources
- **Data Sanitization**: Clean user inputs

## 🌐 Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Core functionality works in older browsers

## 📊 Analytics & Tracking

### Built-in Features
- Cart tracking and management
- User interaction monitoring
- Page view tracking
- Order completion tracking

### Integration Options
- Google Analytics
- Facebook Pixel
- Custom tracking scripts

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Configure custom domain if needed

### Other Hosting Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Automatic deployments from Git
- **AWS S3**: Static website hosting
- **Traditional Hosting**: Upload via FTP/SFTP

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Use semantic HTML
- Follow CSS naming conventions
- Write clean, readable JavaScript
- Include proper comments
- Test across different devices

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Team

- **Development**: Kodara-HQ
- **Design**: Custom design system
- **Content**: Restaurant-specific information
- **Testing**: Cross-browser and device testing

## 📞 Support

For technical support or questions:
- **GitHub Issues**: Report bugs or request features
- **Email**: [Your contact email]
- **Documentation**: Refer to this README

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with 4 restaurants
- Complete ordering system
- Responsive design
- Cart functionality
- WhatsApp integration

### Future Updates
- User authentication system
- Order history tracking
- Payment gateway integration
- Restaurant admin panel
- Mobile app development

## 📚 Additional Resources

- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [GitHub Pages Guide](https://pages.github.com/)
- [Web Development Best Practices](https://developer.mozilla.org/en-US/docs/Web)

---

**Restaurant Hub** - Bringing restaurants and customers together through technology.

*Last updated: January 2025*
