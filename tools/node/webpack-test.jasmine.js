const jasmine = new (require('jasmine'))();
var config    = {
    "spec_dir": "build",
    "spec_files": [
        "**/*specs.js"
    ],
    "helpers": []
}
jasmine.loadConfig(config);
jasmine.execute();