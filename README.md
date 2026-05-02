# Golden Fiber Flow 📦

**Golden Fiber Flow** is a specialized MERN stack application designed for efficient consignment management. This platform enables admins to manage users and oversee global logistics, while providing users with tools to track and manage their specific consignments with PDF export capabilities.

<table>
  <tr>
    <td><b>Admin Dashboard</b></td>
    <td><b>Consignment List</b></td>
  </tr>
  <tr>
    <td><img width="1469" height="684" alt="admin j" src="https://github.com/user-attachments/assets/0f9a2a4d-2a2a-4e4b-90af-802ce7bd708a" /></td>
    <td><img width="1469" height="684" alt="dashboard 2" src="https://github.com/user-attachments/assets/adb86472-556a-4911-8650-c5f05ee03f69" /></td>
  </tr>
</table>



## Key Features

- **Role-Based Access Control (RBAC):**
  - **Admin:** Can create/manage users and monitor all system consignments.
  - **User:** Can create, view, and manage their own consignment records.
- **Consignment Management:** Full CRUD (Create, Read, Update, Delete) functionality for consignment tracking.
- **Document Export & Print:**
  - Generate professional PDF documents using `html-to-png` and `js-pdf`.
  - Direct print functionality integrated with `react-to-print`.
- **Responsive Interface:** A clean and modern dashboard built with **Tailwind CSS**.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Libraries:** html-to-png, js-pdf, react-to-print

## API Endpoints (REST)


| Base Route | Description |
| :--- | :--- |
| `/auth` | Authentication, login, and session management |
| `/user` | Admin-only routes for user creation and management |
| `/consignment` | Core CRUD operations for consignment data |

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SiddiqueAhmed1/GoldenFiberFlow.git
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create a .env file and add:
   # MONGODB_URL=your_mongodb_uri
   # SECRET_KEY=your_secret_key
   # PORT=5050
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   # Create a .env file and add:
   # VITE_API_URL=http://localhost:5050
   npm install
   npm run dev
   ```

## 📄 License
This project is licensed under the MIT License.
