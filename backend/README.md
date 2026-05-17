# Smart Placement Portal Backend

This backend provides APIs for a placement portal with student profiles, resume uploads, job eligibility filtering, and admin analytics.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` to your MongoDB connection string.
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start the server:

```bash
npm run dev
```

## API Endpoints

- `GET /` - health check
- `POST /api/students/register` - create student profile
- `POST /api/students/login` - student login
- `POST /api/students/:id/resume` - upload resume file (`multipart/form-data`)
- `GET /api/students` - list all students
- `GET /api/students/:id` - student profile details
- `POST /api/jobs` - post a job
- `GET /api/jobs` - list jobs with optional `branch`, `minCgpa`, `skill`
- `GET /api/jobs/eligible/:studentId` - list jobs eligible for a student
- `GET /api/admin/analytics` - admin analytics summary

## Notes

- Resumes are stored under `backend/uploads`.
- This scaffold uses Express, MongoDB, Mongoose, and Multer.
