好的，这是我们刚刚创建的完整的 `architecture.md` 文档内容。

您可以复制以下所有文本，并将其保存到您本地一个名为 `architecture.md` 的文件中。

````markdown
# Charging Station SaaS System Fullstack Architecture Document

### 1. Introduction
本文档概述了“充电站 SaaS 系统”项目的完整全栈架构，包括后端系统、前端实现及其集成方式。它将作为 AI 驱动开发过程中唯一的“事实来源”，确保整个技术栈的一致性。这种统一的方法将传统上独立的后端和前端架构文档合并，以简化现代全栈应用的开发流程，因为在现代应用中，前后端的关联日益紧密。

#### Starter Template or Existing Project
* N/A - Greenfield project。
* **说明**: 本项目为全新开发。此架构将根据 PRD 中已确定的技术栈（如 Next.js, NestJS, Chakra UI 等）从零开始设计，不基于任何现有的启动模板。

#### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-08-19 | 1.0 | Initial architecture draft | Winston, Architect |

---
### 2. High Level Architecture

#### Technical Summary
This project will be a full-stack, multi-tenant SaaS application built on a TypeScript-based monorepo. The frontend consists of a responsive Next.js web application for our portal users and a React Native application for drivers. The backend is a serverless architecture using NestJS on AWS Lambda, communicating with a PostgreSQL database. The entire system is designed for scalability, security, and a streamlined developer experience.

#### Platform and Infrastructure Choice
* **Platform:** A hybrid approach using **Vercel** for the frontend and **Amazon Web Services (AWS)** for the backend.
* **Key Services:**
    * **Vercel:** Hosting for the Next.js web portals, providing CI/CD, global CDN, and serverless function capabilities for the frontend.
    * **AWS:**
        * **Lambda:** For running the serverless backend API.
        * **API Gateway:** To manage and secure API endpoints.
        * **RDS for PostgreSQL:** For a managed, scalable relational database.
        * **S3:** For file storage (e.g., company logos).
        * **Cognito (or similar):** For managing user authentication.
* **Rationale:** This combination offers the best of both worlds: Vercel provides a superior developer experience and performance for the Next.js frontend, while AWS offers a robust, scalable, and secure backend infrastructure that can handle the complex needs of a SaaS application.

#### Repository Structure
* **Structure:** **Monorepo**
* **Monorepo Tool:** We will use **Turborepo** to manage the monorepo.
* **Rationale:** A monorepo is ideal for this fullstack project as it will streamline code sharing between the frontend, mobile app, and backend (especially for shared types via the `packages/shared-types` directory), simplify dependency management, and allow for unified tooling (linting, testing, etc.).

#### High Level Architecture Diagram
```mermaid
graph TD
    subgraph Users
        U1(EV Driver)
        U2(Company Operator / Admin)
    end

    subgraph Frontend
        M[React Native Mobile App]
        W[Next.js Web Portals on Vercel]
    end

    subgraph AWS Cloud
        APG[API Gateway]
        subgraph Backend Services
            API[NestJS on AWS Lambda]
        end
        DB[(PostgreSQL on RDS)]
        S3[S3 for File Storage]
    end
    
    subgraph Third Party
        Stripe[Stripe for Payments]
    end

    subgraph Physical Hardware
      Charger(Charging Station Hardware)
    end

    U1 --> M
    U2 --> W
    M --> APG
    W --> APG
    APG --> API
    API --> DB
    API --> S3
    API --> Stripe
    Charger -- OCPP Protocol --> API
````

#### Architectural Patterns

  * **Jamstack Architecture:** The Next.js web portals will be built following Jamstack principles (pre-rendered frontend, decoupled from backend APIs) for optimal performance and security.
  * **Serverless Architecture:** The backend API will be fully serverless, leveraging AWS Lambda to ensure scalability and cost-efficiency.
  * **API Gateway Pattern:** All frontend clients will communicate with the backend through a single, managed API Gateway. This centralizes concerns like authentication, rate limiting, and request routing.
  * **Repository Pattern:** The backend services will use the repository pattern to abstract data access logic. This decouples business logic from the database, making the application easier to test and maintain.

-----

### 3\. Tech Stack

#### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Language** | TypeScript | `~5.4` | Primary language for all frontend code | Provides type safety and scalability, improving code quality. |
| **Frontend Framework** | Next.js | `~14.2` | Framework for web portals | Enables server-side rendering & static generation for performance. |
| **UI Component Library** | Chakra UI | `~2.8` | UI components for web portals | User requirement; excellent for accessibility and rapid development. |
| **State Management** | Zustand | `~4.5` | Manages global state in React | Simple, lightweight, and unopinionated; sufficient for MVP needs. |
| **Backend Language** | TypeScript | `~5.4` | Primary language for all backend code | Consistency with frontend stack; type safety for APIs. |
| **Backend Framework**| NestJS | `~10.3` | Framework for backend API | Provides a modular, scalable architecture for building APIs. |
| **API Style** | REST API | `3.0` | Defines how frontend and backend communicate | Well-understood, industry-standard, and easy to consume. |
| **Database** | PostgreSQL | `16` | Primary data store | Powerful, reliable, and excellent for relational data and multi-tenancy. |
| **File Storage** | AWS S3 | N/A | Stores user-uploaded files (e.g., logos) | Industry standard for scalable, durable, and cost-effective object storage. |
| **Authentication** | AWS Cognito | N/A | Manages user pools, login, and sessions | Secure, managed service that integrates well with our AWS backend. |
| **Frontend Testing** | Jest & RTL | `~29.7` | Unit/Integration tests for components | Industry standard for testing React applications. |
| **Backend Testing** | Jest & Supertest | `~29.7` | Unit/Integration tests for API endpoints | Jest provides consistency; Supertest simplifies HTTP testing. |
| **E2E Testing** | Cypress | `~13.7` | End-to-end testing of user flows | Powerful tool for testing the application from the user's perspective. |
| **Build Tool** | Turborepo | `~1.13` | Manages the monorepo build process | High-performance build system optimized for JavaScript/TypeScript monorepos. |
| **Infrastructure (IaC)**| AWS CDK | `~2.138` | Defines cloud infrastructure as code | Allows us to define infrastructure in TypeScript, ensuring consistency. |
| **CI/CD** | GitHub Actions | N/A | Automates build, test, and deployment | Seamless integration with our source code repository. |
| **Monitoring** | AWS CloudWatch | N/A | Monitors application health and performance | Native AWS service that integrates deeply with Lambda and RDS. |

-----

### 4\. Data Models

#### User

  * **Purpose:** Represents any individual who can authenticate with the system, including EV Drivers, Company Operators, and Platform Admins.
  * **Relationships:** An Operator User belongs to one Company. An EV Driver User has many Charging Sessions.

**TypeScript Interface**

```typescript
interface User {
  id: string; // e.g., UUID
  email: string;
  role: 'ADMIN' | 'OPERATOR' | 'DRIVER';
  companyId?: string; // Foreign key to Company, only for OPERATOR role
  createdAt: Date;
  updatedAt: Date;
}
```

-----

#### Company (Tenant)

  * **Purpose:** Represents a single tenant in our multi-tenant SaaS platform.
  * **Relationships:** Has many Operator Users. Has many Stations.

**TypeScript Interface**

```typescript
interface Company {
  id: string; // e.g., UUID
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  branding: {
    logoUrl?: string;
    primaryColor?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

-----

#### Station

  * **Purpose:** Represents a physical location with one or more charging piles.
  * **Relationships:** Belongs to one Company. Has many Chargers.

**TypeScript Interface**

```typescript
interface Station {
  id: string; // e.g., UUID
  companyId: string; // Foreign key to Company
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  gpsCoordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

-----

#### Charger

  * **Purpose:** Represents an individual charging pile (桩) at a Station.
  * **Relationships:** Belongs to one Station. Has many Charging Sessions.

**TypeScript Interface**

```typescript
interface Charger {
  id: string; // e.g., UUID
  stationId: string; // Foreign key to Station
  model: string;
  status: 'AVAILABLE' | 'CHARGING' | 'FAULTED';
  powerRatingKw: number;
}
```

-----

#### ChargingSession

  * **Purpose:** Represents a single, completed or in-progress charging event.
  * **Relationships:** Belongs to one Charger. Belongs to one User (the driver).

**TypeScript Interface**

```typescript
interface ChargingSession {
  id: string; // e.g., UUID
  chargerId: string; // Foreign key to Charger
  userId: string; // Foreign key to User
  startTime: Date;
  endTime?: Date;
  energyDeliveredKwh: number;
  totalCost: number;
  paymentStatus: 'PAID' | 'DUE' | 'FAILED';
}
```

-----

### 5\. API Specification

#### REST API Specification (OpenAPI 3.0)

```yaml
openapi: 3.0.0
info:
  title: Charging Station SaaS API
  version: 1.0.0
  description: API for managing charging stations, companies, and user sessions.
servers:
  - url: /api/v1
    description: API Server

paths:
  /auth/login:
    post:
      summary: User Login
      description: Authenticates a user and returns a JWT.
  /auth/register:
    post:
      summary: EV Driver Registration
      description: Creates a new EV driver user account.

  /admin/companies:
    get:
      summary: List all companies (Admin only)
      description: Retrieves a list of all tenant companies.
    post:
      summary: Create a new company (Admin only)
      description: Adds a new tenant company to the system.

  /stations:
    get:
      summary: Get stations for the current company
      description: Retrieves a list of stations for the authenticated company operator.
    post:
      summary: Create a new station
      description: Adds a new station for the authenticated company operator.

  /stations/{stationId}/chargers:
    post:
      summary: Add a charger to a station
      description: Adds a new charger to a specific station.
  
  /sessions/start:
    post:
      summary: Start a charging session (Driver only)
      description: Initiates a new charging session by a driver.
  /sessions/stop:
    post:
      summary: Stop a charging session (Driver only)
      description: Stops an active charging session.

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        role:
          type: string
          enum: [ADMIN, OPERATOR, DRIVER]
    Station:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        address:
          type: object
          properties:
            street:
              type: string
            city:
              type: string
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

-----

### 6\. Components

#### Component List

  * **Web Frontend (Portals)**

      * **Responsibility:** Provides the UI for Platform Admins and Company Operators. Handles user input, renders data from the API, and manages client-side state.
      * **Key Interfaces:** Consumes the REST API.
      * **Dependencies:** Backend API.
      * **Technology Stack:** Next.js, Chakra UI, Zustand.

  * **Mobile App**

      * **Responsibility:** Provides the UI for EV Drivers. Manages the entire charging flow from station discovery to payment.
      * **Key Interfaces:** Consumes the REST API; interacts with device hardware (GPS, Camera).
      * **Dependencies:** Backend API.
      * **Technology Stack:** React Native.

  * **Backend API (Core Services)**

      * **Responsibility:** Handles all business logic, data validation, and orchestration. Exposes the secure REST API for all clients.
      * **Key Interfaces:** Provides the REST API. Consumes the Database and Authentication Service.
      * **Dependencies:** Database, Authentication Service, External APIs (Stripe).
      * **Technology Stack:** NestJS on AWS Lambda.

  * **Authentication Service**

      * **Responsibility:** Manages user identities, sign-up, login, and the issuance of JWTs.
      * **Key Interfaces:** Provides authentication endpoints (e.g., `/login`, `/register`).
      * **Dependencies:** Database (for user records).
      * **Technology Stack:** AWS Cognito.

  * **Database**

      * **Responsibility:** Persists all application data, including users, companies, stations, chargers, and sessions.
      * **Key Interfaces:** SQL interface consumed by the Backend API's data access layer.
      * **Dependencies:** None.
      * **Technology Stack:** PostgreSQL on AWS RDS.

-----

#### Component Diagrams

This diagram illustrates the primary interactions between the major components.

```mermaid
graph TD
    subgraph Clients
        WebApp[Web Frontend]
        MobileApp[Mobile App]
    end

    subgraph Backend
        Auth[Authentication Service]
        API[Backend API]
        DB[(Database)]
    end
    
    WebApp --> API
    MobileApp --> API
    WebApp --> Auth
    MobileApp --> Auth
    API --> DB
    Auth --> DB
```

-----

### 7\. External APIs

#### Stripe API

  * **Purpose:** To securely process payments from EV drivers after charging sessions and to handle the financial records.

  * **Documentation:** Official Stripe API documentation at `https://stripe.com/docs/api`

  * **Base URL(s):** `https://api.stripe.com`

  * **Authentication:** All requests must be authenticated from our secure backend using a secret API key provided in an `Authorization: Bearer <YOUR_SECRET_KEY>` header.

  * **Rate Limits:** The application must gracefully handle potential rate-limiting errors (`429 Too Many Requests`).

  * **Integration Notes:**

      * The frontend clients will use a **publishable key** to tokenize card information directly with Stripe, ensuring sensitive card details never touch our servers.
      * Our backend will receive this token to create customers and charge them.
      * We will need to configure webhooks to receive asynchronous events from Stripe, such as charge failures or disputes.

  * **Key Endpoints Used:**

      * `POST /v1/customers`: To create a Stripe Customer object for each EV driver when they add their first payment method.
      * `POST /v1/payment_methods`: To create and attach a new payment method to a Customer.
      * `POST /v1/payment_intents`: To create, confirm, and process a payment after a charging session is completed.

-----

### 8\. Core Workflows

#### User Registration & Login Flow

This diagram shows the sequence for a new EV driver registering and authenticating with the system.

```mermaid
sequenceDiagram
    participant User
    participant Frontend Client
    participant Auth Service (Cognito)
    participant Backend API
    participant Database

    User->>Frontend Client: Enters registration details
    Frontend Client->>Auth Service (Cognito): Submits registration request
    Auth Service (Cognito)->>Database: Creates user record
    Database-->>Auth Service (Cognito): Confirms creation
    Auth Service (Cognito)-->>Frontend Client: Returns JWT (Token)
    Frontend Client->>Frontend Client: Stores token securely
    
    loop Subsequent Authenticated Requests
        Frontend Client->>Backend API: API Request with JWT
        Backend API->>Backend API: Validate JWT
        Backend API-->>Frontend Client: Secure Response
    end
```

-----

#### Charging Session Lifecycle Flow

This diagram illustrates the end-to-end process of a driver starting and stopping a charging session.

```mermaid
sequenceDiagram
    participant Driver
    participant Mobile App
    participant Backend API
    participant Stripe API
    participant Database
    participant Charger Hardware

    Driver->>Mobile App: Scans QR Code on Charger
    Mobile App->>Backend API: POST /sessions/start {chargerId}
    Backend API->>Database: Validate charger is 'AVAILABLE'
    Database-->>Backend API: Charger is available
    Backend API->>Charger Hardware: Send 'Unlock' command (via OCPP)
    Charger Hardware-->>Backend API: Acknowledge unlock
    Backend API->>Database: Create ChargingSession record (status: 'CHARGING')
    Database-->>Backend API: Confirm record created
    Backend API-->>Mobile App: Success, session started
    Mobile App->>Driver: Display 'Active Session' screen
    
    Note right of Driver: ...Time passes, charging occurs...

    Driver->>MobileApp: Taps 'Stop Charging'
    Mobile App->>Backend API: POST /sessions/stop {sessionId}
    Backend API->>Charger Hardware: Send 'Lock' command (via OCPP)
    Backend API->>Database: Update Session (endTime, energyKwh)
    Backend API->>Backend API: Calculate totalCost
    Backend API->>Stripe API: Create PaymentIntent(amount, customer)
    Stripe API-->>Backend API: Payment Success
    Backend API->>Database: Update Session (paymentStatus: 'PAID')
    Database-->>Backend API: Confirm update
    Backend API-->>Mobile App: Success, returns session summary
    Mobile App->>Driver: Display receipt
```

-----

### 9\. Database Schema

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Tenants (Charging Companies)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
    branding JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for all Users (Admins, Operators, Drivers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'OPERATOR', 'DRIVER')),
    company_id UUID REFERENCES companies(id), -- Nullable for Admins and Drivers
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);

-- Table for physical charging stations
CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    address JSONB NOT NULL,
    gps_coordinates JSONB NOT NULL, -- For simplicity; PostGIS geography type is better for production
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_stations_company_id ON stations(company_id);
CREATE INDEX idx_stations_gps_coordinates ON stations USING GIN(gps_coordinates); -- For geo-queries

-- Table for individual charging piles (樁)
CREATE TABLE chargers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL REFERENCES stations(id),
    model VARCHAR(100),
    status VARCHAR(50) NOT NULL CHECK (status IN ('AVAILABLE', 'CHARGING', 'FAULTED')),
    power_rating_kw DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_chargers_station_id ON chargers(station_id);
CREATE INDEX idx_chargers_status ON chargers(status);

-- Table for charging session records
CREATE TABLE charging_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    charger_id UUID NOT NULL REFERENCES chargers(id),
    user_id UUID NOT NULL REFERENCES users(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    energy_delivered_kwh DECIMAL(10, 3),
    total_cost DECIMAL(10, 2),
    payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('PAID', 'DUE', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_charging_sessions_charger_id ON charging_sessions(charger_id);
CREATE INDEX idx_charging_sessions_user_id ON charging_sessions(user_id);
```

-----

### 10\. Frontend Architecture

#### Component Architecture

  * **Component Organization**
      * We will organize components into three main directories within `apps/web/src/components/`:
    <!-- end list -->
    ```
    /components
    ├── /features    // Components with business logic (e.g., StationList, AddChargerForm)
    ├── /layouts     // Page layout components (e.g., DashboardLayout, AuthLayout)
    └── /ui          // General-purpose, reusable UI elements (e.g., StyledButton, StatCard)
    ```
  * **Component Template**
      * All components will be written as typed functional components.
    <!-- end list -->
    ```typescript
    import { Box, Heading } from "@chakra-ui/react";

    interface MyComponentProps {
      title: string;
    }

    export const MyComponent = ({ title }: MyComponentProps) => {
      return (
        <Box>
          <Heading size="md">{title}</Heading>
        </Box>
      );
    };
    ```

-----

#### State Management Architecture

  * **State Structure**
      * Global state will be managed with Zustand. Stores will be organized by domain in `apps/web/src/stores/`.
    <!-- end list -->
    ```
    /stores
    ├── useAuthStore.ts      // Manages user session, token, and profile
    └── useStationStore.ts   // Manages station and charger data
    ```
  * **State Management Patterns**
      * **Global State (Zustand):** For state that is shared across many components (e.g., user authentication status).
      * **Local State (`useState`):** For state that is confined to a single component (e.g., form input values).

-----

#### Routing Architecture

  * **Route Organization**
      * We will use the Next.js App Router. Routes will be defined by the directory structure inside `apps/web/src/app/`.
    <!-- end list -->
    ```
    /app
    ├── /login               // Route for /login
    ├── /dashboard           // Route for /dashboard
    │   ├── /stations        // Route for /dashboard/stations
    │   │   ├── /[stationId] // Route for /dashboard/stations/some-id
    │   │   └── page.tsx
    │   └── layout.tsx       // Layout for all dashboard pages
    └── layout.tsx           // Root layout
    ```
  * **Protected Route Pattern**
      * A layout component (`/dashboard/layout.tsx`) will wrap all protected pages. This layout will check for a valid authentication token from `useAuthStore` and redirect to `/login` if the user is not authenticated.

-----

#### Frontend Services Layer

  * **API Client Setup**
      * A central `axios` instance will be configured to automatically include the base URL and the authentication token in all requests.
    <!-- end list -->
    ```typescript
    // In /lib/api.ts
    import axios from 'axios';
    import { useAuthStore } from '@/stores/useAuthStore';

    const apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
    });

    apiClient.interceptors.request.use(config => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    export default apiClient;
    ```
  * **Service Example**
      * API calls will be encapsulated in service files within `apps/web/src/services/`.
    <!-- end list -->
    ```typescript
    // In /services/stationService.ts
    import apiClient from '@/lib/api';
    import { Station } from 'shared-types'; // From our shared package

    export const getStations = (): Promise<Station[]> => {
      return apiClient.get('/stations').then(res => res.data);
    };
    ```

-----

### 11\. Backend Architecture

#### Service Architecture

  * **Function Organization**
      * The entire NestJS application will be packaged and deployed as a single AWS Lambda function, fronted by an API Gateway. We will organize our code into feature modules to keep the codebase clean and maintainable.
    <!-- end list -->
    ```
    /apps/api/src/
    ├── /auth           // Auth-related module (controller, service, guard)
    ├── /companies      // Company management module
    ├── /stations       // Station management module
    │   ├── /dto
    │   │   └── create-station.dto.ts
    │   ├── stations.controller.ts
    │   ├── stations.repository.ts
    │   └── stations.service.ts
    ├── /users          // User management module
    ├── app.module.ts
    └── main.ts         // Lambda handler entry point
    ```
  * **Controller Method Template**
      * Controller methods will use DTOs (Data Transfer Objects) for request validation and Guards for authentication.
    <!-- end list -->
    ```typescript
    import { Controller, Post, Body, UseGuards } from '@nestjs/common';
    import { AuthGuard } from '@/auth/auth.guard';
    import { CreateStationDto } from './dto/create-station.dto';
    import { StationsService } from './stations.service';

    @Controller('stations')
    export class StationsController {
      constructor(private readonly stationsService: StationsService) {}

      @Post()
      @UseGuards(AuthGuard) // Protect this endpoint
      create(@Body() createStationDto: CreateStationDto) {
        // DTO automatically validates incoming data
        return this.stationsService.create(createStationDto);
      }
    }
    ```

-----

#### Database Architecture

  * **Schema Design**
      * The database schema is defined in the **"9. Database Schema"** section of this document. We will use a migration tool like `TypeORM` to manage and apply schema changes programmatically.
  * **Data Access Layer**
      * We will implement the **Repository Pattern** to abstract database logic from our business services. Each feature module will have a repository responsible for all its database interactions.
    <!-- end list -->
    ```typescript
    // In /stations/stations.repository.ts
    import { Injectable } from '@nestjs/common';
    import { DataSource, Repository } from 'typeorm';
    import { Station } from './station.entity'; // TypeORM entity

    @Injectable()
    export class StationRepository extends Repository<Station> {
      constructor(private dataSource: DataSource) {
        super(Station, dataSource.createEntityManager());
      }

      async findById(id: string): Promise<Station | null> {
        return this.findOneBy({ id });
      }
    }
    ```

-----

#### Authentication and Authorization

  * **Auth Flow**
      * The authentication flow is detailed in the sequence diagram in the **"8. Core Workflows"** section.
  * **Middleware/Guards**
      * We will use NestJS Guards to protect our API endpoints. The `AuthGuard` will be responsible for validating the JWT Bearer token from the `Authorization` header on every incoming request to a protected route.
    <!-- end list -->
    ```typescript
    // In /auth/auth.guard.ts
    import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
    import { JwtService } from '@nestjs/jwt'; // Or a similar library

    @Injectable()
    export class AuthGuard implements CanActivate {
      constructor(private jwtService: JwtService) {}

      canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return false;
        }

        const token = authHeader.split(' ')[1];
        try {
          const payload = this.jwtService.verify(token);
          request.user = payload; // Attach user payload to the request
          return true;
        } catch (error) {
          return false;
        }
      }
    }
    ```

-----

### 12\. Unified Project Structure

```
/charging-station-saas/
├── .github/
│   └── workflows/          # CI/CD pipeline configurations
├── apps/                   # Deployable applications
│   ├── api/                # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── companies/
│   │   │   ├── stations/
│   │   │   └── ... (other feature modules)
│   │   └── package.json
│   ├── mobile/             # React Native Mobile App for Drivers
│   │   ├── src/
│   │   └── package.json
│   └── web/                # Next.js Web App for Portals
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── lib/
│       │   ├── services/
│       │   └── stores/
│       └── package.json
├── packages/               # Shared code & configuration
│   ├── shared-types/       # Shared TypeScript interfaces (User, Station, etc.)
│   │   └── src/
│   ├── ui/                 # Shared React components (used by Web & Mobile)
│   │   └── src/
│   ├── eslint-config-custom/ # Shared ESLint configuration
│   └── tsconfig/           # Shared TypeScript configuration
├── .gitignore
├── package.json            # Root package.json with workspaces
├── tsconfig.json           # Root TypeScript configuration
└── turbo.json              # Turborepo configuration
```

-----

### 13\. Development Workflow

#### Local Development Setup

  * **Prerequisites**

      * **Node.js:** `~20.11.0`
      * **pnpm:** `~8.x` (Used for managing monorepo dependencies)
      * **Docker:** For running a local PostgreSQL instance.

  * **Initial Setup**

    ```bash
    # 1. Clone the repository
    git clone <repository_url>
    cd charging-station-saas

    # 2. Install dependencies
    pnpm install

    # 3. Set up environment variables
    cp .env.example .env

    # 4. Start local database
    docker-compose up -d
    ```

  * **Development Commands**

    ```bash
    # Start all applications (web, api, mobile) in development mode
    pnpm dev

    # Start only the web application
    pnpm dev --filter=web

    # Start only the API
    pnpm dev --filter=api

    # Run all tests
    pnpm test
    ```

-----

#### Environment Configuration

  * **Required Environment Variables (`.env` file)**
    ```bash
    # Backend API (.env in apps/api)
    DATABASE_URL="postgresql://user:password@localhost:5432/charging_db"
    JWT_SECRET="your-super-secret-jwt-key"
    STRIPE_SECRET_KEY="sk_test_..."
    AWS_REGION="us-east-1"

    # Frontend Web App (.env.local in apps/web)
    NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
    ```

-----

### 14\. Deployment Architecture

#### Deployment Strategy

  * **Frontend Deployment:**

      * **Platform:** Vercel.
      * **Build Command:** `pnpm build --filter=web`.
      * **Process:** The `apps/web` Next.js application will be automatically deployed to Vercel upon a push to a designated branch (e.g., `main` or `staging`). Vercel will handle the build, deployment, CDN distribution, and hosting of serverless functions.

  * **Backend Deployment:**

      * **Platform:** AWS Lambda.
      * **Build Command:** `pnpm build --filter=api`.
      * **Process:** The `apps/api` NestJS application will be packaged into a deployment bundle and deployed to AWS Lambda via the AWS CDK. The API Gateway will be configured to route incoming requests to this Lambda function.

-----

#### CI/CD Pipeline

  * A CI/CD pipeline will be configured using GitHub Actions to automate the entire process.

<!-- end list -->

```yaml
# In .github/workflows/deploy.yaml
name: Deploy Staging & Production

on:
  push:
    branches:
      - staging
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install

      - name: Lint & Test
        run: pnpm test

      - name: Build Applications
        run: pnpm build

      - name: Deploy Frontend to Vercel
        # Vercel CLI Action will handle deployment based on branch
        run: echo "Deploying to Vercel..."

      - name: Deploy Backend to AWS
        # AWS CDK Action will deploy the backend stack
        run: echo "Deploying to AWS via CDK..."
```

-----

#### Environments

| Environment | Frontend URL | Backend URL | Purpose |
| :--- | :--- | :--- | :--- |
| **Development** | `http://localhost:3000` | `http://localhost:3001` | Local development and testing on developer machines. |
| **Staging** | `[branch-name].vercel.app` | `staging.api.yourdomain.com` | Pre-production environment for E2E testing and QA. |
| **Production** | `app.yourdomain.com` | `api.yourdomain.com` | Live environment for real users. |

-----

### 15\. Security and Performance

#### Security Requirements

  * **Frontend Security:**

      * **Content Security Policy (CSP):** A strict CSP will be implemented to prevent Cross-Site Scripting (XSS) and other injection attacks.
      * **Secure Storage:** JWTs will be stored in secure, HttpOnly cookies to prevent them from being accessed by client-side scripts.

  * **Backend Security:**

      * **Input Validation:** All incoming API requests will be automatically validated using DTOs (Data Transfer Objects) in NestJS to prevent malformed data.
      * **Rate Limiting:** We will implement rate limiting on sensitive endpoints like login and password reset to protect against brute-force attacks.
      * **CORS Policy:** A strict Cross-Origin Resource Sharing (CORS) policy will be configured to only accept requests from our official frontend domains.

  * **Authentication Security:**

      * **Session Management:** User sessions (JWTs) will have a short expiry (e.g., 15 minutes) and be managed with a secure refresh token mechanism.
      * **Password Policy:** We will enforce strong password policies (e.g., minimum length, complexity) via AWS Cognito.

-----

#### Performance Optimization

  * **Frontend Performance:**

      * **Loading Strategy:** We will leverage Next.js features like Server-Side Rendering (SSR) for dynamic pages and Static Site Generation (SSG) for static content to ensure fast initial page loads.
      * **Caching Strategy:** Vercel's Edge Caching will be used for static assets, and Incremental Static Regeneration (ISR) for content that updates frequently but not in real-time.
      * **Bundle Size Target:** Aim for an initial JavaScript bundle size under 200KB for the main landing page.

  * **Backend Performance:**

      * **Response Time Target:** P95 latency (95% of requests) for all core API endpoints should be under 200ms.
      * **Database Optimization:** All database queries will be optimized using the indexes defined in the schema. We will also use connection pooling to manage database connections efficiently.
      * **Caching Strategy:** A caching layer (e.g., Redis) will be implemented for frequently accessed, non-critical data (like station locations) to reduce database load.

-----

### 16\. Testing Strategy

#### Testing Pyramid

Our strategy follows the testing pyramid philosophy, emphasizing a large base of fast, inexpensive unit tests, a smaller layer of integration tests, and a minimal set of broad end-to-end tests.

```
      /      \
     / E2E Tests  \
    /--------------\
   / Integration    \
  /    Tests         \
 /--------------------\
/   Frontend & Backend \
/      Unit Tests      \
------------------------
```

-----

#### Test Organization

  * **Frontend Tests (`apps/web`)**
      * Component and hook tests will co-locate with the source files in `__tests__` directories or as `*.test.tsx` files. We will use Jest and React Testing Library.
  * **Backend Tests (`apps/api`)**
      * Unit and integration tests will follow the `*.spec.ts` convention and live alongside the files they are testing (e.g., `stations.service.spec.ts`). We will use Jest and Supertest.
  * **E2E Tests (`/cypress`)**
      * End-to-end tests will live in a root-level `/cypress` directory and will cover critical user flows like registration, login, and the charging session lifecycle.

-----

#### Test Examples

  * **Frontend Component Test (React Testing Library)**
    ```typescript
    import { render, screen } from '@testing-library/react';
    import { StatCard } from '@/components/ui/StatCard';

    it('should render the StatCard with correct title and value', () => {
      render(<StatCard title="Total Stations" value="125" />);
      expect(screen.getByText('Total Stations')).toBeInTheDocument();
      expect(screen.getByText('125')).toBeInTheDocument();
    });
    ```
  * **Backend API Test (Supertest)**
    ```typescript
    import * as request from 'supertest';
    import { Test } from '@nestjs/testing';
    import { INestApplication } from '@nestjs/common';
    import { AppModule } from '../src/app.module';

    describe('AppController (e2e)', () => {
      let app: INestApplication;

      beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
      });

      it('/GET health', () => {
        return request(app.getHttpServer())
          .get('/health')
          .expect(200)
          .expect('OK');
      });
    });
    ```
  * **E2E Test (Cypress)**
    ```typescript
    describe('Login Page', () => {
      it('should allow a user to log in', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
      });
    });
    ```

-----

### 17\. Coding Standards

#### Critical Fullstack Rules

1.  **Type Sharing:** All shared data structures (e.g., `User`, `Station`) MUST be imported from the `packages/shared-types` package. Never redefine types within an application (`apps/web`, `apps/api`, etc.).
2.  **Environment Variables:** Environment variables MUST be accessed through a dedicated, validated config service. Never use `process.env` directly in business logic or components.
3.  **API Communication:** The frontend clients MUST use the centralized API client (`/lib/api.ts`) for all backend requests. Do not use `fetch` or `axios` directly in components.
4.  **Database Access:** All database queries in the backend MUST go through a designated Repository class. Never use the TypeORM entity manager directly from a Service class.
5.  **Error Handling:** All API controller methods MUST use the standard global error handling filter. Do not use generic `try/catch` blocks to send HTTP error responses.

-----

#### Naming Conventions

| Element | Frontend | Backend | Example |
| :--- | :--- | :--- | :--- |
| Components | PascalCase | - | `UserProfile.tsx` |
| Hooks | camelCase with 'use' | - | `useAuth.ts` |
| API Routes | - | kebab-case | `/api/user-profile` |
| Database Tables | - | snake\_case | `user_profiles` |

-----

### 18\. Error Handling Strategy

#### Error Flow

This diagram shows how a typical validation error flows from the backend to the user.

```mermaid
sequenceDiagram
    participant User
    participant Frontend Client
    participant Backend API

    User->>Frontend Client: Submits a form with invalid data
    Frontend Client->>Backend API: POST /resource {invalid_data}
    Backend API->>Backend API: DTO validation fails
    Note over Backend API: Global Exception Filter catches error
    Backend API-->>Frontend Client: 400 Bad Request with standard error JSON
    Note over Frontend Client: API client interceptor catches error
    Frontend Client->>User: Display user-friendly error message (e.g., "Email is invalid")
```

-----

#### Error Response Format

All errors returned by the API will follow this standardized JSON structure.

```typescript
interface ApiError {
  error: {
    code: string;       // e.g., 'VALIDATION_ERROR'
    message: string;    // User-friendly summary
    details?: Record<string, any>; // Field-specific errors
    timestamp: string;
    requestId: string;
  };
}
```

-----

#### Frontend Error Handling

The central API client will have an interceptor to handle these standardized errors.

```typescript
// In /lib/api.ts (continued)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data?.error;
    if (apiError) {
      // Show a toast notification with apiError.message
      console.error(apiError); 
    } else {
      // Handle network errors or non-standard errors
      console.error('An unexpected error occurred:', error.message);
    }
    return Promise.reject(error);
  }
);
```

-----

#### Backend Error Handling

A global `ExceptionFilter` in NestJS will catch all unhandled exceptions and format them into our standard error response.

```typescript
// In /filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Determine status code and message
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception instanceof HttpException ? exception.message : 'Internal Server Error';

    response.status(status).json({
      error: {
        code: exception.constructor.name.toUpperCase(),
        message: message,
        timestamp: new Date().toISOString(),
        requestId: request.headers['x-request-id'], // Assuming a request ID middleware
      },
    });
  }
}
```

-----

### 19\. Monitoring and Observability

#### Monitoring Stack

  * **Frontend Monitoring:** **Vercel Analytics**. This is built into our deployment platform and will provide Core Web Vitals and real-time traffic insights out of the box.
  * **Backend Monitoring:** **AWS CloudWatch**. This is the native solution for our AWS backend, automatically collecting logs, metrics (invocations, errors, duration), and enabling alarms for our Lambda functions and RDS database.
  * **Error Tracking:** **Sentry**. We will integrate the Sentry SDK into both the frontend and backend to provide aggregated error reporting, stack traces, and alerts for uncaught exceptions.
  * **Performance Monitoring:** **AWS X-Ray**. We will enable X-Ray for our backend to trace requests as they travel from the API Gateway through our Lambda services to the database, helping us pinpoint performance bottlenecks.

-----

#### Key Metrics

  * **Frontend Metrics:**

      * Core Web Vitals (LCP, INP, CLS)
      * JavaScript error rate
      * API latency from the client's perspective
      * User interaction funnels (e.g., session start to session complete)

  * **Backend Metrics:**

      * API Gateway request rate and error rate (4xx, 5xx)
      * Lambda function invocation count, error rate, and duration
      * Database connection count and query latency (from RDS Performance Insights)

-----

### 20\. Checklist Results Report

  * **Overall Architecture Readiness:** 高
  * **Critical Risks Identified:** 低。架构与 PRD 紧密对齐，技术选型合理，并且为 MVP 定义了清晰的模式。
  * **Project Type:** 全栈 Greenfield 项目（包含 UI）。所有相关部分均已评估。
  * **Final Decision:** **架构已准备好，可以开始开发**。本文档为开发团队提供了清晰、全面且经过验证的技术蓝图。

<!-- end list -->

```
```