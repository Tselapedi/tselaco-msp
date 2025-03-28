# RideConnect SA

A ride-hailing platform for the South African market, built with Next.js and AWS services.

## Features

- Progressive Web App (PWA) with mobile-first functionality
- User, driver, and admin panels
- Real-time location tracking
- Document verification system
- Push notifications
- Secure authentication and authorization

## Technology Stack

### Frontend
- Next.js for server-side rendering and PWA capabilities
- Material-UI for component library
- TailwindCSS for styling
- Redux for state management

### Backend
- Node.js with Express.js
- PostgreSQL database with Prisma ORM
- AWS Services:
  - Cognito for authentication
  - S3 for document storage
  - SNS for notifications
  - Location Services for maps and tracking
  - SES for email notifications

## Prerequisites

- Node.js 18.x or later
- pnpm package manager
- PostgreSQL database
- AWS account with the following services configured:
  - Cognito User Pool
  - S3 Bucket
  - SNS Platform Application
  - Location Services (Place Index and Tracker)
  - SES for email notifications

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rideconnect-sa.git
   cd rideconnect-sa
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your AWS credentials and update the environment variables in `.env`

5. Initialize the database:
   ```bash
   pnpm prisma migrate dev
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

## AWS Configuration

### Cognito Setup
1. Create a User Pool in AWS Cognito
2. Configure required attributes:
   - Email (required)
   - Phone number (required)
   - Custom attributes:
     - id_number (string)
     - role (string)
3. Create an App Client
4. Update `.env` with the User Pool ID and Client ID

### S3 Setup
1. Create an S3 bucket for document storage
2. Configure CORS for web access
3. Set up appropriate bucket policies
4. Update `.env` with the bucket name and credentials

### SNS Setup
1. Create a Platform Application for push notifications
2. Configure platforms (iOS, Android)
3. Update `.env` with the Platform Application ARN

### Location Services Setup
1. Create a Place Index for geocoding
2. Create a Tracker for real-time location updates
3. Create a Map resource
4. Update `.env` with the resource names

## Development Guidelines

### Code Style
- Follow the ESLint configuration
- Use TypeScript for type safety
- Follow the project's component structure
- Write unit tests for critical functionality

### Git Workflow
1. Create feature branches from `develop`
2. Use conventional commits
3. Submit pull requests for review
4. Merge to `develop` after approval
5. Release to `main` for production

### Security Best Practices
- Follow AWS security best practices
- Implement least privilege access
- Use environment variables for sensitive data
- Validate all user inputs
- Implement rate limiting
- Use HTTPS for all communications

## Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run linting
pnpm lint
```

## Deployment

The application can be deployed to AWS Lightsail:

1. Build the application:
   ```bash
   pnpm build
   ```

2. Follow the AWS Lightsail deployment guide in the deployment documentation.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team at support@rideconnect.co.za
