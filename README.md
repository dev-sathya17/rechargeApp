# Recharge Mobile Application

A React Native mobile application with a Flask backend and MySQL database. This application supports three user roles: Admin, Distributor, and Retailer. The core functionality involves a hierarchical money transfer system and the ability for all users to generate real-time recharges and analytical reports.

## Features

- **User Roles**:

  - **Admin**: Manages the entire system, oversees distributors, and controls the flow of money to distributors.
  - **Distributor**: Receives money from the Admin and transfers it to Retailers.
  - **Retailer**: Receives money from Distributors and handles the end-user transactions.

- **Real-Time Recharge**:
  - All users can perform real-time recharges based on their roles.
- **Reporting and Analytics**:
  - Users can generate reports to analyze their transaction history and financial status.

## Tech Stack

- **Frontend**: React Native
- **Backend**: Flask
- **Database**: MySQL

## Installation

### Prerequisites

- Node.js
- Python
- MySQL
