enum IP { BLANK, RDRAND, MRAND48_R, SLASH_F };
enum OP { STDOUT, N };

struct opts {
    bool status;
    long long nbytes;
    enum IP input;
    char* r_src;
    enum OP output;
    unsigned int size;
};

void getOptions(int argc, char **argv, struct opts* options);
