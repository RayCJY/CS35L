#include <errno.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include "./options.h"
#include "./output.h"
#include "./rand64-hw.h"
#include "./rand64-sw.h"



int main(int argc, char **argv) {
    struct opts options;
    getOptions(argc, argv, &options);

    if (!options.status) {
        fprintf(stderr, "%s: Invalid usage. Format: %s NBYTES\n", argv[0], argv[0]);
        return 1;
    }

    long long nbytes = options.nbytes;
    if (nbytes == 0)
        return 0;

    void (*initialize)(void) = NULL;
    unsigned long long (*rand64)(void) = NULL;
    void (*finalize)(void) = NULL;

    bool rdrandAvailable = rdrand_supported();

    switch (options.input) {
        case BLANK:
            initialize = rdrandAvailable ? hardware_rand64_init : software_rand64_init;
            rand64 = rdrandAvailable ? hardware_rand64 : software_rand64;
            finalize = rdrandAvailable ? hardware_rand64_fini : software_rand64_fini;
            break;
        case RDRAND:
            if (!rdrandAvailable) {
                fprintf(stderr, "rdrand not available\n");
                return 1;
            }
            initialize = hardware_rand64_init;
            rand64 = hardware_rand64;
            finalize = hardware_rand64_fini;
            break;
        case MRAND48_R:
            initialize = hardware_rand64_init;
            rand64 = hardware_mrand48;
            finalize = hardware_rand64_fini;
            break;
        case SLASH_F:
            init(options.r_src);
            initialize = software_rand64_init;
            rand64 = software_rand64;
            finalize = software_rand64_fini;
            break;
        default:
            fprintf(stderr, "Unsupported input method\n");
            return 1;
    }

    initialize();
    int wordsize = sizeof(rand64());
    int output_errno = 0;

    if (options.output == STDOUT) {
        while (nbytes > 0) {
            unsigned long long x = rand64();
            int outbytes = nbytes < wordsize ? nbytes : wordsize;
            if (!writebytes(x, outbytes)) {
                output_errno = errno;
                break;
            }
            nbytes -= outbytes;
        }
        if (fclose(stdout) != 0) {
            output_errno = errno;
        }
    } else if (options.output == N) {
        unsigned int gbytes = options.size * 1000;
        char *buffer = malloc(gbytes);
        if (buffer == NULL) {
            perror("Memory allocation failed");
            finalize();
            return 1;
        }

        while (nbytes > 0) {
            int outbytes = nbytes < gbytes ? nbytes : gbytes;
            for (int i = 0; i < outbytes; i += sizeof(unsigned long long)) {
                unsigned long long x = rand64();
                memcpy(buffer + i, &x, sizeof(x));
            }
            write(1, buffer, outbytes);
            nbytes -= outbytes;
        }

        free(buffer);
    }

    finalize();
    if (output_errno) {
        errno = output_errno;
        perror("Output error");
        return 1;
    }

    return 0;
}