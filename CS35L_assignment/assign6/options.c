#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <stdbool.h>
#include "./options.h"

void getOptions(int argc, char **argv, struct opts* options) {
    options->status = false;
    options->input = BLANK;

    int opt;
    while ((opt = getopt(argc, argv, ":i:o:")) != -1) {
        switch(opt) {
            case 'i':
                if (strcmp("rdrand", optarg) == 0) {
                    options -> input = RDRAND;
                } else if (strcmp("mrand48_r", optarg) == 0) {
                    options -> input = MRAND48_R;
                } else if ('/' == optarg[0]) {
                    options -> input = SLASH_F;
                    options -> r_src = optarg;
                } else {
                    return;
                }
                options -> status = true;
                break;
            
            case 'o':
                if (strcmp("stdio", optarg) == 0) {
                    options -> output = STDOUT;
                } else {
                    options -> output = N;
                    options -> size = atoi(optarg);
                    if (options -> size == 0) {
                        fprintf (stderr, "Option -o N needs to be valid");
                        return;
                    }
                }
                options -> status = true;
                break;

            case ':':
                fprintf (stderr, "Option -%c needs an operand", optopt);
                return;

            case '?':
                fprintf (stderr, "Unrecognized optino: '-%c'", optopt);
        }
    }

    if (optind >= argc) {
        return;
    }

    options -> nbytes = atol(argv[optind]);
    if (options -> nbytes >= 0) {
        options -> status = true;
    }
}
