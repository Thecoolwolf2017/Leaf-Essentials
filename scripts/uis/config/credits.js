import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import emojis from "../../api/emojis";
import { NUT_UI_HEADER_BUTTON, NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { themes } from "../uiBuilder/cherryThemes";
let useNewCreditsUI = true;

let creditsList = [
    {
        banner: `textures/leaf_dyn_images/trashybanner.jpg`,
        listname: `§bTrashyDaFox`,
        name: `TrashyDaFox`,
        NUT_UI_THEME: 15,
        role: `Main Developer and Founder`,
        // message: `leaf leaf leaf leaf leaf leaf leaf leaf leaf leaf leaf, azalea?!\n\nchronic strawberry eater\n(she/her btw)`,
        message: `§fDo §cnot §feat toenail clippings, §vI know from §bexperience§r§f...\n\nchronic strawberry eater\n(she/her btw)`,
        socials: {
            bsky: "ashyis.gay",
            discord: "ashyleafie",
        },
        icon: `textures/minidevs/gay`,
    },
    {
        name: `§vDal4y`,
        role: `Main graphics designer`,
        message: `Your propaganda bullshitt makes me sick, Murdered fascist make no noise`,
        socials: {
            discord: "dal4y",
        },
        icon: `textures/minidevs/Dal4y`,
    },

    {
        name: `§bPheonial`,
        role: `Main texture designer`,
        message: `I am just like trashy but not gay`,
        socials: {
            discord: "pheonial",
        },
        icon: `textures/minidevs/pheonial`,
    },
    {
        name: `§eFruitKitty`,
        role: `Helper dev and co-founder`,
        message: `I love oiled up big black men!`,
        socials: {
            bsky: "fruitkitty.xyz",
            discord: "fruitkitty",
        },
        icon: `textures/minidevs/TrashyKitty`,
    },
    {
        name: `§6Fluxic`,
        role: `leaf_icons namer`,
        message: `.`,
        icon: `textures/minidevs/fluxic`
    },
    {
        name: `§nAlex`,
        role: `Texture Designer`,
        socials: {
            discord: "i_ate_my_keyboard_i_think",
        },
        icon: `textures/minidevs/UpdatePings`,
        message: "WHAT THE FUCKK IS OATMEAL?!",
    },
    {
        name: `§dAlec`,
        role: `CherryUI theme designer`,
        message: `:V`,
        socials: {
            discord: "alec.kwke",
        },
        icon: `textures/minidevs/alec`,
    },
    {
        name: `§6DisBready`,
        role: `Community Manager`,
        socials: {
            discord: "disbready",
        },
        icon: "textures/minidevs/DisBready",
        message: "cat kitty cat cat kitty! nya :3",
    },
    {
        name: `§aAsteroid`,
        role: `Designer`,
        socials: {
            discord: `asteroid3946`,
        },
        icon: `textures/minidevs/Astroidboi`,
        // message: `i like femboys, but IM NOT GAY I SWEAR ON MY LIFE >_<`
        message: `helped somewhat but kinda useless now ngl`,
    },

    {
        type: "label",
        text: "Other Credits"
    },
    {
        name: `§vFeRaSs1429`,
        role: `Dark Mode Pack`,
        socials: {
            discord: `ferass1454`,
        },
        message: `sample text`,
        icon: `textures/minidevs/FeRaSs1429`,
    },
    {
        name: `bakedpotato4747`,
        role: `Toast System`,
        socials: {
            discord: `bakedpotato4747`
        },
        message: `...`
    }
];

uiManager.addUI(
    config.uiNames.ConfigCredits,
    "Credits",
    (player, index = -1) => {
        let form = new ActionForm();
        form.title(NUT_UI_TAG+NUT_UI_THEMED+themes[68][0]+"§r§fCredits");
        if (useNewCreditsUI) {
            if (index == -1) {
                let form = new ActionForm();
                form.title(NUT_UI_TAG+NUT_UI_THEMED+themes[68][0]+"§r§fCredits");
                form.button(
                    `${NUT_UI_HEADER_BUTTON}§r§cBack\n§7Goes Back`,
                    `textures/azalea_icons/2`,
                    (player) => {
                        uiManager.open(player, config.uiNames.ConfigRoot);
                    }
                );
                for (let i = 0; i < creditsList.length; i++) {
                    let entry = creditsList[i];
                    if(creditsList[i].type == "label") {
                        form.label(creditsList[i].text);
                        continue;
                    }
                    form.button(
                        `${entry.listname ? entry.listname : entry.name}\n§r§7${entry.role}`,
                        entry.icon,
                        (player) => {
                            uiManager.open(
                                player,
                                config.uiNames.ConfigCredits,
                                i
                            );
                        }
                    );
                }
                form.show(player, false, (player, response) => {});
            } else {
                let form = new ActionForm();
                let entry = creditsList[index];
                form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[entry.NUT_UI_THEME ? entry.NUT_UI_THEME : 56][0]}§r${entry.name}`);
                if(entry.banner) form.label(entry.banner)
                form.label(`§r${entry.message}`);
                form.button(
                    `${NUT_UI_HEADER_BUTTON}§r§cBack\n§7Goes Back`,
                    `textures/azalea_icons/2`,
                    (player) => {
                        uiManager.open(player, config.uiNames.ConfigCredits);
                    }
                );

                if (entry.socials.discord) {
                    form.button(
                        `§dDiscord\n§7${entry.socials.discord}`,
                        `textures/azalea_icons/CreditsUI/Discord`,
                        (player) => {
                            uiManager.open(
                                player,
                                config.uiNames.ConfigCredits,
                                index
                            );
                        }
                    );
                }
                if (entry.socials.bsky) {
                    form.button(
                        `§bBluesky\n§7@${entry.socials.bsky}`,
                        `textures/azalea_icons/CreditsUI/BSky`,
                        (player) => {
                            uiManager.open(
                                player,
                                config.uiNames.ConfigCredits,
                                index
                            );
                        }
                    );
                }
                form.show(player, false, (player, response) => {});
            }
        } else {
            // form.button("§dTheLegendaryTrashCan\n§7Main Developer", `textures/minidevs/trash2024`, (player)=>{
            form.button(
                "§dTrashyKitty\n§7Main Developer and Founder",
                `textures/minidevs/TrashyKittyNew`,
                (player) => {
                    uiManager.open(player, config.uiNames.ConfigRoot);
                }
            );
            form.button(
                "§eFruitKitty\n§7Helper dev and co-founder",
                `textures/minidevs/TrashyKitty`,
                (player) => {
                    uiManager.open(player, config.uiNames.ConfigRoot);
                }
            );
            form.button(
                "§6Hazel\n§7Emotional support",
                `textures/minidevs/DisBready`,
                (player) => {
                    uiManager.open(player, config.uiNames.ConfigRoot);
                }
            );
            // form.button("§aSapphire\n§7Emotional support", `textures/minidevs/AverageAzaleaUser3`, (player)=>{
            // uiManager.open(player, config.uiNames.ConfigRoot);
            // })
            form.button(
                "§aAsteroid\n§7Designer",
                `textures/minidevs/Astroidboi`,
                (player) => {
                    uiManager.open(player, config.uiNames.ConfigRoot);
                }
            );

            // form.button("§5Quxioo\n§7leaf butt plug user", `textures/minidevs/danser`, (player)=>{
            //     uiManager.open(player, config.uiNames.ConfigRoot);
            // })
            form.button(
                "§bmy dog\n§7shes extremely cute :3",
                `textures/leaf_icons/image-433`,
                (player) => {
                    uiManager.open(player, config.uiNames.ConfigRoot);
                }
            );
            // form.button("§aRexy Cloudy\n§7Fortnite balls", `textures/minidevs/icon`, (player)=>{
            //     uiManager.open(player, config.uiNames.ConfigRoot);
            // })
            // form.button("tbh rexy is kinda gay\n§7frfr (rexy is a tool)", `textures/items/settings`, (player)=>{
            // uiManager.open(player, config.uiNames.ConfigRoot);
            // })
            form.show(player, false, () => {});
        }
    }
);
