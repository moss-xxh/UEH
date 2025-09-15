# Charging Station SaaS System Product Requirements Document (PRD)

### Goals and Background Context
**Goals**
* Deliver a multi-tenant SaaS platform for electric vehicle charging network operators.
* Provide a white-labeled management portal for charging companies (tenants).
* Offer a white-labeled mobile app for end-users (drivers) to manage charging.
* Achieve 99.9% platform uptime.
* Onboard 10 charging companies within the first year of operation.

**Background Context**
Currently, charging network companies often rely on fragmented, expensive, and non-scalable custom software to manage their charging stations. This operational inefficiency hinders their ability to grow and provides a disjointed experience for EV drivers. This PRD outlines a unified, three-tiered SaaS platform designed to solve this problem by providing a centralized management solution for operators and a seamless charging experience for their customers.

**Change Log**
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-08-19 | 1.0 | Initial draft | John, PM |

---
### Requirements

#### Functional Requirements
* **FR1:** The system must support a multi-tenant architecture to securely isolate data for each charging company.
* **FR2:** A platform administrator must be able to create, view, update, and deactivate tenant (charging company) accounts.
* **FR3:** A company user (tenant) must be able to log in to their own sandboxed portal.
* **FR4:** A company user must be able to add, view, update, and delete their own charging stations and individual charging piles (桩).
* **FR5:** A company user must be able to view a list of charging sessions and basic data for their stations.
* **FR6:** An end-user must be able to register and log in to the mobile application.
* **FR7:** An end-user must be able to find nearby charging stations on a map within the app.
* **FR8:** An end-user must be able to initiate and terminate a charging session (e.g., via QR code scan).
* **FR9:** An end-user must be able to view their personal charging history and basic payment receipts.

#### Non-Functional Requirements
* **NFR1:** The web-based portals (Admin and SaaS) must be built using Chakra UI and be responsive.
* **NFR2:** The system must maintain 99.9% uptime.
* **NFR3:** The mobile application must be available for both iOS and Android platforms.
* **NFR4:** The platform architecture must be scalable to support growth in companies, stations, and users.
* **NFR5:** All user payment information must be handled by a secure, compliant third-party payment gateway.

---
### User Interface Design Goals

#### Overall UX Vision
The user experience should be clean, intuitive, and efficient. For charging company operators, the portal's design will prioritize clarity, providing quick access to management tasks and essential data. For EV drivers, the mobile app will focus on simplicity and speed, making the process of finding a station and starting a charge as seamless as possible.

#### Key Interaction Paradigms
* **SaaS & Admin Portals:** A dashboard-centric design will serve as the homepage, offering at-a-glance insights. Management of stations, chargers, and users will be handled through clear, data-rich tables with robust filtering and search capabilities.
* **Mobile App:** The app will feature a map-first interface as the primary screen, allowing users to instantly locate nearby charging stations. The charging process will be initiated via a prominent, easily accessible QR code scanning function.

#### Core Screens and Views
* **Admin Portal:**
    * Tenant (Company) List
    * Tenant Detail & Management View
* **SaaS Company Portal:**
    * Main Dashboard (Key metrics)
    * Stations Management (List and map views)
    * Charger Detail Page
    * Charging Sessions History
* **Mobile App:**
    * Map View (Home Screen)
    * Station Detail Page (Available chargers, pricing)
    * QR Code Scanner
    * Active Charging Session Screen
    * User Profile & Charging History

#### Accessibility
* The product will adhere to **WCAG AA** standards to ensure it is usable by people with a wide range of disabilities.

#### Branding
* As a white-labeled product, the design will be brand-agnostic and minimalist, using a neutral color palette. The system will be designed to allow tenants to easily customize it with their own logo and primary brand color.

#### Target Device and Platforms
* **Web Responsive** for the Admin and SaaS portals, ensuring usability on both desktop and tablet devices.
* **iOS & Android** for the end-user mobile application.

---
### Technical Assumptions

#### Repository Structure: Monorepo
* We will use a single monorepo to house the code for the web portals, the mobile app, and the backend services.
* **Rationale:** This approach simplifies code sharing (e.g., for data types between frontend and backend), streamlines dependency management, and makes cross-platform changes easier to coordinate.

#### Service Architecture: Serverless
* The backend will be built using a serverless architecture, leveraging cloud functions (e.g., AWS Lambda).
* **Rationale:** A serverless approach is cost-effective (pay-per-use), scales automatically to handle fluctuating demand, and reduces infrastructure management overhead, which is ideal for an MVP.

#### Testing Requirements: Full Testing Pyramid
* We will implement a comprehensive testing strategy including unit tests, integration tests, and end-to-end (E2E) tests.
* **Rationale:** This ensures code quality, reduces regressions, and provides confidence in the application's stability, which is critical for a system handling payments and real-world hardware.

#### Additional Technical Assumptions and Requests
* **Frontend (Web Portals):** React with the Next.js framework. (Works seamlessly with Chakra UI and serverless deployments).
* **Mobile App:** React Native. (Allows for code sharing with the React-based web portals).
* **Backend:** Node.js with TypeScript, using the NestJS framework. (Provides a structured, scalable architecture for building APIs).
* **Database:** PostgreSQL. (A powerful and reliable open-source relational database that handles multi-tenancy well).
* **Deployment:** Vercel for the Next.js frontend and AWS for backend services (Lambda, API Gateway, RDS for PostgreSQL).
* **Charger Integration:** The platform will initially support the OCPP 1.6J protocol for communication with charging hardware.

---
### Epic List

* **Epic 1: Foundation & Core SaaS Setup**
    * **Goal:** Establish the core technical infrastructure and deliver the foundational capability for platform administrators to manage tenant (charging company) accounts.
* **Epic 2: Company Portal & Station Management**
    * **Goal:** Enable charging company users to log into their portal to manage their charging stations and view basic operational data.
* **Epic 3: End-User Mobile App & Core Charging Loop**
    * **Goal:** Launch the end-user mobile app, allowing drivers to find stations, register, and complete a full charging session.
* **Epic 4: Payments & History**
    * **Goal:** Integrate a payment system and provide both company operators and drivers with access to their charging and transaction histories.

---
### Epic 1: Foundation & Core SaaS Setup
**Epic Goal:** Establish the core technical infrastructure and deliver the foundational capability for platform administrators to manage tenant (charging company) accounts.

#### Story 1.1: Project Initialization
**As a** developer,
**I want** to set up the monorepo with separate packages for the web app, backend API, and shared code,
**so that** we have a clean, organized foundation for building the full-stack application.

**Acceptance Criteria:**
1. A monorepo is initialized using npm workspaces.
2. Three initial packages are created: `apps/web`, `apps/api`, and `packages/shared-types`.
3. Basic tooling (ESLint, Prettier, TypeScript) is configured at the root level and inherited by the packages.
4. A README.md file is created with instructions for setting up the local development environment.
5. The initial project structure is committed to a Git repository.

#### Story 1.2: Foundational CI/CD Pipeline
**As a** DevOps engineer,
**I want** to create a basic CI/CD pipeline that automatically deploys the web and API applications,
**so that** we can ensure continuous integration and have a working deployment from day one.

**Acceptance Criteria:**
1. A CI/CD pipeline is configured using GitHub Actions (or similar).
2. The pipeline triggers on every push to the `main` branch.
3. The pipeline successfully builds both the `web` and `api` applications.
4. A "hello world" version of the Next.js web app is successfully deployed to Vercel.
5. A "hello world" version of the NestJS API is successfully deployed to AWS Lambda.

#### Story 1.3: Platform Admin Authentication
**As a** platform administrator,
**I want** to log in to the admin portal securely,
**so that** I can access the tenant management features.

**Acceptance Criteria:**
1. A login page exists for the admin portal.
2. The administrator can log in using a pre-defined username and password.
3. Upon successful login, the administrator is redirected to the main dashboard.
4. An unsuccessful login attempt displays a clear error message.
5. The user's session is securely managed (e.g., using JWTs).

#### Story 1.4: Tenant Account Management
**As a** platform administrator,
**I want** a dashboard to create, view, update, and deactivate tenant (charging company) accounts,
**so that** I can manage the customers using the SaaS platform.

**Acceptance Criteria:**
1. When logged in, an administrator can see a page listing all tenant companies.
2. The list displays key information such as company name, status (active/inactive), and creation date.
3. The administrator can use a form to create a new tenant account.
4. The administrator can edit an existing tenant's information.
5. The administrator can change a tenant's status between "active" and "inactive".

---
### Epic 2: Company Portal & Station Management
**Epic Goal:** Enable charging company users to log into their portal to manage their charging stations and view basic operational data.

#### Story 2.1: Company User Authentication
**As a** charging company user,
**I want** to log in to my company's portal,
**so that** I can manage my charging network.

**Acceptance Criteria:**
1. A unique, tenant-aware login page exists for the SaaS portal.
2. A company user (created by the platform admin) can log in with their credentials.
3. Upon successful login, the user is redirected to their company's dashboard.
4. An unsuccessful login attempt displays a clear error message.
5. The portal's UI is styled with the company's specific branding (logo and primary color).

#### Story 2.2: Company Dashboard
**As a** charging company user,
**I want** to see a dashboard with a high-level overview of my network after I log in,
**so that** I can quickly understand its current status.

**Acceptance Criteria:**
1. The dashboard is the default page after a company user logs in.
2. The dashboard displays simple, key metrics: Total number of stations, total number of chargers, and number of active charging sessions.
3. The dashboard contains clear navigation links to other sections of the portal (e.g., "Stations").
4. All data displayed is strictly limited to the company the user belongs to.

#### Story 2.3: Charging Station Management
**As a** charging company user,
**I want** to add, view, and update my charging stations,
**so that** I can accurately represent my physical network in the system.

**Acceptance Criteria:**
1. A "Stations" page exists that lists all stations belonging to the user's company.
2. The list displays the station's name, address, and the number of chargers it contains.
3. A form allows a user to add a new station with a name and physical address.
4. A user can select a station from the list to view its details.
5. A user can edit the details (name, address) of an existing station.

#### Story 2.4: Charging Pile (桩) Management
**As a** charging company user,
**I want** to add, view, and update the individual charging piles (桩) at a specific station,
**so that** I can manage my hardware assets and their status.

**Acceptance Criteria:**
1. From a station's detail page, a user can see a list of all chargers at that station.
2. The list shows each charger's ID, model, and current status (e.g., Available, Charging, Faulted).
3. A form allows a user to add a new charger to the station, specifying its model and power rating.
4. A user can edit the information of an existing charger.
5. A user can manually change the status of a charger (for MVP purposes, before live data is connected).

---
### Epic 3: End-User Mobile App & Core Charging Loop
**Epic Goal:** Launch the end-user mobile app, allowing drivers to find stations, register, and complete a full charging session.

#### Story 3.1: User Registration & Login
**As an** EV driver,
**I want** to register for an account and log in to the mobile app,
**so that** I can find chargers and manage my charging sessions.

**Acceptance Criteria:**
1. The mobile app provides a clear form for new user registration (e.g., name, email, password).
2. The mobile app provides a login screen for existing users.
3. A new user can successfully register and is automatically logged in.
4. A registered user can successfully log in.
5. The user's login session is securely stored and managed on the device.

#### Story 3.2: Find Stations on Map
**As an** EV driver,
**I want** to see nearby charging stations on a map,
**so that** I can easily find a place to charge my vehicle.

**Acceptance Criteria:**
1. The app's home screen displays a map centered on the user's current geographical location.
2. Pins on the map represent all public charging stations in the viewable area, regardless of the operating company.
3. The user can pan and zoom the map to explore different areas.
4. Tapping on a station pin displays a small callout with the station's name and address.

#### Story 3.3: View Station Details
**As an** EV driver,
**I want** to view the details of a specific charging station,
**so that** I can check the availability and types of chargers before I go there.

**Acceptance Criteria:**
1. From the map, a user can navigate to a detailed screen for a selected station.
2. The station detail screen displays its full address, operating hours, and a list of all its individual chargers.
3. Each charger in the list shows its real-time status (e.g., Available, In Use, Out of Order), power rating (e.g., 50kW), and price.

#### Story 3.4: Initiate & Stop Charging via QR Code
**As an** EV driver,
**I want** to start and stop a charging session by scanning a QR code on the charger,
**so that** I can easily and quickly charge my vehicle.

**Acceptance Criteria:**
1. A "Scan to Charge" button is prominently displayed within the app's main interface.
2. Tapping the button opens the phone's camera to scan a QR code.
3. Upon scanning a valid QR code on an "Available" charger, a confirmation screen is shown.
4. After confirmation, the charging session begins, and the app displays an "Active Session" screen.
5. The "Active Session" screen shows real-time data, including time elapsed and energy delivered (kWh).
6. The user can stop the charging session from the "Active Session" screen.

---
### Epic 4: Payments & History
**Epic Goal:** Integrate a payment system and provide both company operators and drivers with access to their charging and transaction histories.

#### Story 4.1: End-User Payment Method Management
**As an** EV driver,
**I want** to add and manage my credit/debit card information in the app,
**so that** I can seamlessly pay for my charging sessions.

**Acceptance Criteria:**
1. There is a "Payment" or "Wallet" section in the user's profile.
2. The user can add a new credit/debit card using a secure form.
3. Card information is securely sent to and tokenized by a third-party payment gateway (e.g., Stripe); no raw card data is stored on our servers.
4. The user can see a list of their saved payment methods (e.g., "Visa ending in 4242").
5. The user can set one payment method as their default.
6. The user can delete a saved payment method.

#### Story 4.2: Post-Charging Payment Processing
**As a** charging company,
**I want** the system to automatically charge the user's default payment method after a session is complete,
**so that** I can collect revenue for the energy provided.

**Acceptance Criteria:**
1. Immediately after a charging session ends, the system calculates the final cost based on the energy consumed and the charger's price.
2. The system automatically triggers a charge against the user's default payment method via the payment gateway.
3. A record of the successful transaction is created and linked to the charging session.
4. If the payment fails, the charging session is marked as "Payment Due," and the user is notified in the app to update their payment method.

#### Story 4.3: End-User Charging History & Receipts
**As an** EV driver,
**I want** to view my charging history and access detailed receipts,
**so that** I can track my spending and energy usage.

**Acceptance Criteria:**
1. A "History" section in the mobile app lists all past charging sessions in reverse chronological order.
2. Each item in the list displays the date, station location, and total cost.
3. Tapping a session opens a detailed receipt view.
4. The receipt includes the start/end time, duration, total energy delivered (kWh), a cost breakdown, and the payment method used.

#### Story 4.4: Company Portal Charging History
**As a** charging company user,
**I want** to view a detailed history of all charging sessions across my network,
**so that** I can monitor usage, revenue, and station performance.

**Acceptance Criteria:**
1. A "Charging Sessions" or "History" page in the company portal lists all sessions that occurred at that company's stations.
2. The list can be filtered by date range and by station.
3. Each session entry shows the user (anonymized ID), station/charger, duration, energy delivered, and revenue collected.
4. The company user can export the filtered history data as a CSV file.

---
### Checklist Results Report

**Overall Readiness:** High
**Key Risks:** Low. Scope is clear and technical assumptions are well-defined.
**Final Decision:** **READY FOR ARCHITECT**. The PRD and epics are comprehensive, well-structured, and ready for architectural design.

| Category | Status | Key Issues |
| :--- | :--- | :--- |
| 1. Problem Definition & Context | ✅ Pass | None |
| 2. MVP Scope Definition | ✅ Pass | None |
| 3. User Experience Requirements | ✅ Pass | High-level goals are defined. Detailed user flows will be fleshed out in the UX phase. |
| 4. Functional Requirements | ✅ Pass | None |
| 5. Non-Functional Requirements | ✅ Pass | None |
| 6. Epic & Story Structure | ✅ Pass | Logical sequence is clear and value-driven. |
| 7. Technical Guidance | ✅ Pass | Technical assumptions provide clear constraints for the architect. |
| 8. Cross-Functional Requirements | ✅ Pass | Sufficient at the PRD level; details will emerge in the architecture phase. |
| 9. Clarity & Communication | ✅ Pass | The document is well-structured. |

---
### Next Steps

#### UX Expert Prompt
> "Hi UX Expert, this PRD is complete. Please use it as the basis for creating a detailed UI/UX Specification for the 'Charging Station SaaS System' project. Focus on the user flows for the SaaS portal (for charging companies) and the end-user mobile app, and establish the core design principles and component requirements."

#### Architect Prompt
> "Hi Architect, this PRD is complete. Please use it as the basis for creating a comprehensive Fullstack Architecture document for the 'Charging Station SaaS System' project. When designing, strictly adhere to the core decisions outlined in the 'Technical Assumptions' section, especially regarding the Monorepo structure, Serverless backend, and multi-tenant requirements."