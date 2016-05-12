echo "this script is meant to be used to test the build package phase, which destroys the repository.\nThat's why it's meant to be copied to ../ and executed there."
rm -fr spice_testing_package
cp -R spice spice_testing_package

chown -R eyeos:eyeos spice_testing_package
cd spice_testing_package
./package.sh
#grunt package
#php cleaner.php
