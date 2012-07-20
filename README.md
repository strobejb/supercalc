Catch22 7Calc
-------------

7Calc is an programmer's expression calculator. It is the spiritual successor
to the original 'supercalc'. 7Calc is designed as a Windows 7 Desktop Gadget,
and is written in Javascript/HTML.

Visit the 7Calc/Supercalc homepage at:

www.catch22.net/software/7calc

7Calc is released under the MIT open source licence. 
Please refer to LICENCE.TXT for licencing terms and conditions.


Download
--------

7Calc is available as a prebuilt desktop gadget. See the [Downloads](/strobejb/supercalc/downloads) location. 


Building 7Calc
--------------

To package 7Calc as a gadget, zip the entire contents of the supercalc.gadget 
directory - and then rename the zip to 'supercalc.gadget'

There is a ruby build script in the 'publish' directory that automates this task:

    > cd publish
    > build.rb

The resulting supercalc.gadget file is ready to deploy


Development
-----------
To develop 7Calc, clone the supercalc repo to the supercalc.gadget directory:

    C:\Users\<user>\AppData\Local\Microsoft\Windows Sidebar\Gadgets\supercalc.gadget

    > cd 'c:\users\<user>\AppData\Local\Microsoft\Windows Sidebar\Gadgets'
    > git clone git@github.com:strobejb/supercalc.git supercalc.gadget



