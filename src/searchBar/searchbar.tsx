import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

interface seachbarprops {
  setSearchParam: (val: string) => void;
  setContentType: (val: "explore" | "search") => void;
}

export default function SearchBar(props: seachbarprops) {
  const { setSearchParam, setContentType } = props;

  const [searchQuery, setSearchQuery] = useState("");

  const searchBarUpdate = useCallback(
    (searchString: string) => {
      setSearchQuery(searchString);
    },
    [setSearchQuery]
  );

  const doSearch = useCallback(() => {
    setSearchParam(searchQuery);
    setContentType("search");
  }, [setSearchParam, setContentType, searchQuery]);

  return (
    <TextField
      id="seachBox"
      label="Search anything"
      value={searchQuery}
      onChange={(e) => searchBarUpdate(e.target.value)}
      sx={{
        width: 360,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={doSearch}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
