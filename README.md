# Skynet OS Simulator
Simple OS web-based simulator was made as a final project for the OS course at the university.  
The simulator includes a file manangement system, a schedueling simulator (very badly named as "Task manager") and a calculator that doesn't support the tirg. functions :"D.

This application is now published on github pages <a href="https://amrsaber.github.io/Skynet-OS-Simulator" target="_blank">here</a>, with username `root` and password `aammm`.

## Introduction To The Simulator
### Login Screen
When you open any page of the project and you are not logged in, you are redirected to the login screen to enter your credentials (credentials are in readme.md in code folder)
![Login Screen](https://i.imgur.com/Bplrqa9.png)
Then when you are logged in, you are redirected to the Home screen

### Home Screen
![Home Screen](https://i.imgur.com/DprfMBx.png)
The login screen offers the minimal gui needed to interact with the os, on the left is our action pannel, that goes to the file manager, the scheduler and the calculator, respectivly, and on the top right, the time is shown and a logout button is provided which does it's expected behaviour: Logout.

### The Calculator
![Calculator](https://i.imgur.com/6aRyPUF.png)
The calculator is pretty much basic, it does the basic arithmetics and powers and so, but it provides operator priority and calculates the result correctly  
(actually we made it because why not, and it has its own section here because I took a screenshot of it and decided why not too :"D)

### File Manager
![File Manager 1](https://i.imgur.com/bbhFi5A.png)
![File Manager 2](https://i.imgur.com/LHrYQkm.png)
Starting from here is the real stuff, this is a very well functioning file system that supports files and folders and supports the basic file operations such as (copy, cut, paste, rename)  
It shows the current file path, and provdes a back button, the files are saved on the browser cach so when you close the simulator and reopen it, you will find the files and folders you created as you left them, the files can be text, audio or video (audio and video get their content from a link, and they both have bugs :"D), the text is editable in double click so you can view and edit the content as needed.

### Scheduler
![Scheduler 1](https://i.imgur.com/CeTYIRW.png)
![Scheduler 2](https://i.imgur.com/UmIumlj.png)
I really love this sceduler (It was my part of the project), the idea is that it simulates how the os deals with the threads or the processes, it puts them in a schedule (FIFO queue in our case), then investes a quantum of time executing the head of the queue, then puts it at the end then handles the next, and so on.  
In our case the only possible task is writing a pre-defined text in a big box and the simulator provides control over the speed of the execution and the quantum of time given to each task (process).

## Technical Notes
* The simulator is all web-based, meaning that it was written in HTML, Javascript and CSS, with the help of some libraries like jQuery and Bootstrap (dependencies are included with the code in "assets" folder).

* The OS doesn't have huge security (javascript, remember ?), but the level of the security is good enough for a consistent simulator to demonstarte its basic concepts.

* During the whole project we had the motto of "Do it, then do it right, then do it better" and we kept repeating it, but pretty much most of the time we were satisfied at the stage of "Do it right" and didn't go any further :"D.

* This project is really cool, I advice you to try it and give us your feed back.


## Team Members
* [Amr Saber](https://github.com/AmrSaber)(Team leader, Me ^^)
* [Ahmed Kamal](https://github.com/ahmdkamal)
* [Muhammad Ahmed Abd El Mageed](https://github.com/aim97)
* [Muhammad Aref](https://github.com/MuhammadAref)
* [Muhammad Magdi](https://github.com/Muhammad-Magdi)

## Dependencies
* [jQuery](http://jquery.com)
* [Bootstrap](https://getbootstrap.com)
* [Font Awesome](https://fontawesome.com)  
All needed dependencies are included in the assets.
