import { Box, styled } from "@mui/material";
import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import FavoritesContext from "../../../context/favorite-context";
import Message from "../../../models/Message";
import People from "../../../models/People";
import Task from "../../../models/Task";
import { Favorites } from "../../../models/favorites";
import FavoritesService, {
  getFavoritesById,
} from "../../../services/favorites.service";
import { getPublicMessages } from "../../../services/message.service";
import UserService from "../../../services/user.service";
import TasksService from "../../../services/task.service";
import { Grid } from "../../OuiComponents/Layout";
import styles from "./Layout-styles.module.css";
import ListAppBar from "./ListAppBar";
import ListSideBar from "./ListSideBar";
import RouteHistory from "../RouteHistory/RouteHistory";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import msalInstance from "../../../msalInstance";

interface userLogin {
  user: People;
  task: Task;
  message: Message;
  favorites: Favorites[];
}

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

function Layout() {
  const [userData, setUserData] = React.useState<userLogin>();
  const [check, setCheck] = React.useState(false);
  const [userFolio, setUserFolio] = React.useState("");
  const [saveFavorite, setFavorite] = React.useState<Favorites[]>([]);
  const [organizationName, setOrganizationName] = React.useState("")

  const navigate = useNavigate();

  React.useEffect(() => {
    const email = localStorage.getItem("userEmail") ?? "";
    setOrganizationName(localStorage.getItem("organizationName") ?? "");

    const fetchUser = async () => {
      try {
        const userEmail = { 'email': localStorage.getItem('userEmail')?.toString() ?? '' }
        const userInfo = await UserService.getByEmail(email);
        const userMessage = await getPublicMessages();
        const userFavorite = await getFavoritesById(userInfo.data.folio);
        const task = await TasksService.getTasksEmail(JSON.stringify(userEmail));
        if (userInfo.data != null) {
          setUserData({
            user: userInfo.data,
            task: task.data ?? [],
            message: userMessage.data,
            favorites: userFavorite.data ?? [],
          });
          setUserFolio(userInfo.data.folio);
          // const time = localStorage.getItem("sessionTime")
        // if(time){
        //   setTimeout(()=>{
        //   localStorage.clear();
        //   navigate('/Logout')
        //   msalInstance.logoutRedirect();
        // },parseInt(time))
        // }
        }
      } catch {
        localStorage.clear();
        navigate("/Logout");
        msalInstance.logoutRedirect();
      }
    };
    fetchUser();
}, []);

  const deleteFavorite = async (folio: string) => {
    const response = await FavoritesService.deleteFavorite(folio);

    if (response.status) {
      const userFavorite = await getFavoritesById(userFolio);
      if (userFavorite) {
        const currentDataFavorites = userFavorite.data;
        if (userData) {
          setUserData({ ...userData, favorites: currentDataFavorites });
        }
      }
    }
  };

  const addFavorite = async (data: any) => {
    const response = await FavoritesService.postNewFavorite(data);
    if (response.status) {
      //const currentDataFavorites = userData?.favorites ? [...userData.favorites] : [];
      //currentDataFavorites.push(data);
      const userFavorite = await getFavoritesById(userFolio);
      if (userData) {
        setUserData({ ...userData, favorites: userFavorite.data });
      }
    }
  };

  const onCheck = (state: any) => {
    setCheck(state);
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: userData?.favorites || [],
        addFavorite: addFavorite,
        deleteFavorite: deleteFavorite,
        personId: userFolio,
      }}
    >
      <Box display="flex">
        <Box component="div" className={styles["nav-header"]}>
          <Box
            component="div"
            className={
              styles["nav-menu"] +
              " " +
              styles["d-flex"] +
              " " +
              styles["justify-content-end"] +
              " " +
              styles["align-items-center"]
            }
          >
            {userData ? <ListAppBar data={userData} dataCompany={organizationName}/> : <></>}
          </Box>
        </Box>
        <Box
          component="input"
          type="checkbox"
          id={styles["side-menu-switch"]}
          onChange={(e) => onCheck(e.target.checked)}
        />
        <Box
          component="div"
          display="flex"
          flexDirection="column"
          className={styles["side-menu"]}
        >
          <Box
            sx={{ flexGrow: 0 }}
            component="div"
            className={styles["side-menu-logo"]}
          >
            <Box
              component="img"
              src={"/img/Iconos/IconOnesta.svg"}
              onClick={handleHome}
            />
            <Box component="div" className={styles["side-menu-text"]}>
              Onesta One
            </Box>
          </Box>
          <Box component="nav" sx={{ flexGrow: 1 }}>
            <ListSideBar params={check} />
          </Box>
          <Box component="div" className={styles["side-menu-powered"]}>
            <Box component="img" src={"/img/Iconos/PoweredBy.svg"} />
          </Box>
          <Box component="label" htmlFor={styles["side-menu-switch"]}>
            <Box
              component="i"
              className={styles["fas "] + " " + styles["fa-angle-left"]}
            ></Box>
          </Box>
        </Box>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item sx={{ ml: "95px" }} xs={10}>
            <RouteHistory />

            {/* <DrawerHeader /> */}
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </FavoritesContext.Provider>
  );
}

export default Layout;
