Catch22 7Calc
-------------

7Calc is released under the MIT open source licence. Please refer to LICENCE.TXT for licencing terms and conditions.


Building 7Calc
--------------

7Calc is a Windows 7 Desktop Gadget

To package 7Calc as a gadget, zip the entire contents of the supercalc.gadget directory - and then rename the zip to 'supercalc.gadget'

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



