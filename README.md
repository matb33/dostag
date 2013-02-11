# DOSTAG
### Proof of concept multiplayer game written using the [Meteor](http://www.meteor.com/) framework

DOSTAG is a simple multiplayer game in which you try to blow up other players with bombs. The level is a simple ASCII box-art text file.

## Why did I write this thing?

Lots of reasons:

1.	To show that Meteor can (almost) do multiplayer gaming apps;
2.	To provide the Meteor core team with a test application to optimize network performance;
3.	For me to finally put a Meteor app up on GitHub (I've written many, but never open sourced);
4.	To take me back to the simpler times of text games, if only for a little while...

## Why does it look like a game written in QuickBASIC circa 1994?

This is an intentional throwback to one of my more popular games that I wrote back in high school. However, it only supported two players, and they had to share the same keyboard. It certainly was a more intimate gaming experience! This new version has the benefit of scaling beyond a single keyboard, thanks to the amazing things 20 years of technology have made possible. Amazing.

## What's with `define` and `using` everywhere?

It's a take on AMD (asychronous module definition), but adapted for Meteor. This is a personal choice, but one I highly recommend nonetheless. You can find the source of [Meteor SMD](https://github.com/matb33/meteor-smd/), written by yours truly, on GitHub.

## Are you going to polish this game?

Not actively. It's only meant as a proof of concept — and besides... it's really awful to look at (intentionally). I will probably make minor improvements, but no guarantees. I have other things to do.

On that topic, there is huge room for improvement. Feel free to fork this project, change it, learn from it, build on it, whatever. Here are some thoughts:

-	Speed/network optimizations are needed. I have gone through several techniques already, but my game coding experience is rather limited. I'm probably re-inventing the wheel (badly) on several fronts... Perhaps game developers who are dabbling in Meteor could use this code as a starting point and put their expertise into making it a more fluid experience. I'm sure some of it has to do with Meteor itself, considering it's not intended for this type of use case!

-	The "viewport" template could literally be renamed "canvas". I'm literally rendering to text instead of graphics. It would be a no-brainer to replace it with a canvas and go old-school Zelda on this thing.

-	I never got around to figuring out a good approach to locking down certain collections. I think with some more time, I would eventually figure out the right approach. If you dive in to the code, you'll notice how I open up certain collections for client modification. This needs to be fixed to avoid cheating.

-	For very large maps, I'd recommend going with a different approach for rendering the map on-screen. Currently, the player is always centered and the map is drawn around the player. In order to minimize network traffic, I would change the approach to have the player move around within a screenful and when moving beyond the edge, change screens. You would then have better control over the amount of data a client should receive.

-	Both the napalm and pickaxe weapons were disabled due to some lag issues. I haven't figured this one out, but I suspect it's because they are "chatty" weapons, i.e. they affect collections repeatedly, very quickly. I decided to disable them and added the "bolt" weapon.

-	One could probably write a separate Meteor app that acted as a game server browser. Then several game servers could be launched, i.e. gameinstance01.meteor.com, gameinstance02.meteor.com, etc. The game server browser app would connect you to the appropriate instance.