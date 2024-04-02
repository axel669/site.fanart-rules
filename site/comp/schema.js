export const schema = [
    {
        group: "Character Info",
        items: [
            {
                key: "char.name",
                type: "text",
                label: "Name"
            },
            {
                key: "char.race",
                type: "text",
                label: "Race/Species"
            },
            {
                key: "char.gender",
                type: "text",
                label: "Gender"
            },
        ]
    },
    {
        group: "SFW",
        items: [
            {
                key: "sfw",
                type: "choice",
                label: "",
                choices: ["Yes", "No", "Ask"],
                cols: 3,
            },
            {
                key: "sfw.tag",
                type: "text",
                label: "SFW Art Tag",
            },
        ],
    },
    {
        group: "NSFW",
        items: [
            {
                key: "nsfw",
                type: "choice",
                label: "",
                choices: ["Yes", "No", "Ask"],
                cols: 3,
            },
            {
                key: "nsfw.tag",
                type: "text",
                label: "NSFW Art Tag",
            },
            {
                group: "Groupings",
                items: [
                    { key: "nsfw.solo", type: "bool", label: "Solo" },
                    { key: "nsfw.homo", type: "bool", label: "Same Gender" },
                    { key: "nsfw.hetero", type: "bool", label: "Different Gender" },
                    { key: "nsfw.groups", type: "bool", label: "Groups (See Above)" },
                ]
            },
            {
                group: "Pairings",
                items: [
                    { key: "nsfw.mainstream", type: "bool", label: "Mainstream Characters" },
                    { key: "nsfw.ocs", type: "bool", label: "Self Inserts/OCs" },
                    { key: "nsfw.vtubers", type: "bool", label: "VTubers (General)" },
                    { key: "nsfw.friends", type: "bool", label: "VTubers (friends)" },
                ]
            },
            {
                group: "Positions",
                items: [
                    { key: "nsfw.top", type: "bool", label: "Top (Giving)" },
                    { key: "nsfw.bot", type: "bool", label: "Bottom (Receiving)" },
                    { key: "nsfw.vers", type: "bool", label: "Vers" },
                    { key: "nsfw.dom", type: "bool", label: "Dominant" },
                    { key: "nsfw.sub", type: "bool", label: "Submissive" },
                    { key: "nsfw.switch", type: "bool", label: "Switch" },
                ]
            },
            {
                group: "Cosmetic",
                items: [
                    { key: "nsfw.hair", type: "bool", label: "Change Hair" },
                    { key: "nsfw.race", type: "bool", label: "Change Species" },
                    { key: "nsfw.body", type: "bool", label: "Change Body Type" },
                    { key: "nsfw.genderswap", type: "bool", label: "Gender Swap" },
                ]
            },
            {
                group: "Genetalia",
                items: [
                    { key: "nsfw.male", type: "bool", label: "Male" },
                    { key: "nsfw.female", type: "bool", label: "Female" },
                    { key: "nsfw.alien", type: "bool", label: "Alien" },
                    { key: "nsfw.supernatural", type: "bool", label: "Supernatural" },
                ]
            },
            {
                group: "Clothes",
                items: [
                    { key: "nsfw.canon", type: "bool", label: "Canon" },
                    { key: "nsfw.cross", type: "bool", label: "Cross Dress" },
                    { key: "nsfw.cosplay", type: "bool", label: "Cosplay" },
                    { key: "nsfw.fetish", type: "bool", label: "Fetish (Latex, Leather)" },
                    { key: "nsfw.pet", type: "bool", label: "Pet (Collars, Ears, Tails)" },
                    { key: "nsfw.nude", type: "bool", label: "Nude" },
                ]
            },
            [
                {
                    key: "nsfw.kink.give",
                    type: "textarea",
                    label: "Kinks (Give)",
                },
                {
                    key: "nsfw.kink.take",
                    type: "textarea",
                    label: "Kinks (Receive)",
                },
            ],
            [
                {
                    key: "nsfw.favorite",
                    type: "textarea",
                    label: "Favorites",
                },
                {
                    key: "nsfw.nopers",
                    type: "textarea",
                    label: "Hard No",
                },
            ],
        ]
    }
]
