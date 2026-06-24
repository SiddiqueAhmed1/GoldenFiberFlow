# Golden Fiber Flow 📦

**Golden Fiber Flow** is a production-ready, specialized MERN stack logistics application engineered for high-efficiency consignment management. The platform delivers role-based dashboards empowering administrators with comprehensive user management and global logistics oversight, while providing standard users with secure tools to track, manage, and export their dedicated consignment records.

🔗 **Live Demo:** [https://golden-fiber-flow.vercel.app](https://golden-fiber-flow.vercel.app)

---

## 🖥️ User Interface & Experience

### 🌗 Dashboard Visual Themes
The platform features a fully adaptive interface with custom-tailored dark and light layout environments to maximize dashboard data readability.

<table>
  <tr>
    <td align="center"><b>Admin Dashboard (Dark Mode)</b></td>
    <td align="center"><b>Admin Dashboard (Light Mode)</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/0f9a2a4d-2a2a-4e4b-90af-802ce7bd708a" width="100%" alt="Admin Dashboard Dark Mode" /></td>
    <td><img src="https://github.com/user-attachments/assets/adb86472-556a-4911-8650-c5f05ee03f69" width="100%" alt="Admin Dashboard Light Mode" /></td>
  </tr>
</table>

### 📦 Logistics & Inventory Interfaces
Data-dense tables, conditional form states, and seamless overlays ensure clean workflow management for administrators and vendors alike.

<table>
  <tr>
    <td align="center"><b>Consignment Management List</b></td>
    <td align="center"><b>Supplier Directory (Dynamic Empty State)</b></td>
    <td align="center"><b>Contextual Add Product Modal</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="https://github.com/user-attachments/assets/0f9a2a4d-2a2a-4e4b-90af-802ce7bd708a" width="100%" alt="Consignment List View" /></td>
    <td valign="top"><img src="https://github.com/user-attachments/assets/adb86472-556a-4911-8650-c5f05ee03f69" width="100%" alt="Suppliers Empty State" /></td>
    <td valign="top"><img src="https://github.com/user-attachments/assets/0f9a2a4d-2a2a-4e4b-90af-802ce7bd708a" width="100%" alt="Add Product Modal Window" /></td>
  </tr>
</table>

*(Note: Please ensure the five image asset URLs listed above correspond correctly to your uploaded repository images once updated.)*

---

## 🚀 Key Architectural Features

### 🔐 Multi-Tier Role-Based Access Control (RBAC)
*   **Administrative Privilege Level:** Full operational command over global user profile creation, user authorization management, and top-level monitoring of cross-border system consignments.
*   **Standard User Privilege Level:** Isolated sandboxed workspace environments ensuring users securely create, query, modify, and manage only their own authentic consignment footprints.

### 📊 Advanced Data Visualization & Analytics
*   **Time-Series Insights:** Integrated multi-month graphical trends tracking operational metrics and logistics throughput.
*   **Status Distribution:** Real-time visual categorization using color-coded metrics to monitor pending, transit, delivered, and cancelled statuses instantly.

### 🖨️ Enterprise Document Export Framework
*   **Client-Side PDF Generation:** High-fidelity algorithmic conversion of localized DOM components into shareable documents leveraging `html-to-png` and `js-pdf`.
*   **Hardware-Direct Document Printing:** Zero-latency physical hardcopy print capabilities natively driven via deep `react-to-print` rendering layers.

---

## 🛠️ Technology Stack

| Architecture Layer | Core Technologies & Libraries Used |
| :--- | :--- |
| **Frontend Core** | React.js, Tailwind CSS Framework, HTML5, ES6+ JavaScript |
| **Backend Core** | Node.js Runtime environment, Express.js REST Framework |
| **Database Layer** | MongoDB NoSQL Document Store, Mongoose ODM |
| **Document Processing** | html-to-png, js-pdf, react-to-print |

---

## 📡 RESTful API Specifications

| Route Prefix | Access Tier | Description |
| :--- | :--- | :--- |
| `/auth` | Public / Session | Identity verification, cryptographic token handshakes, session state |
| `/user` | Restricted (Admin) | Core administrative management over user lifecycles and registration |
| `/consignment` | Protected (RBAC) | Scalable backend database CRUD matrix handling logistics manifests |

---

## ⚙️ Installation & Developer Setup

### 1. Repository Initial Clone
```bash
git clone https://github.com/SiddiqueAhmed1/GoldenFiberFlow.git
cd GoldenFiberFlow
```

### 2. Microservice Backend Infrastructure
```bash
cd server
npm install

# Initialize local application runtime configurations (.env)
# MONGODB_URL=your_mongodb_uri
# SECRET_KEY=your_secure_json_web_token_secret
# PORT=5050

npm start
```

### 3. Client Frontend Architecture
```bash
cd ../frontend
npm install

# Configure upstream endpoint integrations (.env)
# VITE_API_URL=http://localhost:5050

npm run dev
```

---

## 📄 License
Distributed under the permissive open-source MIT License.
