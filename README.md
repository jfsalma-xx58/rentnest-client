# RentNest — Property Rental & Booking Platform

RentNest is a rental marketplace for Bangladesh. Tenants discover approved rental properties, reserve them and pay a reservation fee online. Owners list and manage properties and respond to booking requests. Administrators review listings, manage users and oversee bookings and transactions. All prices are shown in Bangladeshi taka (৳).

## 🌐 Live Links

- **Live website:** https://rentnest-ypx1fy.vercel.app/
- **Client repository:** https://github.com/jfsalma-xx58/rentnest-client
- **Server repository:** https://github.com/jfsalma-xx58/rentnest-server
- **Server API:** https://rentnest-server-phi.vercel.app/

**Admin demo account:** `admin.demo@gmail.com` / `Admin1`

## ✨ Key Features

### Public website
- Responsive homepage with a search bar, featured property, popular locations and a call to action.
- Search properties by location, property type and rent range in BDT.
- Sort by price and paginate results.
- Property details page with images, amenities and rental information.

### Authentication and roles
- Email/password and Google sign-in through Firebase Authentication.
- The server verifies the Firebase ID token before issuing its own JWT.
- Role-based access for tenants, owners and administrators, with protected routes.
- Profile page.

### Tenants
- Save favorite properties.
- Book a property with a move-in date, contact number and notes.
- Pay the reservation fee securely with Stripe.
- View booking history with booking and payment status.
- Submit property reviews.

### Owners
- Add, update and delete properties (new listings wait for admin approval).
- See rejection feedback from the admin.
- Approve or reject booking requests (a rejected booking is refunded).
- Dashboard with total earnings and a 12-month earnings chart.

### Administrators
- View all users and change roles.
- Approve, reject, update or delete properties, with rejection feedback.
- View all bookings and all transactions.

## 💱 Currency

- Property rents are stored in **USD** in the database and displayed in **BDT** using a fixed rate (1 USD = ৳123.75).
- The reservation fee is **10% of the rent in BDT**. It is saved in BDT and shown in BDT everywhere.
- Stripe charges the equivalent amount in USD. The USD charge is saved next to each booking for reference.
- The rate is set with `BDT_PER_USD` on the server. It does not update automatically.

## 🛠️ npm Packages

### Client
`react`, `react-dom`, `react-router-dom`, `vite`, `tailwindcss`, `framer-motion`, `react-icons`, `axios`, `react-hot-toast`, `recharts`, `firebase`, `@stripe/stripe-js`, `@stripe/react-stripe-js`

### Server
`express`, `cors`, `dotenv`, `mongodb`, `jsonwebtoken`, `firebase-admin`, `stripe`

Check each project's `package.json` for the exact versions.

### Services
MongoDB Atlas (database), Firebase (authentication), Stripe (payments), Vercel (hosting).

## ⚙️ Run Locally

You need Node.js, npm, a MongoDB database, a Firebase project and a Stripe test account.

### 1. Server

```bash
git clone https://github.com/jfsalma-xx58/rentnest-server.git
cd rentnest-server
npm install
```

Create a `.env` file in the server folder:

```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=a-long-random-string
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=your-stripe-test-secret-key
FIREBASE_PROJECT_ID=your-firebase-project-id
BDT_PER_USD=123.75
PAYMENT_CURRENCY=usd
```

Optional:

```
FIREBASE_SERVICE_ACCOUNT_JSON=      # full service-account JSON, if you prefer it to the project ID
REQUIRE_VERIFIED_EMAIL=false        # set to true once registration sends a verification email
```

Start the server:

```bash
npm run dev
```

Optional sample data for testing (placeholder listings; replace before launch):

```bash
node seed.js
```

### 2. Client

```bash
git clone https://github.com/jfsalma-xx58/rentnest-client.git
cd rentnest-client
npm install
```

Create a `.env` file in the client folder:

```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_STRIPE_PUBLIC_KEY=your-stripe-publishable-key
```

Start the client:

```bash
npm run dev
```

Use the Stripe test card `4242 4242 4242 4242` with any future expiry date, any CVC and any ZIP.

## 🔐 Security

- Secrets (database URI, Stripe secret key, JWT secret) live only in server environment variables. Both `.env` files are git-ignored.
- `/jwt` and `/users` require a valid Firebase ID token. The user's email always comes from the verified token.
- Private API routes require the server JWT, and admin and owner routes check the user's role in MongoDB.
- Pending and rejected properties are visible only to their owner and admins.
- Owner emails are hidden from public property lists.
- Payments are verified with Stripe on the server, saved once per payment, and refunded automatically if a booking cannot be created or is rejected.
- CORS allows only the configured client origin.

## 📁 Project Structure

**Client:** components, pages, dashboard pages by role, hooks (auth and axios), routes, utilities.

**Server:** a single Express app (`index.js`) with authentication and role middleware, property, favorite, booking, review, payment and admin routes, plus optional scripts for sample data.