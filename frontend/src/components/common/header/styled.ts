import { styled } from "@mui/material";

export const Container = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  width: "100%",

  fontSize: "1.6rem",
});

export const HeaderWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",

  width: "100%",
});

export const Navigation = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",

  marginRight: "2rem",
});
