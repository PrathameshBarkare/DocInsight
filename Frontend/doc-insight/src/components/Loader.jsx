import React from 'react'
import CircularProgress from "@mui/material/CircularProgress";

function Loader({size}) {
  return (
    <CircularProgress size={size} />
  )
}

export default Loader;