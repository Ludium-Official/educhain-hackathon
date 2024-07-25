import { styled } from "@mui/material";

export const Body = styled("div")(({ theme }) => ({
  position: "relative",
  overflow: "hidden",

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  width: "100%",
  minHeight: "100vh",
}));

export const Container = styled("div")({
  zIndex: 1,
  position: "relative",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  maxWidth: "192rem",
  margin: "0 auto 17.2rem",
});

export const BgGradient = styled("div")({
  position: "absolute",
});

export const HeaderGradient = styled(BgGradient)({
  top: "0",

  width: "100%",
  height: "28rem",
  background: "linear-gradient(180deg, #20233B 0%, rgba(44, 32, 59, 0) 100%)",
});

export const FooterGradient = styled(BgGradient)(({ theme }) => ({
  bottom: "-26rem",
  left: "50%",
  transform: "translate(-50%, 0)",

  width: "59rem",
  height: "52.6rem",
  opacity: "0.6",
  filter: "blur(20rem)",
}));

export const BackgroundWrapper = styled("div")({
  position: "absolute",

  display: "flex",
  justifyContent: "center",

  width: "100%",
});

export const ImgWrapper = styled("div")({
  position: "relative",

  width: "192rem",
  height: "10rem",
});

export const BackgrounImg = styled("img")({
  position: "absolute",
  top: "-50rem",
});
