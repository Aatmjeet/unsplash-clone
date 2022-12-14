import { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// toast
import { toast } from "react-toastify";


/**
 * Expand more is used to to display a custom button,
 * which hides the unnecessory information
 */
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
  likes: number;
  altDes: string;
  setPreviewState: (val: boolean) => void;
  previewContent: any;
  isPreview: boolean;
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
    likes,
    altDes,
    setPreviewState,
    previewContent,
    isPreview,
  } = props;


  /**
   * Important: Following functionality monitors change in window size
   * and according to that sets the value of height of the preview card.
   * Since we are dealing with big sized images, this helps in controlling overflow
   */
  const [height, setHeight] = useState(window.innerHeight * 0.6);

  const updateHeight = () => {
    setHeight(0.6 * window.innerHeight);
  };
  // Using this to update height of preview when the browser window is resized
  useEffect(() => {
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  });


  /**
   * Following is to change the state of dropdown to show
   * alternative description
   */
  const [expanded, setExpanded] = useState(true);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  /***
   * this is our custom toast used to toast redirect and downloading updates
   */
  const customtoast = (message: string) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
    });


  // Fucntion to copy post link to clipboard
  const copyLinkToClip = () => {
    const el = document.createElement("input");
    el.value = sharingLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    customtoast("Link copied to clipboard!");
  };

  // Fucntion to download Image
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

  /***
   * Our custom card component
   * We are using this to
   * 1. display post on Explore and search feed
   * 2. display image preview
   * 
   * Note: we are passing "isPreview" everytime we are rendering this component
   * This is a regular boolean given to check, how actually the card is being used.
   * This helps in adding re-usability to our component
   */
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            style={{ cursor: "pointer" }}
            onClick={() => {
              customtoast("Redirecting to User's Profile");
              window.location.href = profileLink;
            }}
            src={userProfile}
            aria-label="user"
          ></Avatar>
        }
        action={
          isPreview && (
            <IconButton
              onClick={() => {
                setPreviewState(false);
              }}
              aria-label="settings"
            >
              <CloseIcon />
            </IconButton>
          )
        }
        title={userName}
        subheader={`uploaded on ${upDate}`}
      />
      <CardMedia
        style={{ cursor: "pointer", maxHeight: isPreview ? `${height}px` : "auto" }}
        onClick={() => {
          if (!isPreview) {
            setPreviewState(true);
            previewContent.content = {
              imgSrc,
              userName,
              userProfile,
              upDate,
              description,
              downloadLink,
              imageID,
              sharingLink,
              profileLink,
              likes,
              altDes,
            };
          }
        }}
        component="img"
        image={`${imgSrc}`}
      />
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
        {isPreview && (
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        )}
      </CardActions>
      {isPreview && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>{likes} Likes</Typography>
            <Typography paragraph>{altDes}</Typography>
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
}
