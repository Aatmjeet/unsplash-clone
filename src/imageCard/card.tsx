import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// toast
import { toast } from "react-toastify";

interface imgcprops {
  imgSrc: string;
  userName: string;
  userProfile: string;
  upDate: string;
  description: string;
  downloadLink: string;
  imageID: string;
  sharingLink: string;
  profileLink: string;
}
export default function ImageCard(props: imgcprops) {
  const {
    imgSrc,
    userName,
    userProfile,
    upDate,
    description,
    downloadLink,
    imageID,
    sharingLink,
    profileLink,
  } = props;

  const customtoast = (message: string) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
    });

  const copyLinkToClip = () => {
    const el = document.createElement("input");
    el.value = sharingLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    customtoast("Link copied to clipboard!");
  };

  const downloadImage = () => {
    //custom Toast
    customtoast("Downloading image!");
    fetch(downloadLink, {
      method: "GET",
      mode: "no-cors",
      headers: {
        "Content-Type": "image/png",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${imageID}.png`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode?.removeChild(link);
      });
  };
  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={userProfile} aria-label="user"></Avatar>}
        style={{ cursor: "pointer" }}
        onClick={() => {
          customtoast("Redirecting to User's Profile");
          window.location.href = profileLink;
        }}
        title={userName}
        subheader={`uploaded on ${upDate}`}
      />
      <CardMedia component="img" image={`${imgSrc}`} alt="Paella dish" />
      {description ? (
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      ) : (
        ""
      )}
      <CardActions className="align-center" disableSpacing>
        <IconButton onClick={copyLinkToClip} aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton onClick={downloadImage} aria-label="Download">
          <ArrowDownwardIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
