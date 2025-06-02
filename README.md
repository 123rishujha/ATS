# ATS - Applicant Tracking System

A modern applicant tracking system designed to streamline the recruitment process using AI-powered features for both job seekers and recruiters.

## 🌐 Live Demo

[ATS System](https://lighthearted-starship-4be39a.netlify.app/) 

## 📝 Overview

This ATS system facilitates efficient recruitment workflows with separate interfaces for:

- **Job Seekers**: Create profiles, browse listings, and apply for positions
- **Recruiters**: Post jobs, manage applicants, and leverage AI for candidate evaluation

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local installation or MongoDB Atlas account)
- OpenAI API Key for AI features

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following variables:
   ```
   PORT=8000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   S3_USER_ACCESS_KEY=your_aws_access_key_for_s3_user
   S3_USER_SECRET_KEY=your_aws_secret_key_for_s3_user
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. Create a `.env` file in the Backend directory with the following variables:
   ```
   VITE_BACKEND_URL=your_backend_url
   VITE_USER_ROLE = {"recruiter":"your_recruite_role","jobseeker":"your_jobseeker_role"}
    ```

4. Start the development server:
   ```
   npm run dev
   ```
   
5. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## 🤖 AI Features

The system leverages OpenAI's GPT models to provide the following AI-powered features:

### 1. Smart Job Matching score

- **Fit Score Calculation**: Uses GPT-4o to analyze job descriptions against candidate resumes to generate

### 2. AI-Powered Feedback

- **Application Feedback**: Uses GPT-3.5 to provide constructive feedback to candidates on their performance in interview.


### 3. Automated Resume Parsing

- Extracts relevant information from uploaded resumes including skills, experience, and education.

## 🔧 Tech Stack

- **Frontend**: React, Vite, Redux Toolkit, TailwindCSS, Radix UI
- **Backend**: Node.js, Express, MongoDB
- **AI**: OpenAI API (GPT-4o, GPT-3.5-turbo)
- **Cloud Storage**: AWS S3 for resume and document storage
