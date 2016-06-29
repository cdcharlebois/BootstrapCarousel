# BootStrap Carousel/ Form Carousel

This widget gives you the means to create a carousel similar to the style of bootstraps own using Mendix forms as your slides.

Authors
----
Eric Tieniber - [github](https://github.com/simonmartyr)

Based on a widget by:
Simon Martyr -  [email](mailto:simon.martyr@finaps.nl)   - [github](https://github.com/simonmartyr)


Typical usage scenario
----

[Bootstrap Example](http://getbootstrap.com/examples/carousel/)
/
[Mendix Live Example](https://www.finaps.nl)

![example](http://i.imgur.com/YFteUqt.png)

This widget gives the user the ability to embeded a list of forms and display them in a mendix application. It is touch-enabled to allow mobile users to swipe between forms.

Typical usage includes:
 - Welcome pages in a mobile app
 - Wizard
 
Features
---

- Display a list of Mendix pages in a list
- Responsive - using default bootstrap carousel CSS.
- highly flexable - can adjust a lot of what is shown via widget options or CSS. 
- Auto scroll, pause upon mouse hover etc. No additional js required. 

Limitations
---
 Wrap functionality is currently broken

Installation 
---

- Download the widget from the app store. 
- Configure the widget within the widget options.
- All done!

Description/configuration (Widget options)
---

![options](http://i.imgur.com/n2occmw.png)


- Context Object - Whether this widget is in the context of another entity
- ID - This gives the carousel an custom ID, if two carousels have the same ID you will get some funky behaviour to avoid this use differnt ids. 
- Enable controls - Show or hides the direction arrows controls. 
- Enable wrape - Controls whether the last image wraps back to the first one (CURRENTLY BROKEN, ALWAYS WRAPS)
- Scroll speed - millseconds of how fast the transition. 
- Show item dots - show or hides the counter dots. 


![Controls & dots](http://i.imgur.com/6fQSLvJ.png)

Known bugs
---
Currently known - Please feedback to the author if you encounter any. 

