# Installation Instructions

Please refer to the documentation at http://www.basecoatcss.com

```bower install --save basecoat-css```

# Installation Instructions for Development

Navigate on terminal to the project's root folder.

### Install node and npm
Download and install from http://nodejs.org/

### Install bower
On terminal run ```sudo npm install -g bower```  
http://bower.io/

### Install grunt
On terminal run ```sudo npm install -g grunt-cli```  
http://gruntjs.com/

### Update everything
On terminal run ```sudo npm install```  
On terminal run ```bower install```  

Navigate on terminal to the project's root folder.

On terminal run ```grunt watch```  

This will compile less files and build the static site with assemble.  

Every time you pull from the repo run ```npm install``` and ```bower install``` to make sure you have all dependencies up to date.

# Build Instructions

Navigate on terminal to the project's root folder.

On terminal run ```grunt build```  
This will concatenate and minify all assets and put the build inside the ```/build``` folder. This will generate a production ready version of the Basecoat site and generate all redistributable libraries like basecoat.min.css and basecoat.min.js.


# Roadmap

The following are additional features planned or considered for inclusion in Basecoat for next versions.

## Layouts
- vertical divider
- figures
- global sizes (Document)

## Forms
- range input skins

## Components
- progress-bars
- modaljs
- elevatorjs
- dropdownjs/checkbox dropdown
- collapsablejs
- tabsjs
- modaljs
- stickyjs
- ratingjs

## Views (New Section)
- Cards
- Comment
- Feed
