# Golden Fiber Flow - AI Context Guide

## 🖥️ Project Overview

- **Type:** MERN Stack Logistics Application (Consignment Management)
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

## Features

- User can add product, customer, supplier, driver, vehicle, warehouse.
- user can create sells or purchase order.
- The sells order listing will be added in the invoice section after created.
  Invoice can be download and print anytime from invoice page.
- The purchase quantity will be added after create purchase order.

## 📐 Coding Guidelines (For Claude)

1. **State Management:** Use clean React state hooks or context where necessary.
2. **Styling:** Use functional Tailwind CSS classes. Keep dashboards data-dense and clean.
3. **Error Handling:** Always implement try-catch blocks in backend routes and proper status codes.
4. **RBAC:** Ensure Role-Based Access Control is checked for `/user` and `/consignment` operations.
5. **Responses:** Keep code explanations concise. Focus on fixing the specific code snippet provided.
