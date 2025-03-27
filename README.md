# TaskFlow 📋

## Overview

TaskFlow is a comprehensive task management application built with React, Vite, and Axios. This project provides a robust frontend for managing tasks with features like task creation, updating, and calendar scheduling.

## Prerequisites

- Node.js (v18 or later)
- npm
- Backend API (Required - see Backend Setup section)

## Backend Requirement 🚨

**Important**: This project requires a backend system to function. You'll need a backend API that supports:
- JWT Authentication
- CRUD operations for tasks
- User management
- RESTful endpoints for task management

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/roasted99/taskflow-ui.git
cd taskflow-ui
```

### 2. Install Dependencies

```bash
npm install
```

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features 🌟

- JWT Authentication
- Task Creation
- Task Updating
- Task Deletion
- Calendar View of Assigned Tasks
- Permission-based Task Management

## Permissions

- **Create Tasks**: All authenticated users
- **Update/Delete Tasks**: 
  - Task Owner
  - User Assigned to the Task


## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build

## Recommended Backend Technologies

While this is a frontend application, we recommend running backend server called taskflow which is built using Python with Flask at `https://github.com/roasted99/taskflow.git`
