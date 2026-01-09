# Project

This is our 1st semester project: a social media app for musicians.
The concept and design were created by students from another program, and we have had the pleasure of using their work as the foundation for our development.

This project is made in collaboration with:

- [Jacob](https://github.com/Jacoksen)
- [Dennis](https://github.com/DennisRussell0)
- [Sergio](https://github.com/smw22)

# Project Technologies Overview

This project, Lineup, is a full-stack web application built with a modern technology stack designed for scalability, maintainability, and a great user experience.

## Frontend

**Framework:** React Router (TypeScript) in Framework SPA mode
**Styling:** Tailwind CSS
**Build Tool:** Vite
**Deployment:** Render (static site hosting)

## Backend

**Framework:** NestJS (TypeScript)
**Database:** For the purpose of testing this i made it work with a SQLite DB, but its originally made for a MySQL DB
**ORM:** TypeORM (assumed from NestJS + MySQL stack)

## API & Documentation

**API Documentation:** Made as a Bruno collections (`api-docs/`)

## DevOps & Tooling

**Monorepo Structure:** Separate `frontend/` and `backend/` directories

## Design & Collaboration

**UI/UX Design:** Figma (see [Figma link](https://www.figma.com/design/aX1bEPNGfhzCUKHQFK9nTf/LineUp---WU-E25a-Semesterprojekt--Copy-?node-id=61-17&t=GXVjUke9gB9O5UUA-1))

# Features

## Implemented

**Posts**

- Feed on Home and Profile, as well as single post view.

**Collaborations**

- Slider/Feed on home, general collaborations feed, and single collaboration view.

**Services**

- Services list (with pagination and search functionality).
- Services preview (with reviews).
- Create services.

**Chat**

- Threads list, both for 1:1 and group chats.
- Chat preview (1:1 and groups).
- Send messages.
- Create chats directly from collaborations, services, and profile.

**Profile**

- Profile view.
- Differentiation between viewing current user or another user.
- Edit profile.
- Create and answer questions for a user.
- Embedded Spotify player & YouTube video.

**Onboarding / Login**

- Onboarding flow for registering a new user.
- Login.

**Connections**

- Request to connect with a user.
- Accept a connection request.
- View connection requests in notifications.
- Add a connected user to posts and collaborations.
- Show multiple connected users on posts and collaborations.

**Likes**

- Ability to like posts.
- Ability to like comments.

**Comments**

- Comment on a post.
- Reply to a comment (nested comments).

**Search**

- Search everything.
- Search People.
- Search Collaborations.
- Search Services.
- Search Tags (searches in collaborations and posts).

## Missing

**Stories**

- Currently displayed as static data in the frontend. Nothing has been set up for stories.

**Saved / Favorites**

- Not implemented.
- Applies to posts, collaborations, and services.

**Chat**

- Users cannot create a group chat themselves.
- Cannot search for a chat.
- Cannot edit the chat name.
- Cannot see a list of users connected to the chat.

**Notifications**

- Design implemented.
- The menu item does not indicate when there is a new notification.
- Most backend functionality is missing.
- Connections are dynamic and can be used to accept connection requests.

**Filtering**

- Filter on Services is not implemented.
- Filter on Collaborations is not implemented.

**Tags, Genre, and Skills**

- Missing the ability to add your own / create new ones. API endpoints exist, but frontend does not.

**Reviews**

- Backend exists for Reviews on Services and Profile.
- Reviews are displayed in the frontend, but you cannot create a review in the frontend.

**Profile**

- "Artists I Like" is not made with dynamic content. It has been unclear whether this refers to artists on LineUp or if the idea was to fetch artists via e.g. Spotify API.
- "Past collaborations" is not made with dynamic content.
- On profile edit, it is not possible to change your profile picture.
- On profile edit, there is no option to add or remove blocks (see more under deviations).

**Menu items in burger menu**

- Items with "Coming Soon" badge are not developed.

# Database Structure

<img width="1303" height="926" alt="Screenshot 2025-12-15 at 13 44 58" src="https://github.com/user-attachments/assets/38af03d0-69aa-4c5a-b5ec-b49a5318105c" />

# Test Login

- Awesome User:
  - User: test@user.com
  - Pass: admin

(It is also possible to create a user through the registration flow, which you can use.)
