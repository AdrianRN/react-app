import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Stack,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Layout-styles.module.css";
import Menu from "../../../models/Menu";
import FormatData from "../../../utils/Formats.Data";
import CacheService from "../../../services/cache.service";
import msalInstance from "../../../msalInstance";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#5D6A72",
    color: "#fff",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

function ListSideBar({ params }: { params: boolean }) {
  const [openModuleId, setOpenModule] = React.useState<boolean | string>("");
  const [open, setOpen] = React.useState(false);
  const [activeModuleId, setActiveModule] = React.useState<boolean | string>(
    ""
  );
  const [menu, setMenu] = React.useState<Menu[]>();
  const [subMenu, setsubMenu] = React.useState<Menu[]>();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const menuLayout = await CacheService.getMenu();
        setMenu(menuLayout.data.filter((menu: any) => menu.parentId === null || menu.parentId === " "));
        setsubMenu(
          menuLayout.data.filter((menu: any) => menu.parentId !== null || menu.parentId === " ")
        );

      } catch {
        localStorage.clear();
        navigate("/Logout");
        msalInstance.logoutRedirect();
      }
    };

    fetchData();
  }, []);

  const handleClickModule = (menu: Menu, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault()

    if (subMenu?.find((subMenu: Menu) => subMenu.parentId === menu.folio)) {
      menu.folio === openModuleId ? setOpenModule("") : setOpenModule(menu.folio);

      if (menu.folio !== "") {
        setOpen(true);
      } else {
        setOpen(false);
      }

      ActiveModule(menu.folio);
    } else {
      if (menu.code) {
        openPage(menu.code, event.ctrlKey)
      }
    }
  };

  const ActiveModule = (moduleId: string) => {
    moduleId === activeModuleId
      ? setActiveModule("")
      : setActiveModule(moduleId);
  };

  const navigate = useNavigate();

  const openPage = (url: string, eventCtrlKey: boolean) => {
    let currentLocation = window.location.href;
    currentLocation = currentLocation.substring(
      currentLocation.indexOf("/index/") + 7,
      currentLocation.length
    );

    if (eventCtrlKey) {
      window.open(window.location.origin + '/index/' + url, '_blank',)
    } else {
      navigate(url);
    }

    if (currentLocation.substring(currentLocation.indexOf(url), url.length) === url) {
      window.location.reload();
    }
  };

  const checkMenu = (menuMame: string) => {
    const allowedValues = ['cobranza', 'conciliaciones', 'comisiones'];
    const upperMenuName = menuMame.toUpperCase();
    const upperAllowedValues = allowedValues.map(value => value.toUpperCase());

    if (upperAllowedValues.includes(upperMenuName) && !params) {
      return ('42px !important')
    } else {
      return ('0px')
    }
  }

  return (
    <>
      {menu ? (
        Object(menu)
          .sort((a: any, b: any) => (a.menuId > b.menuId ? 1 : -1))
          .map((menu: any) => (
            <Box key={menu.menuId}>
              <CustomTooltip
                title={
                  !params ? FormatData.stringPascalCaseFormat(menu.name) : ""
                }
                placement="right-start"
              >
                <Box
                  component="a"
                  onClick={(e) => handleClickModule(menu, e)}
                  className={
                    activeModuleId === menu.folio
                      ? styles["active"] +
                        " " +
                        styles[FormatData.stringPascalClassFormat(menu.name)]
                      : ""
                  }
                  sx={{ paddingRight: checkMenu(menu.name) }}
                >
                  <Stack direction="row" spacing={1} justifyItems="center">
                    <Box
                      component="div"
                      className={
                        styles["side-menu-img"] +
                        " " +
                        styles[FormatData.stringPascalClassFormat(menu.name)]
                      }                      
                    />
                    {Object(subMenu).filter(
                      (subMenu: any) => subMenu.parentId === menu.folio
                    ).length > 0 ? (
                      openModuleId === menu.folio && open ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : (
                      <></>
                    )}
                  </Stack>
                  <Box component="div" className={styles["side-menu-text"]}>
                    {FormatData.stringPascalCaseFormat(menu.name)}
                  </Box>
                </Box>
              </CustomTooltip>
              <Collapse
                in={openModuleId === menu.folio && open}
                timeout="auto"
                unmountOnExit
              >
                {Object(subMenu)
                  .filter((subMenu: any) => subMenu.parentId === menu.folio)
                  .sort((a: any, b: any) => (a.menuId > b.menuId ? 1 : -1))
                  .map((subMenu: any) => (
                    <Box key={subMenu.menuId}>
                      <CustomTooltip
                        title={
                          !params
                            ? FormatData.stringPascalCaseFormat(subMenu.name)
                            : ""
                        }
                        placement="right-start"
                      >
                        <Box
                          component="a"
                          onClick={(e) => {
                            e.preventDefault();
                            openPage(menu.code + subMenu.code, e.ctrlKey);
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyItems="center"
                          >
                            <Box
                              component="div"
                              className={
                                styles["side-menu-img"] +
                                " " +
                                styles[
                                  FormatData.stringPascalClassFormat(
                                    subMenu.name
                                  )
                                ]
                              }
                            />
                          </Stack>
                          <Box
                            component="div"
                            className={styles["side-menu-text"]}
                          >
                            {FormatData.stringPascalCaseFormat(subMenu.name)}
                          </Box>
                        </Box>
                      </CustomTooltip>
                    </Box>
                  ))}
              </Collapse>
            </Box>
          ))
      ) : (
        <></>
      )}
    </>
  );
}

export default ListSideBar;
