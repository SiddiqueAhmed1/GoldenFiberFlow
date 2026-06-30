# Golden Fiber Flow - AI Context Guide

## 🖥️ Project Overview
- **Type:** MERN Stack Business Application
- **Architecture:** Monorepo with `/frontend` and `/server` folders.

## 🛠️ Technology Stack
- **Frontend Core:** React.js, Tailwind CSS Framework
- **Backend Core:** Node.js, Express.js REST Framework
- **Database Layer:** MongoDB NoSQL Document Store, Mongoose ODM
- **Document Processing:** html-to-png, js-pdf, react-to-print

## 📡 API Specs & Access Tiers
- `/auth` - Public / Session Management
- `/user` - Restricted (Admin Only)
- `/consignment` - Protected (RBAC Control)

```
This is the Project Structure
GoldenFiberFlow/
├── .gitignore
├── README.md
├── frontend/
│   ├── .gitignore
│   ├── Claude.md
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── gftcl.png
│   │   └── icons.svg
│   ├── src/
│   │   ├── Api/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── Components/
│   │   │   ├── CustomerModal.jsx
│   │   │   ├── DriverModal.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── InvoiceModal.jsx
│   │   │   ├── InvoicePDF.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ProductModal.jsx
│   │   │   ├── PurchaseOrderModal.jsx
│   │   │   ├── SalesOrderModal.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SupplierModal.jsx
│   │   │   ├── UserModal.jsx
│   │   │   ├── VehicleModal.jsx
│   │   │   └── WarehouseModal.jsx
│   │   ├── Context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── Hooks/
│   │   │   └── useAuth.js
│   │   ├── Layout/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── Pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── Drivers.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── PurchaseOrders.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SalesOrders.jsx
│   │   │   ├── Suppliers.jsx
│   │   │   ├── Vehicles.jsx
│   │   │   └── Warehouses.jsx
│   │   ├── Routing/
│   │   │   ├── Index.jsx
│   │   │   ├── IndexRedirect.jsx
│   │   │   ├── ProtectedRoutes.jsx
│   │   │   └── PublicRoutes.jsx
│   │   ├── Services/
│   │   │   ├── authService.js
│   │   │   ├── customerService.js
│   │   │   ├── driverService.js
│   │   │   ├── inventoryService.js
│   │   │   ├── invoiceService.js
│   │   │   ├── productService.js
│   │   │   ├── purchaseOrderService.js
│   │   │   ├── salesOrderService.js
│   │   │   ├── supplierService.js
│   │   │   ├── userService.js
│   │   │   ├── vehicleService.js
│   │   │   └── warehouseService.js
│   │   ├── assets/
│   │   │   ├── gftcl.png
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vercel.json
│   └── vite.config.js
└── server/
    ├── Config/
    │   └── mongoDb.js
    ├── Controller/
    │   ├── UserController.js
    │   ├── authController.js
    │   ├── customerController.js
    │   ├── driverController.js
    │   ├── inventoryController.js
    │   ├── invoiceController.js
    │   ├── productController.js
    │   ├── purchaseOrderController.js
    │   ├── salesOrderController.js
    │   ├── supplierController.js
    │   ├── vehicleController.js
    │   └── warehouseController.js
    ├── Models/
    │   ├── CustomerModel.js
    │   ├── DriverModel.js
    │   ├── InventoryModel.js
    │   ├── InvoiceModel.js
    │   ├── ProductModel.js
    │   ├── PurchaseOrderModel.js
    │   ├── SalesOrderModel.js
    │   ├── SupplierModel.js
    │   ├── UserModel.js
    │   ├── VehicleModel.js
    │   └── WarehouseModel.js
    ├── Routing/
    │   ├── authRouter.js
    │   ├── customerRouter.js
    │   ├── driverRouter.js
    │   ├── inventoryRouter.js
    │   ├── invoiceRouter.js
    │   ├── productRouter.js
    │   ├── purchaseOrderRouter.js
    │   ├── salesOrderRouter.js
    │   ├── supplierRouter.js
    │   ├── userRouter.js
    │   ├── vehicleRouter.js
    │   └── warehouseRouter.js
    ├── Utils/
    │   ├── adminMiddleware.js
    │   ├── authMiddleware.js
    │   ├── generateAccessToken.js
    │   └── generateRefreshToken.js
    ├── package-lock.json
    ├── package.json
    └── server.js

```

## 📐 Coding Guidelines (For Claude)
1. **State Management:** Use clean React state hooks or context where necessary.
2. **Styling:** Use functional Tailwind CSS classes. Keep dashboards data-dense and clean.
3. **Error Handling:** Always implement try-catch blocks in backend routes and proper status codes.
4. **RBAC:** Ensure Role-Based Access Control is checked for `/user` and `/consignment` operations.
5. **Responses:** Keep code explanations concise. Focus on fixing the specific code snippet provided.
