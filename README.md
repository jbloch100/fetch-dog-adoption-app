# Fetch Dog Adoption App

This is a React-based frontend application built with TypeScript and Vite for browsing adoptable dogs. Users can filter by breed, sort results, paginate through listings, and favorite dogs to find their best match.

## Features

- User login via name and email
- Filter dogs by breed
- Sort results by name, breed, or age (ascending or descending)
- Paginated results with consistent sorting
- Favorite/unfavorite dogs
- Match a dog from the favorites list using the `/dogs/match` endpoint
- Scroll to matched dog automatically
- Responsive design using Material UI (MUI)
- Logout functionality that clears session and favorites

## Technologies Used

- React + TypeScript
- Vite
- Axios
- React Router DOM
- Material UI (MUI)

## Project Structure

```bash
src/
├── api/           # API utility functions
├── components/    # Shared components (NavBar)
├── context/       # Global state management (AppContext)
├── pages/         # Page components (Login, Search)
├── types/         # Type definitions
├── App.tsx        # Main app component
└── main.tsx       # Entry point
```

## Deployment

This app is deployable via [Vercel](https://vercel.com/).

- Build command: `npm run build`
- Output directory: `dist`

## License

This project is for educational/demo purposes.