# Week 2 Progress - Nexus Platform

## Completed Work

- Implemented meeting scheduling backend system.
- Created meeting model with investor, entrepreneur, start time, end time and status.
- Added meeting scheduling API.
- Added meeting list API.
- Added meeting accept and reject APIs.
- Added conflict detection to prevent double booking.
- Implemented document upload backend using Multer.
- Stored document metadata in MongoDB.
- Added document list and single document APIs.
- Added e-signature upload API and linked signature image to document.
- Added basic Socket.IO signaling server for video calling.
- Added events for join-room, offer, answer, ice-candidate, leave-room and disconnect.

## Completed APIs

### Authentication APIs

POST /api/auth/register  
POST /api/auth/login  
GET /api/auth/me  
PUT /api/auth/profile  

### Meeting APIs

POST /api/meetings  
GET /api/meetings  
PATCH /api/meetings/:id/accept  
PATCH /api/meetings/:id/reject  
DELETE /api/meetings/:id  

### Document APIs

POST /api/documents/upload  
GET /api/documents  
GET /api/documents/:id  
PATCH /api/documents/:id/sign  
DELETE /api/documents/:id  

### Video Calling Backend Events

join-room  
offer  
answer  
ice-candidate  
leave-room  
disconnect  

## Tech Stack Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- Socket.IO
- CORS
- dotenv
- helmet
- express-rate-limit

## Testing Completed

- User registration tested successfully.
- User login tested successfully.
- Protected profile route tested successfully.
- Profile update tested successfully.
- Meeting scheduling tested successfully.
- Meeting list tested successfully.
- Meeting conflict detection tested successfully.
- Document upload tested successfully.
- E-signature upload tested successfully.

## Pending Work

- Frontend integration for meeting calendar.
- Frontend document preview using React PDF viewer.
- Full video calling frontend UI.
- Payment section.
- Deployment.