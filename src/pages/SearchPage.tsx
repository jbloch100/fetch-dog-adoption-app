import React, { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { logout } from "../api";
import {
  getBreeds,
  searchDogs,
  getDogsByIds,
  matchDogs
} from "../api";
import { useAppContext } from "../context/AppContext";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const SearchPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<any[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [sort, setSort] = useState("breed:asc");
  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [match, setMatch] = useState<any | null>(null);
  const matchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getBreeds().then((res) => {
      const unique = [...new Set(res.data)];
      setBreeds(unique);
    });
  }, []);

  useEffect(() => {
    setCursor(null);
    setNextCursor(null);
    setPrevCursor(null);
  }, [sort, selectedBreed]);

  useEffect(() => {
    const [field, direction] = sort.split(":");

    const fetchData = async () => {
      try {
        let url = "";

        if (cursor) {
          // If we have a cursor (next/prev), use it directly (API gives full URL)
          url = cursor;
        } else {
            // Otherwise, build a fresh query
            const params = new URLSearchParams({
            sort: `${field}:${direction}`,
            size: "12",
            });

          if (selectedBreed && selectedBreed !== "All") {
            params.append("breeds", selectedBreed);
          }

          url = `/dogs/search?${params.toString()}`;
        }

        const res = await searchDogs(url); // Pass full URL to searchDogs
        const ids = res.data.resultIds;

        setNextCursor(res.data.next ?? null);
        setPrevCursor(res.data.prev ?? null);

        const details = await getDogsByIds(ids);
        let sorted = details.data;
        if(field === "age") {
          sorted = [...sorted].sort((a,b) => direction === "asc" ? a.age - b.age: b.age - a.age);
        }
        setDogs(sorted);

        // Scroll to top after updating results
        window.scrollTo({ top: 0, behavior: "smooth"});
      } catch (err) {
        console.error("Search failed:", err);
      }
    };

    fetchData();
  }, [selectedBreed, sort, cursor]);

  useEffect(() => {
    setMatch(null);
  }, [state.favorites]);

  useEffect(() => {
    if (matchRef.current) {
      matchRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [match]);

  const handleFavorite = (id: string) => {
    if (state.favorites.includes(id)) {
      dispatch({ type: "REMOVE_FAVORITE", payload: id });
      // Clears the match if the current matched dog is no longer in favorites
      if(match && match.id === id) {
        setMatch(null);
      }
    } else {
      dispatch({ type: "ADD_FAVORITE", payload: id });
    }
  };

  const handleMatch = async () => {
    if (state.favorites.length === 0) return;
    const res = await matchDogs(state.favorites);
    const matchId = res.data.match;
    const result = await getDogsByIds([matchId]);
    setMatch(result.data[0]);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (

    <div style={{ padding: "1rem" }}>
      <Typography variant="h5" align="center" sx={{ mt: 2, mb: 3 }}> Search Dogs </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Breed</InputLabel>
            <Select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)} label="Breed">
              <MenuItem value="All">All</MenuItem>
              {breeds.map((breed) => (
                <MenuItem key={breed} value={breed}>{breed}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Sort</InputLabel>
            <Select value={sort} onChange={(e) => setSort(e.target.value)} label="Sort">
              <MenuItem value="breed:asc" disabled={selectedBreed !== "" && selectedBreed !== "All"}>Breed A-Z</MenuItem>
              <MenuItem value="breed:desc" disabled={selectedBreed !== "" && selectedBreed !== "All"}>Breed Z-A</MenuItem>
              <MenuItem value="age:asc">Age Asc</MenuItem>
              <MenuItem value="age:desc">Age Desc</MenuItem>
              <MenuItem value="name:asc">Name A-Z</MenuItem>
              <MenuItem value="name:desc">Name Z-A</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {dogs.map((dog) => (
          <Grid item xs={12} sm={6} md={4} key={dog.id}>
            <Card>
              <CardMedia component="img" height="200" image={dog.img} alt={dog.name} />
              <CardContent>
                <Typography variant="h6">{dog.name}</Typography>
                <Typography>Breed: {dog.breed}</Typography>
                <Typography>Age: {dog.age}</Typography>
                <Typography>ZIP: {dog.zip_code}</Typography>
                <Button
                  variant="contained"
                  color={state.favorites.includes(dog.id) ? "secondary" : "primary"}
                  onClick={() => handleFavorite(dog.id)}
                  sx={{ mt: 1 }}
                >
                  {state.favorites.includes(dog.id) ? "Unfavorite" : "Favorite"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => setCursor(prevCursor)} disabled={!prevCursor}>
            ← Previous
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => setCursor(nextCursor)} disabled={!nextCursor}>
            Next →
          </Button>
        </Grid>
      </Grid>

      <div style={{ marginTop: "2rem" }}>
        <Button variant="contained" disabled={state.favorites.length === 0} onClick={handleMatch}>
          Match Me With a Dog!
        </Button>
      </div>

      {match && (
        <div ref={matchRef} style={{ marginTop: "2rem", padding: "1rem", border: "2px solid green" }}>
          <h2>You're matched with:</h2>
          <img src={match.img} alt={match.name} width="150" />
          <p>
            <strong>{match.name}</strong>, the {match.breed}, age {match.age}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;