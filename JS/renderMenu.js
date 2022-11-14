//FUNCTION THAT RENDERS THE ENTIRE MENU
function renderMenu(page) {
  //THE PAGE IS NECESSARY SO IT CAN ADD THE NECESSARY STYLE TO INDICATE THE PAGE THE USER IS CURRENTLY ON
  const main = document.getElementById("body");

  //create nav and sidemenu
  const nav = document.createElement("nav");
  const sidemenu = document.createElement("div");
  sidemenu.className = "sidemenu";

  /* MAIN LOGO */
  const logo = document.createElement("div");
  logo.className = "logo";
  const logo_icon = [
    "NBA+",
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#fd7e14" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="#fd7e14" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><path d="M60,60.2A95.9,95.9,0,0,1,88,128a95.9,95.9,0,0,1-28,67.8" fill="none" stroke="#fd7e14" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><path d="M196,60.2a96.1,96.1,0,0,0,0,135.6" fill="none" stroke="#fd7e14" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><line x1="32" y1="128" x2="224" y2="128" fill="none" stroke="#fd7e14" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="128" y1="32" x2="128" y2="224" fill="none" stroke="#fd7e14" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>',
  ];

  //eventListener when clicking on logo, redirects to the index page
  logo.addEventListener("click", () => {
    location.href = "./index.html";
  });

  //CREATE THE LOGO OF THE PAGE
  logo.innerHTML = logo_icon[1];
  const logo_text = document.createElement("p");
  logo_text.className = "logo-name";
  logo_text.textContent = logo_icon[0];
  logo.append(logo_text);
  logo.className = "logo";
  sidemenu.append(logo);

  /* MENU ICONS */
  const menu_icons = {
    home: [
      "Homepage",
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /> </svg>',
      "index.html",
    ],
    players: [
      "Players",
      '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="96" r="64" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="16"></circle><path d="M31,216a112,112,0,0,1,194,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>',
      "players.html",
    ],
    teams: [
      "Teams",
      '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M40,114.7V56a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8v58.7c0,84-71.3,111.8-85.5,116.5a7.2,7.2,0,0,1-5,0C111.3,226.5,40,198.7,40,114.7Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><line x1="128" y1="96" x2="128" y2="136" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="90" y1="123.6" x2="128" y2="136" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="104.5" y1="168.4" x2="128" y2="136" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="151.5" y1="168.4" x2="128" y2="136" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="166" y1="123.6" x2="128" y2="136" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>',
      "teams.html",
    ],
  };

  const menu = document.createElement("div");
  menu.className = "menu";
  const menu_title = document.createElement("p");
  menu_title.className = "sub-menu-title";
  menu_title.textContent = "MENU";
  menu.append(menu_title);
  const ul_menu = document.createElement("ul");

  for (let i in menu_icons) {
    const a_item = document.createElement("a");
    a_item.href = menu_icons[i][2];
    console.log("page", page);
    console.log("i", i);
    const li_item = document.createElement("li");
    if (page.includes(i)) {
      a_item.className = "menu-option option--active";
    } else {
      a_item.className = "menu-option";
    }

    //CREATION OF THE SUBMENU ITEMS THAT CONTAIN A ICON AND THE TEXT THAT IS STORED IN menu_icons
    a_item.innerHTML = menu_icons[i][1] + menu_icons[i][0];
    li_item.append(a_item);
    ul_menu.append(li_item);
  }

  menu.append(ul_menu);
  sidemenu.append(menu);

  nav.append(sidemenu);

  main.prepend(nav);
}
