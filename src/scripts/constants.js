import { pageInitializer } from "./helpers";

export const SCROLL_DIRECTION = {
  TOP: true,
  DOWN: false,
};

export const PAGES = {
  ABOUT: 0,
  SKILLS: 1,
  EXPERIENCE: 2,
};

export const PAGESStr = {
  ABOUT: "ABOUT",
  SKILLS: "SKILLS",
  EXPERIENCE: "EXPERIENCE",
};

export const EXPERIENCE = [
  {
    company: "Pentalog",
    onLeft: true,
    positions: [
      {
        name: "Front-End Developer",
        pos: 0,
        shortDescription: `<span class='bold'>Digital Show Room</span> is a project where
                managers can prepare presentations for new products for biggest customers,
                where they provide all information about the products and the season for which they will be released.`,
      },
    ],
  },
  {
    company: "Amdaris",
    onLeft: false,
    positions: [
      {
        name: "Front-End Developer",
        pos: 0,
        shortDescription: `<span class='bold'>Electronic Payment System.</span> This service was developed for internal use of the company. The main goal of the project was to track and
                process all transactions within different departments of the company and clients. The main idea was to create
                a multi-level verification of a transaction depending on its cost level.`,
      },
      {
        name: "Full-Stack Developer",
        pos: 1,
        shortDescription: `<span class='bold'>Payment gateway.</span> The goal of the project was to create a service that quickly allowed the integration of the payment system in any web store.
                One of the key features of the project was the complete customization of pages for the client, including the logo and theme of the site.`,
      },
      {
        name: "Full Stack .NET Developer",
        pos: 2,
        shortDescription: `<span class='bold'> Automatic vehicle insurance system. </span> This project was developed for one of the closed yacht clubs for ship insurance. Thanks to this service, the
                club could quickly and flexibly set up an insurance contract for any club members anywhere in the world.`,
      },
    ],
  },
];
