The current (expected to be legacy in no time) build process in jenkinsfedora
=============================================================================

There are 5 jobs involved in the build process of the spice-web-client in
jenkinsfedora. They are:

(note: all things related to spiceproxy have already been migrated)

1. [spice](https://jenkinsfedora.eyeosbcn.com:8080/view/spice-client/job/spice/)
   - Runs eyeos-gruntfile `grunt commit-stage`.
   - Increments the version of the eyeos-spiceproxy module (see below).
2. [spice_client_generate_artifacts](https://jenkinsfedora.eyeosbcn.com:8080/view/spice-client/job/spice_client_generate_artifacts/)
   - Generates the `spiceproxy.js` by calling `spiceproxy/concatenator.js`.
   - Compiles the spice web client into `all_compiled.js` and
     `WorkerProcess_c.js`, removes all unnecessary files and packs needed files
     into a .tar.gz file that will be used in last step to publish the library
     to the bower repo.
   - It then archives the `spiceproxy.js` and the .tar.gz in jenkins, to be
     used by the subsequent build steps.
3. [spice-client_publish_to_npm_repo](https://jenkinsfedora.eyeosbcn.com:8080/view/spice-client/job/spice-client_publish_to_npm_repo/)
   - publishes the archived artifact of `spiceproxy.js` to the npm repo under
     the name of `eyeos-spiceproxy`.
4. [spice_deploy_to_nexus](https://jenkinsfedora.eyeosbcn.com:8080/view/spice-client/job/spice_deploy_to_nexus/)
   - just publishes the .tar.gz to nexus (snapshots).
5. [spice-client_deploy_to_git](https://jenkinsfedora.eyeosbcn.com:8080/view/spice-client/job/spice-client_deploy_to_git/)
   - Unpacks the .tar.gz with the library and publishes it to the internal
     bower repo. As with all other frontend libraries published to the bower
     repo it involves two things: committing the library files to the
     appropiate `-artifacts` git repo (in this case
     `spice-web-client-artifacts.git`) and pushes the reference to this
     git artifacts repo to the bower repo using the `bower register package`
     jenkins's script.


eyeos-spiceproxy npm module
===========================

This is an npm module created from parts of the spice web client to be able to
intercept spice packages in websockify (spiceproxy is not used in the spice web
client).

In the generate-artifacts part of the build the spiceproxy.js file is generated
by the concatenation of the several files needed, and it is published to the
npm repo in the 'publish_to_npm_repo' job.
