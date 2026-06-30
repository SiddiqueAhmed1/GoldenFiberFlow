
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
    <td><img width="1680" height="923" alt="dashboard" src="https://github.com/user-attachments/assets/c6fe129d-d60d-4e17-ad67-f083bdfbaa03" />
</td>
    <td><img width="1680" height="923" alt="Dashboard Light mode" src="https://github.com/user-attachments/assets/1a26ad64-4a38-4bd4-8403-db1cbd7a70d3" /></td>
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
    <td valign="top"><img width="1680" height="923" alt="consignment" src="https://github.com/user-attachments/assets/3a08684a-ee0e-49e2-8628-e1ce7d0448e3" />
</td>
    <td valign="top"><img width="1680" height="923" alt="suppliers" src="https://github.com/user-attachments/assets/920f69bb-4b07-4af5-85df-1e6b25eac73c" />
</td>
    <td valign="top"><img width="1680" height="923" alt="product modal" src="https://github.com/user-attachments/assets/fe3c2b33-5598-40df-890f-47f7f8581307" />
</td>
  </tr>
</table>

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

```
GoldenFiberFlow
├─ frontend
│  ├─ Claude.md
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  ├─ gftcl.png
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ Api
│  │  │  └─ api.js
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ gftcl.png
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ Components
│  │  │  ├─ CustomerModal.jsx
│  │  │  ├─ DriverModal.jsx
│  │  │  ├─ Header.jsx
│  │  │  ├─ InvoiceModal.jsx
│  │  │  ├─ LoadingSpinner.jsx
│  │  │  ├─ ProductModal.jsx
│  │  │  ├─ PurchaseOrderModal.jsx
│  │  │  ├─ SalesOrderModal.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  ├─ SupplierModal.jsx
│  │  │  ├─ UserModal.jsx
│  │  │  ├─ VehicleModal.jsx
│  │  │  └─ WarehouseModal.jsx
│  │  ├─ Context
│  │  │  ├─ AuthContext.jsx
│  │  │  └─ ThemeContext.jsx
│  │  ├─ Hooks
│  │  │  └─ useAuth.js
│  │  ├─ index.css
│  │  ├─ Layout
│  │  │  ├─ DashboardLayout.jsx
│  │  │  └─ MainLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ Pages
│  │  │  ├─ Admin.jsx
│  │  │  ├─ Customers.jsx
│  │  │  ├─ DashboardHome.jsx
│  │  │  ├─ Drivers.jsx
│  │  │  ├─ Inventory.jsx
│  │  │  ├─ Invoices.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ Products.jsx
│  │  │  ├─ PurchaseOrders.jsx
│  │  │  ├─ Register.jsx
│  │  │  ├─ SalesOrders.jsx
│  │  │  ├─ Suppliers.jsx
│  │  │  ├─ Vehicles.jsx
│  │  │  └─ Warehouses.jsx
│  │  ├─ Routing
│  │  │  ├─ Index.jsx
│  │  │  ├─ IndexRedirect.jsx
│  │  │  ├─ ProtectedRoutes.jsx
│  │  │  └─ PublicRoutes.jsx
│  │  ├─ Services
│  │  │  ├─ authService.js
│  │  │  ├─ customerService.js
│  │  │  ├─ driverService.js
│  │  │  ├─ inventoryService.js
│  │  │  ├─ invoiceService.js
│  │  │  ├─ productService.js
│  │  │  ├─ purchaseOrderService.js
│  │  │  ├─ salesOrderService.js
│  │  │  ├─ supplierService.js
│  │  │  ├─ userService.js
│  │  │  ├─ vehicleService.js
│  │  │  └─ warehouseService.js
│  │  └─ utils
│  ├─ vercel.json
│  └─ vite.config.js
├─ README.md
└─ server
   ├─ Config
   │  └─ mongoDb.js
   ├─ Controller
   │  ├─ authController.js
   │  ├─ customerController.js
   │  ├─ driverController.js
   │  ├─ inventoryController.js
   │  ├─ invoiceController.js
   │  ├─ productController.js
   │  ├─ purchaseOrderController.js
   │  ├─ salesOrderController.js
   │  ├─ supplierController.js
   │  ├─ UserController.js
   │  ├─ vehicleController.js
   │  └─ warehouseController.js
   ├─ Models
   │  ├─ CustomerModel.js
   │  ├─ DriverModel.js
   │  ├─ InventoryModel.js
   │  ├─ InvoiceModel.js
   │  ├─ ProductModel.js
   │  ├─ PurchaseOrderModel.js
   │  ├─ SalesOrderModel.js
   │  ├─ SupplierModel.js
   │  ├─ UserModel.js
   │  ├─ VehicleModel.js
   │  └─ WarehouseModel.js
   ├─ package-lock.json
   ├─ package.json
   ├─ Routing
   │  ├─ authRouter.js
   │  ├─ customerRouter.js
   │  ├─ driverRouter.js
   │  ├─ inventoryRouter.js
   │  ├─ invoiceRouter.js
   │  ├─ productRouter.js
   │  ├─ purchaseOrderRouter.js
   │  ├─ salesOrderRouter.js
   │  ├─ supplierRouter.js
   │  ├─ userRouter.js
   │  ├─ vehicleRouter.js
   │  └─ warehouseRouter.js
   ├─ server.js
   └─ Utils
      ├─ adminMiddleware.js
      ├─ authMiddleware.js
      ├─ generateAccessToken.js
      └─ generateRefreshToken.js

```
```
GoldenFiberFlow
├─ frontend
│  ├─ Claude.md
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  ├─ gftcl.png
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ Api
│  │  │  └─ api.js
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ gftcl.png
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ Components
│  │  │  ├─ CustomerModal.jsx
│  │  │  ├─ DriverModal.jsx
│  │  │  ├─ Header.jsx
│  │  │  ├─ InvoiceModal.jsx
│  │  │  ├─ LoadingSpinner.jsx
│  │  │  ├─ ProductModal.jsx
│  │  │  ├─ PurchaseOrderModal.jsx
│  │  │  ├─ SalesOrderModal.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  ├─ SupplierModal.jsx
│  │  │  ├─ UserModal.jsx
│  │  │  ├─ VehicleModal.jsx
│  │  │  └─ WarehouseModal.jsx
│  │  ├─ Context
│  │  │  ├─ AuthContext.jsx
│  │  │  └─ ThemeContext.jsx
│  │  ├─ Hooks
│  │  │  └─ useAuth.js
│  │  ├─ index.css
│  │  ├─ Layout
│  │  │  ├─ DashboardLayout.jsx
│  │  │  └─ MainLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ Pages
│  │  │  ├─ Admin.jsx
│  │  │  ├─ Customers.jsx
│  │  │  ├─ DashboardHome.jsx
│  │  │  ├─ Drivers.jsx
│  │  │  ├─ Inventory.jsx
│  │  │  ├─ Invoices.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ Products.jsx
│  │  │  ├─ PurchaseOrders.jsx
│  │  │  ├─ Register.jsx
│  │  │  ├─ SalesOrders.jsx
│  │  │  ├─ Suppliers.jsx
│  │  │  ├─ Vehicles.jsx
│  │  │  └─ Warehouses.jsx
│  │  ├─ Routing
│  │  │  ├─ Index.jsx
│  │  │  ├─ IndexRedirect.jsx
│  │  │  ├─ ProtectedRoutes.jsx
│  │  │  └─ PublicRoutes.jsx
│  │  ├─ Services
│  │  │  ├─ authService.js
│  │  │  ├─ customerService.js
│  │  │  ├─ driverService.js
│  │  │  ├─ inventoryService.js
│  │  │  ├─ invoiceService.js
│  │  │  ├─ productService.js
│  │  │  ├─ purchaseOrderService.js
│  │  │  ├─ salesOrderService.js
│  │  │  ├─ supplierService.js
│  │  │  ├─ userService.js
│  │  │  ├─ vehicleService.js
│  │  │  └─ warehouseService.js
│  │  └─ utils
│  ├─ vercel.json
│  └─ vite.config.js
├─ README.md
└─ server
   ├─ Config
   │  └─ mongoDb.js
   ├─ Controller
   │  ├─ authController.js
   │  ├─ customerController.js
   │  ├─ driverController.js
   │  ├─ inventoryController.js
   │  ├─ invoiceController.js
   │  ├─ productController.js
   │  ├─ purchaseOrderController.js
   │  ├─ salesOrderController.js
   │  ├─ supplierController.js
   │  ├─ UserController.js
   │  ├─ vehicleController.js
   │  └─ warehouseController.js
   ├─ Models
   │  ├─ CustomerModel.js
   │  ├─ DriverModel.js
   │  ├─ InventoryModel.js
   │  ├─ InvoiceModel.js
   │  ├─ ProductModel.js
   │  ├─ PurchaseOrderModel.js
   │  ├─ SalesOrderModel.js
   │  ├─ SupplierModel.js
   │  ├─ UserModel.js
   │  ├─ VehicleModel.js
   │  └─ WarehouseModel.js
   ├─ package-lock.json
   ├─ package.json
   ├─ Routing
   │  ├─ authRouter.js
   │  ├─ customerRouter.js
   │  ├─ driverRouter.js
   │  ├─ inventoryRouter.js
   │  ├─ invoiceRouter.js
   │  ├─ productRouter.js
   │  ├─ purchaseOrderRouter.js
   │  ├─ salesOrderRouter.js
   │  ├─ supplierRouter.js
   │  ├─ userRouter.js
   │  ├─ vehicleRouter.js
   │  └─ warehouseRouter.js
   ├─ server.js
   └─ Utils
      ├─ adminMiddleware.js
      ├─ authMiddleware.js
      ├─ generateAccessToken.js
      └─ generateRefreshToken.js

```
```
GoldenFiberFlow
├─ frontend
│  ├─ Claude.md
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  ├─ gftcl.png
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ Api
│  │  │  └─ api.js
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ gftcl.png
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ Components
│  │  │  ├─ CustomerModal.jsx
│  │  │  ├─ DriverModal.jsx
│  │  │  ├─ Header.jsx
│  │  │  ├─ InvoiceModal.jsx
│  │  │  ├─ LoadingSpinner.jsx
│  │  │  ├─ ProductModal.jsx
│  │  │  ├─ PurchaseOrderModal.jsx
│  │  │  ├─ SalesOrderModal.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  ├─ SupplierModal.jsx
│  │  │  ├─ UserModal.jsx
│  │  │  ├─ VehicleModal.jsx
│  │  │  └─ WarehouseModal.jsx
│  │  ├─ Context
│  │  │  ├─ AuthContext.jsx
│  │  │  └─ ThemeContext.jsx
│  │  ├─ Hooks
│  │  │  └─ useAuth.js
│  │  ├─ index.css
│  │  ├─ Layout
│  │  │  ├─ DashboardLayout.jsx
│  │  │  └─ MainLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ Pages
│  │  │  ├─ Admin.jsx
│  │  │  ├─ Customers.jsx
│  │  │  ├─ DashboardHome.jsx
│  │  │  ├─ Drivers.jsx
│  │  │  ├─ Inventory.jsx
│  │  │  ├─ Invoices.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ Products.jsx
│  │  │  ├─ PurchaseOrders.jsx
│  │  │  ├─ Register.jsx
│  │  │  ├─ SalesOrders.jsx
│  │  │  ├─ Suppliers.jsx
│  │  │  ├─ Vehicles.jsx
│  │  │  └─ Warehouses.jsx
│  │  ├─ Routing
│  │  │  ├─ Index.jsx
│  │  │  ├─ IndexRedirect.jsx
│  │  │  ├─ ProtectedRoutes.jsx
│  │  │  └─ PublicRoutes.jsx
│  │  ├─ Services
│  │  │  ├─ authService.js
│  │  │  ├─ customerService.js
│  │  │  ├─ driverService.js
│  │  │  ├─ inventoryService.js
│  │  │  ├─ invoiceService.js
│  │  │  ├─ productService.js
│  │  │  ├─ purchaseOrderService.js
│  │  │  ├─ salesOrderService.js
│  │  │  ├─ supplierService.js
│  │  │  ├─ userService.js
│  │  │  ├─ vehicleService.js
│  │  │  └─ warehouseService.js
│  │  └─ utils
│  ├─ vercel.json
│  └─ vite.config.js
├─ README.md
└─ server
   ├─ Config
   │  └─ mongoDb.js
   ├─ Controller
   │  ├─ authController.js
   │  ├─ customerController.js
   │  ├─ driverController.js
   │  ├─ inventoryController.js
   │  ├─ invoiceController.js
   │  ├─ productController.js
   │  ├─ purchaseOrderController.js
   │  ├─ salesOrderController.js
   │  ├─ supplierController.js
   │  ├─ UserController.js
   │  ├─ vehicleController.js
   │  └─ warehouseController.js
   ├─ Models
   │  ├─ CustomerModel.js
   │  ├─ DriverModel.js
   │  ├─ InventoryModel.js
   │  ├─ InvoiceModel.js
   │  ├─ ProductModel.js
   │  ├─ PurchaseOrderModel.js
   │  ├─ SalesOrderModel.js
   │  ├─ SupplierModel.js
   │  ├─ UserModel.js
   │  ├─ VehicleModel.js
   │  └─ WarehouseModel.js
   ├─ package-lock.json
   ├─ package.json
   ├─ Routing
   │  ├─ authRouter.js
   │  ├─ customerRouter.js
   │  ├─ driverRouter.js
   │  ├─ inventoryRouter.js
   │  ├─ invoiceRouter.js
   │  ├─ productRouter.js
   │  ├─ purchaseOrderRouter.js
   │  ├─ salesOrderRouter.js
   │  ├─ supplierRouter.js
   │  ├─ userRouter.js
   │  ├─ vehicleRouter.js
   │  └─ warehouseRouter.js
   ├─ server.js
   └─ Utils
      ├─ adminMiddleware.js
      ├─ authMiddleware.js
      ├─ generateAccessToken.js
      └─ generateRefreshToken.js

```