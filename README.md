How to run this app locally

##### Description:

This app has three components: a front-end for the admin dashboard, a front-end for the main UI, and a back-end that includes a Nest.js REST API server and a MongoDB image pulled from Docker.

##### Tech stack:

- Front-end: HTML, CSS, Next.js App Router
- UI library: ShadCN
- Back-end: Nest.js, Mongoose
- Database: MongoDB
- Other: Docker, CSS Module

# Backend:

1. First, `cd` into `backend` folder.

```
cd backend
```

2. Then, run docker-compose up to launch the backend app with mongodb Docker image

```
docker-compose up
```

3. Please go to Postman and call the following apis to seed data:

- Seed songs data:

```
POST: http://localhost:4000/songs/seed
```

- Seed users data:

```
POST: http://localhost:4000/users/seed
```

You should now have a set of users and songs data initialized in the MongoDB container.

4. All the variables are stored in `docker-compose.yml` for now so you can run the project more conveniently using `docker-compose up`.

# Frontend: Music Market (main UI)

1. First, `cd` into `frontend` folder:

```
cd frontend
```

2. Run `npm install` to install all the dependencies.
3. Run `npm run dev` to launch the app.
4. Create `.env.local` file and paste the following:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

# Admin dashboard

1. First, `cd` into `admin-dashboard` folder:

```
cd admin-dashboard
```

2. Run `npm install` to install all the dependencies.
3. Run `npm run dev` to launch the app.
4. Credentials for admin:

- Username: user
- Password: password

5. Create a `.env.local` file and paste the following:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_ADMIN_USERNAME=user
NEXT_PUBLIC_HASHED_ADMIN_PASSWORD=sQnzu7wkTrgkQZF+0G1hi5AI3Qmzvv0bXgc5THBqi7mAsdd4Xll27ASbRt9fEyavWi6m0QP9B8lThf+rDKy8hg==
# password is: password
```

# Plans to improve:

1. Create "view more" pages for "Top Songs" and "Newest Songs" with infinite scrolls.
2. Leverage authentication flow with refresh token to maintain users' sessions.
3. Write unit tests and e2e testing for both front and back ends.
4. Setup SMTP with Mailtrap to send email for "Forgot password" feature
5. Deploy the application
6. Configure file storage system to store images instead of using straight urls
