# Infra Arcana Monsterdex
## https://sites.google.com/site/infraarcana/home
## https://gitlab.com/martin-tornqvist/ia
### https://discordapp.com/channels/205277826788622337/342410354497814528

# Infra Arcana Monsterdex

A rolodex of monsters from the game Infra Arcana showing its text, graphics, audio, attributes, attacks, properties, ai, and spawning values.

## Getting Started

http://localhost:3000

### Prerequisites

Build-specific xml file and gfx (tiles only) from from ia src (ttps://gitlab.com/martin-tornqvist/ia). Clone to different location and copy files into this project.


```
ia\installed_files\data\monsters.xml
ia\installed_files\gfx\tiles\24x24installed_files\gfx\tiles\24x24\*.*
```

### Installing

Straight forward npm build.

```
npm install
```

### Sideloading IA resources
#### ia_resources being a clone of current verison of ia

```
cp ia_resources/ia/installed_files/data/monsters.xml .

cp -R ia_resources/ia/installed_files/gfx/tiles/24x24/. public/tiles/24x24/.
```

### Running

Straight forward node app.

```
node app.js
```

### Using

Straight forward http app.

```
http://localhost:3000
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on suggested code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to Martin Törnqvist for the game
