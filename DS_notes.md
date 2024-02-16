Frontend prototype: https://ds604.neocities.org/CoolestWebsiteOnTheInternet_02022024

#### notes:
prototype frontend, with the main sections: the viewer page, the artist upload page, and a music player. i made it in sort of the artist-oriented myspace style, where there might be the possibility of skinning the page with different themes, and users can put their own stuff on the page. there doesn't have to be too much for this, since frontend isn't really part of this class. but anyway, it might help to figure out what gets stored and delivered on the backend. the json list of songs would be the same regardless of the styling, but user customization might be an interesting issue, since it brings up issues like site security



```
basic json that i'm using for the site, to initialize the music player

[
            {
                metaData: {
                    artist: "Method Man feat. Busta Rhymes",
                    title: "What's Happenin'",
                },
                url: "https://ds604.neocities.org/Public/sound/02%20What's%20Happenin%20(Feat%20Busta%20Rh.mp3"
            },
            {
                metaData: {
                    artist: "Fugees",
                    title: "Vocab",
                },
                url: "https://ds604.neocities.org/Public/sound/Vocab%20(Refugees%20Hip%20Hop%20Remix).mp3"
            },
            {
                metaData: {
                    artist: "Kid Koala",
                    title: "Third World Lover"
                },
                url: "https://ds604.neocities.org/Public/sound/NeverForgiveAction_2%20Third%20World%20Lover.mp3"
            }
]
```
