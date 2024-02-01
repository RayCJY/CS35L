/* Initialize the software rand64 implementation.  */
void software_rand64_init (void);

/* Return a random value, using software operations.  */
unsigned long long software_rand64 (void);

/*Initialize the file when /F is inputted*/
void init (char* file);

/* Finalize the software rand64 implementation.  */
void software_rand64_fini (void);