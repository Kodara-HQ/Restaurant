# Restaurant Hub Backend API

A comprehensive Node.js backend API for the Restaurant Hub platform, built with Express.js and Supabase.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Restaurant Management**: CRUD operations for restaurants, menus, and categories
- **Order Management**: Complete order lifecycle with cart functionality
- **User Management**: User profiles, addresses, and order history
- **Real-time Database**: Supabase integration for scalable data storage
- **RESTful API**: Clean, consistent API design with proper error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with bcrypt
- **Validation**: Built-in request validation
- **CORS**: Cross-origin resource sharing enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project
- Modern web browser

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
cd Restaurant
npm install
```

### 2. Environment Configuration

Copy the environment template and configure your Supabase credentials:

```bash
cp env.example .env
```

Edit `.env` with your Supabase project details:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Execute the SQL to create all tables and sample data

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 🗄️ Database Schema

The backend includes a comprehensive database schema with the following tables:

### Core Tables
- **users**: User accounts and authentication
- **restaurants**: Restaurant information and details
- **menu_categories**: Menu organization
- **menu_items**: Individual menu items with pricing
- **orders**: Customer orders and status tracking
- **order_items**: Order line items
- **reviews**: Customer reviews and ratings
- **cart_items**: Shopping cart functionality
- **restaurant_images**: Multiple images per restaurant
- **user_addresses**: Customer delivery addresses

### Views
- **restaurant_details**: Restaurant information with aggregated ratings
- **menu_items_view**: Menu items with category and restaurant info

## 🔐 Authentication & Authorization

### User Roles
- **customer**: Regular customers who can place orders
- **restaurant_owner**: Restaurant owners who manage their establishments
- **admin**: System administrators with full access

### JWT Token Structure
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "role": "customer",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Protected Routes
Most routes require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /logout` - User logout

### Restaurants (`/api/restaurants`)
- `GET /` - Get all restaurants
- `GET /:id` - Get restaurant by ID
- `POST /` - Create new restaurant (authenticated)
- `PUT /:id` - Update restaurant (authenticated)
- `DELETE /:id` - Delete restaurant (soft delete)
- `GET /:id/reviews` - Get restaurant reviews

### Menu (`/api/menu`)
- `GET /items` - Get menu items with filtering
- `GET /items/:id` - Get menu item by ID
- `POST /items` - Create menu item (authenticated)
- `PUT /items/:id` - Update menu item (authenticated)
- `DELETE /items/:id` - Delete menu item (soft delete)
- `GET /categories` - Get menu categories
- `POST /categories` - Create menu category (authenticated)
- `PUT /categories/:id` - Update menu category (authenticated)

### Orders (`/api/orders`)
- `GET /` - Get orders with filtering
- `GET /:id` - Get order by ID
- `POST /` - Create new order (authenticated)
- `PATCH /:id/status` - Update order status (authenticated)

### Cart Management
- `GET /cart/:user_id` - Get user's cart
- `POST /cart` - Add item to cart (authenticated)
- `PUT /cart/:id` - Update cart item (authenticated)
- `DELETE /cart/:id` - Remove item from cart (authenticated)
- `DELETE /cart/clear/:user_id` - Clear user's cart (authenticated)

### Users (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user (admin only)
- `PATCH /:id/status` - Update user status (admin only)
- `GET /:id/addresses` - Get user addresses
- `POST /:id/addresses` - Add user address (authenticated)
- `PUT /:id/addresses/:address_id` - Update user address (authenticated)
- `DELETE /:id/addresses/:address_id` - Delete user address (authenticated)
- `GET /:id/orders` - Get user orders
- `GET /:id/reviews` - Get user reviews

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Request data validation and sanitization
- **Role-based Access Control**: Granular permissions system
- **CORS Protection**: Configurable cross-origin access
- **SQL Injection Prevention**: Supabase client with parameterized queries

## 📱 Frontend Integration

The backend is designed to work seamlessly with the existing Restaurant Hub frontend. Update your frontend JavaScript to use these API endpoints instead of static data.

### Example: Fetching Restaurants
```javascript
// Old static approach
// const restaurants = [...]; // Static data

// New API approach
fetch('/api/restaurants')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      displayRestaurants(data.data);
    }
  })
  .catch(error => console.error('Error:', error));
```

### Example: User Authentication
```javascript
// Login
const loginData = {
  email: 'user@example.com',
  password: 'password123'
};

fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(loginData)
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
});
```

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Restaurants
```bash
curl http://localhost:5000/api/restaurants
```

### User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🚀 Deployment

### Environment Variables
Ensure all environment variables are properly set in production:
- Use strong JWT secrets
- Configure production Supabase credentials
- Set appropriate CORS origins

### Process Management
For production deployment, consider using:
- **PM2**: Process manager for Node.js
- **Docker**: Containerization
- **Nginx**: Reverse proxy
- **SSL/TLS**: HTTPS encryption

### Example PM2 Configuration
```bash
npm install -g pm2
pm2 start server.js --name "restaurant-hub-api"
pm2 startup
pm2 save
```

## 🔧 Development

### Project Structure
```
Restaurant/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── env.example           # Environment template
├── routes/               # API route handlers
│   ├── auth.js          # Authentication routes
│   ├── restaurants.js   # Restaurant management
│   ├── menu.js          # Menu management
│   ├── orders.js        # Order processing
│   └── users.js         # User management
├── middleware/           # Custom middleware
│   └── auth.js          # Authentication middleware
├── database/             # Database schema
│   └── schema.sql       # Complete database setup
└── BACKEND_README.md     # This file
```

### Adding New Routes
1. Create a new route file in the `routes/` directory
2. Define your route handlers
3. Import and register the routes in `server.js`
4. Add appropriate middleware for authentication/authorization

### Database Migrations
For production, consider using a migration system:
- **Supabase Migrations**: Built-in migration support
- **Knex.js**: SQL query builder with migrations
- **Sequelize**: ORM with migration support

## 🐛 Troubleshooting

### Common Issues

**1. Supabase Connection Error**
- Verify your environment variables
- Check Supabase project status
- Ensure proper network access

**2. JWT Token Issues**
- Check token expiration
- Verify JWT secret configuration
- Ensure proper token format in headers

**3. CORS Errors**
- Configure CORS origins properly
- Check frontend domain settings
- Verify preflight request handling

**4. Database Errors**
- Check table existence
- Verify column names and types
- Check foreign key constraints

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=*
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [JWT.io](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support:
- Check the troubleshooting section
- Review API documentation
- Open an issue on GitHub
- Contact the development team

---

**Restaurant Hub Backend** - Powering the future of restaurant management and food ordering.
