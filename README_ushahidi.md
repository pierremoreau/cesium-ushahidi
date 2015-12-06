Information
===========


This is a fork of
[AnalyticalGraphicsInc/cesium](https://github.com/AnalyticalGraphicsInc/cesium)
with some added work to display data from a
[Ushahidi](https://www.ushahidi.com/) deployment and display it on a 3D~Globe
model, using Cesium, to help visualising what is happening and how it is
evolving.

At the moment, we rely on a dump of data from one of the Ushahidi deployments
and do not get live data from the platform. On the 3D~globe (not integrated yet
on the official website), you can see all the categories for the different
posts and select the one you would like to see. Each post is represented by a
small dot on the map, whose colour represents its status: grey dots were
closed, green one are being taken care of, blue ones are urgent but have been
verified yet, and red ones are urgent and verified.
Cesium allows the user to change the type of map being displayed, go to a place
by typing its address in the search field, and switch to a 3D modelisation of
the terrain.



Building/Running the Project
============================


First, you need to run `browserify Apps/ushahidi/main.js >
Apps/ushahidi/bundle.js`. Either before or after that step, you need to start a
web server, here by running `node server.js` (you will need nodejs). Finally,
to access the webpage, access `localhost:8080/Apps/ushahidi/main.js` using any
browser.



Licence
=======

This project uses the same licence as Cesium, which is Apache 2.0.



Contact
=======

Pierre Moreau (pierre.moreau@cs.lth.se)
Jesper Öqvist
Marcus Klang
